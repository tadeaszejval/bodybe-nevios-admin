"use client";
import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
  genericColumnFactory,
  dateColumnFactory,
  numericColumnFactory,
  clickableColumnFactory,
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { NeviosBadge } from "../../nevios/NeviosBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { useUrlFilters } from "../../../hooks/useUrlFilters";
import { BACKORDERS_FILTER_CONFIG } from "../../nevios/NeviosFilters/BackordersFilterConfig";

export function BackordersTable({ 
  tableHeight,
  initialFilters = {},
  initialSearch = ""
}) {
  // Use URL filters hook for persistence
  const { filters: urlFilters, updateFilters: updateUrlFilters, isInitialized } = useUrlFilters(initialFilters);

  // Transform raw backorder data to table format
  const transformBackorderData = useCallback((backorders) => {
    // Validate array input
    if (!Array.isArray(backorders)) {
      console.warn('Expected array but received:', typeof backorders);
      return [];
    }
    
    return backorders.map(backorder => {
      // Check if expansion worked (objects vs strings)
      const variant = typeof backorder.variant === 'object' ? backorder.variant : null;
      const location = typeof backorder.location === 'object' ? backorder.location : null;
      const order = typeof backorder.order === 'object' ? backorder.order : null;
      const orderItem = typeof backorder.order_item === 'object' ? backorder.order_item : null;

      return {
        id: backorder.id,
        backorder_name: backorder.id, // Use ID as the name field
        created_at: backorder.created_at,
        status: backorder.status,
        order_name: order?.name || 'Unknown Order',
        order_id: typeof backorder.order === 'string' ? backorder.order : order?.id,
        variant_title: variant?.full_title || variant?.title || 'Unknown Variant',
        sku: variant?.sku || '-',
        location_name: location?.name || 'Unknown Location',
        quantity_requested: backorder.quantity_requested || 0,
        quantity_reserved: backorder.quantity_reserved || 0,
        quantity_remaining: backorder.quantity_remaining || 0,
        priority: backorder.priority || 0,
        auto_fulfill: backorder.auto_fulfill || false,
        customer_notified: backorder.customer_notified || false,
        expected_restock_date: backorder.expected_restock_date || null,
        notes: backorder.notes || '-',
        // Store IDs for reference
        variant_id: typeof backorder.variant === 'string' ? backorder.variant : variant?.id,
        location_id: typeof backorder.location === 'string' ? backorder.location : location?.id,
        order_item_id: typeof backorder.order_item === 'string' ? backorder.order_item : orderItem?.id,
        // Keep original data for reference
        _original: backorder
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
  } = useModuleQuery('backorder', {
    expand: ["variant", "location", "order", "order_item"],
    externalFilters: isInitialized ? urlFilters : initialFilters,
    onFiltersChange: updateUrlFilters,
    initialSearch,
    enableSearch: true,
    transformData: transformBackorderData,
    autoFetch: isInitialized // Only fetch after URL filters are initialized
  });

  const columnDefinitions = [
    dateColumnFactory({
      field: "created_at",
      headerName: "Created",
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
      field: "status",
      headerName: "Status",
      flex: 1.2,
      minWidth: 130,
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
          <NeviosBadge value={params.value} configKey="backorderStatus" />
        </Box>
      ),
    }),
    clickableColumnFactory({
      field: "order_name",
      headerName: "Order",
      minWidth: 150,
      flex: 1.5,
      link: (params) => params.row.order_id ? `/dashboard/orders/${params.row.order_id}` : null,
    }),
    genericColumnFactory({
      field: "variant_title",
      headerName: "Product Variant",
      minWidth: 200,
      flex: 2.5,
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
          {params.row.sku && params.row.sku !== '-' && (
            <Box 
              component="span"
              sx={{ 
                fontSize: "xs", 
                fontFamily: "monospace",
                color: "gray.600",
              }}>
              {params.row.sku}
            </Box>
          )}
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
    numericColumnFactory({
      field: "quantity_requested",
      headerName: "Requested",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "sm",
            fontWeight: 600,
            color: "gray.700",
          }}
        >
          {formatCurrencyNumber(params.value, 0)}
        </Box>
      ),
    }),
    numericColumnFactory({
      field: "quantity_reserved",
      headerName: "Reserved",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "sm",
            fontWeight: 600,
            color: params.value > 0 ? "green.600" : "gray.500",
          }}
        >
          {formatCurrencyNumber(params.value, 0)}
        </Box>
      ),
    }),
    numericColumnFactory({
      field: "quantity_remaining",
      headerName: "Remaining",
      minWidth: 100,
      flex: 0.9,
      renderCell: (params) => {
        const isFullyFulfilled = params.value <= 0;
        return (
          <Box
            sx={{
              width: "100%",
              lineHeight: 2,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              px: 0.5,
              color: isFullyFulfilled ? "green.600" : "red.600",
              fontWeight: 500,
              backgroundColor: isFullyFulfilled ? "green.50" : "red.50",
              borderRadius: "4px",
              height: "fit-content",
              fontSize: "sm"
            }}>
              {formatCurrencyNumber(params.value, 0)}
            </Box>
          </Box>
        );
      },
    }),
    numericColumnFactory({
      field: "priority",
      headerName: "Priority",
      minWidth: 90,
      flex: 0.7,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "sm",
            fontWeight: params.value > 0 ? 700 : 500,
            color: params.value > 0 ? "orange.600" : "gray.500",
          }}
        >
          {params.value}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "auto_fulfill",
      headerName: "Auto-Fulfill",
      minWidth: 120,
      flex: 1,
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
          <NeviosBadge value={params.value} configKey="autoFulfill" />
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "notes",
      headerName: "Notes",
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
        filterConfigs={BACKORDERS_FILTER_CONFIG}
        activeFilters={filters}
        onFiltersChange={updateFilters}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={updateSearch}
        searchPlaceholder="Search backorders by order, product, SKU, or notes..."
        checkboxSelection={true}
        getRowId={(row) => row.id}
        emptyStateProps={{
          title: 'No backorders found',
          description: 'There are no backorders to display',
        }}
      />
    </Box>
  );
}
