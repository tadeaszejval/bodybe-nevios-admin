"use client";
import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
  genericColumnFactory,
  dateColumnFactory,
  numericColumnFactory,
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { NeviosBadge } from "../../nevios/NeviosBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { useUrlFilters } from "../../../hooks/useUrlFilters";
import { STOCK_MOVEMENTS_FILTER_CONFIG } from "../../nevios/NeviosFilters/StockMovementsFilterConfig";

export function StockMovementsTable({ 
  tableHeight,
  initialFilters = {},
  initialSearch = ""
}) {
  // Use URL filters hook for persistence
  const { filters: urlFilters, updateFilters: updateUrlFilters, isInitialized } = useUrlFilters(initialFilters);

  // Transform raw stock movement data to table format
  const transformStockMovementData = useCallback((movements) => {
    // Validate array input
    if (!Array.isArray(movements)) {
      console.warn('Expected array but received:', typeof movements);
      return [];
    }
    
    return movements.map(movement => {
      // Check if expansion worked (variant/location would be objects, not strings)
      const variant = typeof movement.variant === 'object' ? movement.variant : null;
      const product = variant?.product || null;
      const location = typeof movement.location === 'object' ? movement.location : null;
      const relatedLocation = typeof movement.related_location === 'object' ? movement.related_location : null;
      const orderItem = typeof movement.order_item === 'object' ? movement.order_item : null;

      return {
        id: movement.id,
        stock_movement_name: movement.id, // Use ID as the name field
        created_at: movement.created_at,
        movement_type: movement.movement_type,
        product_title: product?.title || variant?.title || 'Unknown Product',
        variant_title: variant?.title || 'Default Variant',
        sku: variant?.sku || '-',
        location_name: location?.name || 'Unknown Location',
        related_location_name: relatedLocation?.name || null,
        quantity: movement.quantity || 0,
        note: movement.note || '-',
        order_reference: orderItem?.order || null,
        // Store IDs for reference
        variant_id: typeof movement.variant === 'string' ? movement.variant : movement.variant?.id,
        location_id: typeof movement.location === 'string' ? movement.location : movement.location?.id,
        product_id: product?.id,
        // Keep original data for reference
        _original: movement
      };
    });
  }, []);

  // Use the module query hook with URL-synced filters
  const {
    data,
    loading,
    error,
    totalCount,
    pagination,
    sortModel,
    filters,
    searchTerm,
    handlePaginationChange,
    handleSortChange,
    refreshData,
    updateFilters,
    updateSearch
  } = useModuleQuery('inventory_movement', {
    expand: ["variant", "location", "variant.product", "related_location", "order_item"],
    externalFilters: isInitialized ? urlFilters : initialFilters,
    onFiltersChange: updateUrlFilters,
    initialSearch,
    enableSearch: true,
    transformData: transformStockMovementData,
    autoFetch: isInitialized // Only fetch after URL filters are initialized
  });

  const columnDefinitions = [
    dateColumnFactory({
      field: "created_at",
      headerName: "Date",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            color: "gray.600",
          }}
        >
          {formatReadableDatetime(params.value)}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "movement_type",
      headerName: "Type",
      flex: 1.5,
      minWidth: 140,
      renderCell: (params) => (
        <Box
          sx={{
            lineHeight: 1.2,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <NeviosBadge value={params.value} configKey="movementType" />
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "product_title",
      headerName: "Product",
      minWidth: 200,
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            lineHeight: 1.2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Box sx={{ fontWeight: 500, fontSize: "s" }}>{params.value}</Box>
          {params.row.variant_title && params.row.variant_title !== 'Default Variant' && (
            <Box 
              component="span"
              sx={{ 
                fontSize: "xs", 
                fontWeight: 600, 
                backgroundColor: "gray.200", 
                padding: "2px 6px", 
                borderRadius: "4px",
                display: "inline-block",
                width: "fit-content",
              }}>
              {params.row.variant_title}
            </Box>
          )}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "sku",
      headerName: "SKU",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            fontFamily: "monospace",
            color: "gray.600",
          }}
        >
          {params.value}
        </Box>
      ),
    }),
    numericColumnFactory({
      field: "quantity",
      headerName: "Quantity",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "sm",
            fontWeight: 600,
            color: params.value > 0 ? "green.600" : params.value < 0 ? "red.600" : "gray.600",
          }}
        >
          {params.value > 0 ? '+' : ''}{formatCurrencyNumber(params.value, 0)}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "location_name",
      headerName: "Location",
      minWidth: 150,
      flex: 1.5,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            color: "gray.700",
          }}
        >
          {params.value}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "related_location_name",
      headerName: "Related Location",
      minWidth: 150,
      flex: 1.5,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            color: "gray.600",
          }}
        >
          {params.value || '-'}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "note",
      headerName: "Note",
      minWidth: 200,
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            color: "gray.600",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.value}
        </Box>
      ),
    }),
  ];

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <NeviosEnhancedTable
        columns={columnDefinitions}
        data={data}
        loading={loading}
        error={error}
        totalCount={totalCount}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        sortModel={sortModel}
        onSortChange={handleSortChange}
        tableHeight={tableHeight}
        hideFooter={false}
        enableFilters={true}
        filterConfigs={STOCK_MOVEMENTS_FILTER_CONFIG}
        activeFilters={filters}
        onFiltersChange={updateFilters}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={updateSearch}
        searchPlaceholder="Search stock movements by product, SKU, location, or note..."
        checkboxSelection={true}
        getRowId={(row) => row.id}
        emptyStateProps={{
          title: 'No stock movements found',
          description: 'There are no stock movements to display',
        }}
      />
    </Box>
  );
}
