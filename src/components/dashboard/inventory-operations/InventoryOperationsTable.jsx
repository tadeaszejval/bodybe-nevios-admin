"use client";
import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
  genericColumnFactory,
  dateColumnFactory,
  clickableColumnFactory,
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime } from "../../../core/formatters";
import { NeviosBadge } from "../../nevios/NeviosBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { useUrlFilters } from "../../../hooks/useUrlFilters";
import { INVENTORY_OPERATIONS_FILTER_CONFIG } from "../../nevios/NeviosFilters/InventoryOperationsFilterConfig";

export function InventoryOperationsTable({ 
  tableHeight,
  initialFilters = {},
  initialSearch = ""
}) {
  // Use URL filters hook for persistence
  const { filters: urlFilters, updateFilters: updateUrlFilters, isInitialized } = useUrlFilters(initialFilters);

  // Transform raw inventory operation data to table format
  const transformInventoryOperationData = useCallback((operations) => {
    // Validate array input
    if (!Array.isArray(operations)) {
      console.warn('Expected array but received:', typeof operations);
      return [];
    }
    
    return operations.map(operation => {
      // Check if expansion worked (location would be object, not string)
      const location = typeof operation.location === 'object' ? operation.location : null;

      return {
        id: operation.id,
        inventory_operation_name: operation.name || operation.id,
        created_at: operation.created_at,
        type: operation.type,
        status: operation.status,
        location_name: location?.name || 'Unknown Location',
        location_code: location?.code || '-',
        source_type: operation.source_type || '-',
        source_reference: operation.source_reference || '-',
        created_by: operation.created_by || 'Unknown',
        processed_by: operation.processed_by || '-',
        processed_at: operation.processed_at || null,
        completed_at: operation.completed_at || null,
        notes: operation.notes || '-',
        // Store IDs for reference
        location_id: typeof operation.location === 'string' ? operation.location : location?.id,
        // Keep original data for reference
        _original: operation
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
  } = useModuleQuery('inventory_operation', {
    expand: ["location"],
    externalFilters: isInitialized ? urlFilters : initialFilters,
    onFiltersChange: updateUrlFilters,
    initialSearch,
    enableSearch: true,
    transformData: transformInventoryOperationData,
    autoFetch: isInitialized // Only fetch after URL filters are initialized
  });

  const columnDefinitions = [
    clickableColumnFactory({
      field: "inventory_operation_name",
      headerName: "Operation",
      minWidth: 150,
      flex: 1.5,
      link: (params) => `/dashboard/inventory-operations/${params.id}`,
    }),
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
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 120,
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
          <NeviosBadge value={params.value} configKey="inventoryOperationType" />
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
          <NeviosBadge value={params.value} configKey="inventoryOperationStatus" />
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
          {params.row.location_code && params.row.location_code !== '-' && (
            <Box 
              component="span"
              sx={{ 
                fontSize: "xs", 
                fontFamily: "monospace",
                color: "gray.600",
              }}>
              {params.row.location_code}
            </Box>
          )}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "source_type",
      headerName: "Source Type",
      minWidth: 150,
      flex: 1.5,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            color: "gray.700",
          }}
        >
          {params.value.replace(/_/g, ' ')}
        </Box>
      ),
    }),
    genericColumnFactory({
      field: "source_reference",
      headerName: "Reference",
      minWidth: 150,
      flex: 1.5,
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
      field: "created_by",
      headerName: "Created By",
      minWidth: 140,
      flex: 1.3,
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
      field: "processed_by",
      headerName: "Processed By",
      minWidth: 140,
      flex: 1.3,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            color: params.value !== '-' ? "gray.700" : "gray.400",
          }}
        >
          {params.value}
        </Box>
      ),
    }),
    dateColumnFactory({
      field: "completed_at",
      headerName: "Completed",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box
          sx={{
            fontSize: "s",
            color: params.value ? "gray.600" : "gray.400",
          }}
        >
          {params.value ? formatReadableDatetime(params.value) : '-'}
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
        filterConfigs={INVENTORY_OPERATIONS_FILTER_CONFIG}
        activeFilters={filters}
        onFiltersChange={updateFilters}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={updateSearch}
        searchPlaceholder="Search operations by name, reference, location, or notes..."
        checkboxSelection={true}
        getRowId={(row) => row.id}
        emptyStateProps={{
          title: 'No inventory operations found',
          description: 'There are no inventory operations to display',
        }}
      />
    </Box>
  );
}
