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
import { FulfillmentStatusBadge } from "./FulfillmentStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { ORDERS_FILTER_CONFIG } from "../../nevios/NeviosFilters/OrdersFilterConfig";

export function OrdersTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {
	// Transform raw order data to table format
	const transformOrderData = useCallback((orders) => {
		return orders.map(order => ({
			id: order.id,
			order_name: order.name,
			order_date: order.created_at,
			customer_name: order.customer?.full_name || 'Unknown Customer',
			total: {
				currency: order.local_currency,
				amount: order.total_amount || 0
			},
			fulfillment_status: order.fulfillment_status,
			payment_status: order.payment_status,
			item_count: order.items?.length || 0,
			shipping_method: order.shipping_method?.name || 'Not specified',
			// Keep original data for reference
			_original: order
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
	} = useModuleQuery('order', {
		expand: ["customer", "shipping_method", "items"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformOrderData
	});

	const columnDefinitions = [
		clickableColumnFactory({
			field: "order_name",
			headerName: "Order ID",
			minWidth: 150,
			link: (params) => `/dashboard/orders/${params.id}`
		}),
		dateColumnFactory({
			field: "order_date",
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
			field: "customer_name",
			headerName: "Customer",
			minWidth: 180,
			flex: 2,
		}),
		currencyColumnFactory({
			field: "total",
			headerName: "Total",
			minWidth: 120,
			flex: 1,
			renderCell: (params) => (
				<Box>
					{params.value.currency} {formatCurrencyNumber(params.value.amount)}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "fulfillment_status",
			headerName: "Fulfillment",
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
					<FulfillmentStatusBadge status={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "payment_status",
			headerName: "Payment",
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
					<PaymentStatusBadge status={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "item_count",
			headerName: "Total Items",
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
		genericColumnFactory({
			field: "shipping_method",
			headerName: "Shipping Method",
			flex: 1.5,
			minWidth: 150,
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
				filterConfigs={ORDERS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search orders by customer, order ID, or details..."
				emptyStateProps={{
					title: 'No orders found',
					description: 'There are no orders to display',
				}}
				sx={{
					"& .MuiDataGrid-row": {
						cursor: "pointer",
					},
				}}
				getRowClassName={(params) => {
					if (params.row.payment_status === "REFUNDED") {
						return "datagrid-row-error";
					}
					return "";
				}}
			/>
		</Box>
	);
}
