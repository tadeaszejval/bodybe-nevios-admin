"use client";
import { Box, Link } from "@mui/material";
import React, { useCallback } from "react";
import {
	dateColumnFactory,
	genericColumnFactory,
	clickableColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime } from "../../../core/formatters";
import { NeviosBadge } from "../../nevios/NeviosBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { FULFILLMENTS_FILTER_CONFIG } from "../../nevios/NeviosFilters/FulfillmentsFilterConfig";
import { TbExternalLink } from "react-icons/tb";

export function FulfillmentTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {

	// Transform raw fulfillment data to table format
	const transformFulfillmentData = useCallback((fulfillments) => {
		return fulfillments.map(fulfillment => ({
			id: fulfillment.id,
			name: fulfillment.name || 'Unknown Fulfillment',
			type: fulfillment.type || 'standard',
			status: fulfillment.status || 'UNFULFILLED',
			tracking: fulfillment.tracking || 'N/A',
			tracking_link: fulfillment.tracking_link || null,
			carrier_name: fulfillment.carrier_name || 'Unknown',
			delivery_status: fulfillment.delivery_status || 'PENDING',
			shipping_type: fulfillment.shipping_type || 'standard',
			external_name: fulfillment.external_name || fulfillment.carrier_name || 'Unknown',
			created_at: fulfillment.created_at,
			customer_name: fulfillment.customer ? 
				`${fulfillment.customer.first_name || ''} ${fulfillment.customer.last_name || ''}`.trim() : 
				'Unknown Customer',
			order_name: fulfillment.order?.name || 'Unknown Order',
			order_id: fulfillment.order?.id || fulfillment.order,
			// Keep original data for reference
			_original: fulfillment
		}));
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
	} = useModuleQuery('fulfillment', {
		expand: ["customer", "order", "shipping_address"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformFulfillmentData
	});

	const columnDefinitions = [
		clickableColumnFactory({
			field: "name",
			headerName: "Fulfillment",
			minWidth: 180,
			flex: 2,
			link: (params) => `/dashboard/fulfillments/${params.id}`,
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
					<Box sx={{ fontWeight: 500 }}>{params.value || 'Unknown'}</Box>
					<Box sx={{ fontSize: "xs", color: "gray.500" }}>{params.row.type}</Box>
				</Box>
			),
		}),
		genericColumnFactory({
			field: "order_name",
			headerName: "Order",
			minWidth: 140,
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
					<Link
						href={`/dashboard/orders/${params.row.order_id}`}
						sx={{
							fontWeight: 500,
							color: "primary.main",
							textDecoration: "none",
							"&:hover": {
								textDecoration: "underline",
							},
						}}
					>
						{params.value}
					</Link>
					<Box sx={{ fontSize: "xs", color: "gray.500" }}>{params.row.customer_name}</Box>
				</Box>
			),
		}),
		genericColumnFactory({
			field: "tracking",
			headerName: "Tracking",
			minWidth: 160,
			flex: 1.5,
			renderCell: (params) => (
				<Box
					sx={{
						lineHeight: 1.2,
						display: "flex",
						alignItems: "center",
						gap: 0.5,
						height: "100%",
					}}
				>
					{params.row.tracking_link ? (
						<Link
							href={params.row.tracking_link}
							target="_blank"
							rel="noopener noreferrer"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								color: "primary.main",
								textDecoration: "none",
								"&:hover": {
									textDecoration: "underline",
								},
							}}
						>
							{params.value}
							<TbExternalLink size={12} />
						</Link>
					) : (
						<Box sx={{ color: params.value === 'N/A' ? 'gray.500' : 'inherit' }}>
							{params.value}
						</Box>
					)}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "carrier_name",
			headerName: "Carrier",
			minWidth: 120,
			flex: 1,
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
					<Box sx={{ fontWeight: 500 }}>{params.value}</Box>
					<Box sx={{ fontSize: "xs", color: "gray.500" }}>{params.row.external_name}</Box>
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
					<NeviosBadge value={params.value} configKey="fulfillmentModuleStatus" />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "delivery_status",
			headerName: "Delivery",
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
					<NeviosBadge value={params.value} configKey="deliveryStatus" />
				</Box>
			),
		}),
		dateColumnFactory({
			field: "created_at",
			headerName: "Created",
			flex: 1.5,
			minWidth: 140,
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
	];

	// Bulk actions configuration
	const bulkActions = [
		{
			key: 'fulfill',
			label: 'Mark as Fulfilled',
			icon: 'CheckCircleIcon',
			variant: 'contained',
			color: 'success'
		},
		{
			key: 'cancel',
			label: 'Cancel Fulfillments',
			icon: 'CancelIcon',
			variant: 'outlined',
			color: 'error'
		},
		{
			key: 'export',
			label: 'Export',
			icon: 'DownloadIcon',
			variant: 'outlined',
			color: 'primary'
		}
	];

	// Handle bulk actions
	const handleBulkAction = useCallback((actionKey, selectedData, selectedIds) => {
		switch (actionKey) {
			case 'fulfill':
				console.log('Fulfilling fulfillments:', selectedIds);
				// TODO: Implement fulfill action
				break;
			case 'cancel':
				if (window.confirm(`Cancel ${selectedIds.length} fulfillments?`)) {
					console.log('Cancelling fulfillments:', selectedIds);
					// TODO: Implement cancel action
				}
				break;
			case 'export':
				console.log('Exporting fulfillments:', selectedData);
				// TODO: Implement export action
				break;
		}
	}, []);

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
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search fulfillments by name, tracking, carrier, or customer..."
				enableFilters={true}
				filterConfigs={FULFILLMENTS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				bulkActions={bulkActions}
				onBulkAction={handleBulkAction}
				checkboxSelection={true}
				getRowId={(row) => row.id}
			emptyStateProps={{
				title: 'No fulfillments found',
				description: 'There are no fulfillments to display',
			}}
		/>
		</Box>
	);
}
