"use client";
import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
	currencyColumnFactory,
	dateColumnFactory,
	genericColumnFactory,
	clickableColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { NeviosBadge } from "../../nevios/NeviosBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { useUrlFilters } from "../../../hooks/useUrlFilters";
import { RETURNS_FILTER_CONFIG } from "../../nevios/NeviosFilters/ReturnsFilterConfig";

export function ReturnsTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {
	// Use URL filters hook for persistence
	const { filters: urlFilters, updateFilters: updateUrlFilters, isInitialized } = useUrlFilters(initialFilters);

	// Transform raw return data to table format
	const transformReturnData = useCallback((returns) => {
		if (!Array.isArray(returns)) {
			console.warn('Expected array but received:', typeof returns);
			return [];
		}

		return returns.map(returnRecord => ({
			id: returnRecord.id,
			return_name: returnRecord.return_number,
			status: returnRecord.status,
			type: returnRecord.type,
			reason: returnRecord.reason,
			resolution: returnRecord.resolution,
			created_at: returnRecord.requested_at || returnRecord.created_at,
			customer_name: returnRecord.customer?.full_name || 'Unknown Customer',
			customer_id: returnRecord.customer?.id,
			order_name: returnRecord.order?.order_number || returnRecord.order?.name || 'N/A',
			order_id: returnRecord.order?.id,
			total_refund_amount: returnRecord.total_refund_amount || 0,
			currency: returnRecord.currency || 'USD',
			refund_processed: returnRecord.refund_processed,
			location_name: returnRecord.location?.name || 'Not assigned',
			item_count: returnRecord.items?.length || 0,
			// Keep original data for reference
			_original: returnRecord
		}));
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
	} = useModuleQuery('return', {
		expand: ["customer", "order", "location", "items"],
		externalFilters: isInitialized ? urlFilters : initialFilters,
		onFiltersChange: updateUrlFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformReturnData,
		autoFetch: isInitialized // Only fetch after URL filters are initialized
	});

	const columnDefinitions = [
		clickableColumnFactory({
			field: "return_name",
			headerName: "Return ID",
			minWidth: 150,
			link: (params) => `/dashboard/returns/${params.id}`
		}),
		genericColumnFactory({
			field: "status",
			headerName: "Status",
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
					<NeviosBadge value={params.value} configKey="returnStatus" />
				</Box>
			),
		}),
		dateColumnFactory({
			field: "created_at",
			headerName: "Requested",
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
			field: "customer_name",
			headerName: "Customer",
			minWidth: 180,
			flex: 2,
		}),
		genericColumnFactory({
			field: "order_name",
			headerName: "Order",
			minWidth: 120,
			flex: 1,
		}),
		genericColumnFactory({
			field: "type",
			headerName: "Type",
			flex: 1.2,
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
					<NeviosBadge value={params.value} configKey="returnType" />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "reason",
			headerName: "Reason",
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
					<NeviosBadge value={params.value} configKey="returnReason" />
				</Box>
			),
		}),
		currencyColumnFactory({
			field: "total_refund_amount",
			headerName: "Refund Amount",
			minWidth: 140,
			flex: 1.2,
			renderCell: (params) => (
				<Box>
					{params.row.currency} {formatCurrencyNumber(params.value)}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "resolution",
			headerName: "Resolution",
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
					<NeviosBadge value={params.value} configKey="returnResolution" />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "refund_processed",
			headerName: "Refund Status",
			flex: 1.3,
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
					<NeviosBadge value={params.value} configKey="refundProcessed" showDot={true} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "location_name",
			headerName: "Location",
			flex: 1.5,
			minWidth: 150,
		}),
		genericColumnFactory({
			field: "item_count",
			headerName: "Items",
			flex: 0.8,
			minWidth: 80,
			renderCell: (params) => (
				<Box
					sx={{
						fontSize: "s",
						color: "gray.500",
						display: "flex",
						alignItems: "center",
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
				filterConfigs={RETURNS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search returns by return number, customer, order number, or tracking..."
				checkboxSelection={true}
				getRowId={(row) => row.id}
				emptyStateProps={{
					title: 'No returns found',
					description: 'There are no returns to display',
				}}
				sx={{
					"& .MuiDataGrid-row": {
						cursor: "pointer",
					},
				}}
				getRowClassName={(params) => {
					if (params.row.status === "REJECTED" || params.row.status === "CANCELLED") {
						return "datagrid-row-error";
					}
					return "";
				}}
			/>
		</Box>
	);
}
