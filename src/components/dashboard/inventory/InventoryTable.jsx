"use client";
import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
  genericColumnFactory,
  numericColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatCurrencyNumber } from "../../../core/formatters";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { INVENTORY_FILTER_CONFIG } from "../../nevios/NeviosFilters/InventoryFilterConfig";

// Helper function to transform filters for API
const transformFiltersForAPI = (filters) => {
  const apiFilters = {};
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Handle numeric operator filters (available, reserved, quantity)
    if (value && typeof value === 'object' && value.filterKey) {
      // Use the dynamic filter key (e.g., 'available_gt', 'reserved_lt')
      apiFilters[value.filterKey] = value.number;
    } else {
      // Regular filters (like location)
      apiFilters[key] = value;
    }
  });
  
  return apiFilters;
};

export function InventoryTable({ 
  tableHeight,
  initialFilters = {},
  initialSearch = ""
}) {
  // Transform raw inventory data to table format
  const transformInventoryData = useCallback((inventoryItems) => {
    // Ensure inventoryItems is an array
    if (!Array.isArray(inventoryItems)) {
      return [];
    }
    
    return inventoryItems.map(item => {
      // Check if expansion worked (variant/location would be objects, not strings)
      const variant = typeof item.variant === 'object' ? item.variant : null;
      const location = typeof item.location === 'object' ? item.location : null;

      return {
        id: item.id,
        variant_full_title: variant?.full_title || 'Unknown Variant',
        sku: item.sku || variant?.sku || 'N/A',
        location_name: location?.name || 'Unknown Location',
        location_type: location?.type || 'N/A',
        available: item.available || 0,
        reserved: item.reserved || 0,
        quantity: item.quantity || 0,
        // Store IDs for reference
        variant_id: typeof item.variant === 'string' ? item.variant : item.variant?.id,
        location_id: typeof item.location === 'string' ? item.location : item.location?.id,
        // Keep original data for reference
        _original: item
      };
    });
  }, []);

  // Use the module query hook
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
  } = useModuleQuery('inventory', {
    expand: ["variant", "location"],
    initialFilters,
    initialSearch,
    enableSearch: true,
    transformData: transformInventoryData,
    method: 'GET' // Inventory uses GET requests
  });

  // Handle filter changes with transformation for numeric operators
  const handleFiltersChange = useCallback((newFilters) => {
    const transformedFilters = transformFiltersForAPI(newFilters);
    updateFilters(transformedFilters);
  }, [updateFilters]);

  const columnDefinitions = [
    genericColumnFactory({
      field: "variant_full_title",
      headerName: "Product",
      minWidth: 140,
      flex: 2.5,
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
    genericColumnFactory({
      field: "location_name",
      headerName: "Location",
      minWidth: 150,
      flex: 1.5,
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
        </Box>
      ),
    }),
    numericColumnFactory({
      field: "available",
      headerName: "Available",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "sm",
            fontWeight: 600,
          }}
        >
          {formatCurrencyNumber(params.value, 0)}
        </Box>
      ),
    }),
    numericColumnFactory({
      field: "reserved",
      headerName: "Reserved",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "sm",
          }}
        >
          {formatCurrencyNumber(params.value, 0)}
        </Box>
      ),
    }),
    numericColumnFactory({
      field: "quantity",
      headerName: "Total Qty",
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "sm",
            fontWeight: 500,
          }}
        >
          {formatCurrencyNumber(params.value, 0)}
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
        filterConfigs={INVENTORY_FILTER_CONFIG}
        activeFilters={filters}
        onFiltersChange={handleFiltersChange}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={updateSearch}
        searchPlaceholder="Search inventory by product, SKU, or location..."
        emptyStateProps={{
          title: 'No inventory found',
          description: 'There are no inventory records to display',
        }}
      />
    </Box>
  );
}

