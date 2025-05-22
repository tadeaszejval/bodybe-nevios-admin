"use client";
import { Box, Portal, CircularProgress } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
	currencyColumnFactory,
	dateColumnFactory,
	genericColumnFactory,
	clickableColumnFactory
} from "../../../components/ColumnDefinitions";
import {
	customerNameFilterConfig,
	orderDateFilterConfig,
	orderStatusFilterConfig,
	priceFilterConfig,
	genderFilterConfig,
} from "../../../components/CustomFilterDefinitions";
import { FiltersBar } from "../../../components/FiltersBar";
import { Table } from "../../../components/Table";
import { clientFiltering } from "../../../core/filters";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { useFilters } from "../../../hooks/useFilters";
import { supabase } from "../../../utils/supabase";
import { FulfillmentStatusBadge } from "./FulfillmentStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { GenderBadge } from "./GenderBadge";
import { Paper } from "@mui/material";

export function OrdersTable({ tableHeight, allowCheckboxSelection = false }) {
	const { filters, editFilter, removeFilter } = useFilters();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		total: 0,
		limit: 100,
		offset: 0
	});
	const [orderItems, setOrderItems] = useState({});

	// Fetch orders from Supabase
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				
				// Get count of total orders for pagination
				const { count, error: countError } = await supabase
					.from('orders')
					.select('*', { count: 'exact', head: true });
					
				if (countError) throw countError;
				
				// Fetch the orders with joined customer data and pricing
				const { data, error: fetchError } = await supabase
					.from('orders')
					.select(`
						id, 
						name, 
						created_at,
						fulfillment_status,
						payment_status,
						shipping_method,
						local_currency,
						customers (
							first_name,
							last_name,
							gender
						),
						orders_pricing (
							component,
							gross_local
						)
					`)
					.range(pagination.offset, pagination.offset + pagination.limit - 1)
					.order('created_at', { ascending: false });
					
				if (fetchError) throw fetchError;
				
				// Fetch all order items
				if (data && data.length > 0) {
					try {
						// Collect all order IDs
						const orderIds = data.map(order => order.id);
						
						// Fetch all order items at once
						const { data: allItems, error: itemsError } = await supabase
							.from('order_item')
							.select('*')
							.limit(1000); // Set a reasonable limit
							
						if (itemsError) {
							console.error('Error fetching order items:', itemsError);
						} else if (allItems && allItems.length > 0) {
							// Create a map of order ID to items
							const itemsMap = {};
							
							// Process each item and organize by order ID
							allItems.forEach(item => {
								const orderId = item.order;
								if (orderId) {
									// Initialize array if it doesn't exist
									if (!itemsMap[orderId]) {
										itemsMap[orderId] = [];
									}
									
									// Add the item
									itemsMap[orderId].push(item);
								}
							});
							
							// Set the order items state
							setOrderItems(itemsMap);
						}
					} catch (itemsErr) {
						console.error('Error processing order items:', itemsErr);
					}
				}
				
				setOrders(data);
				setPagination(prev => ({
					...prev,
					total: count || 0
				}));
			} catch (err) {
				console.error("Error fetching orders:", err);
				setError(err.message || "Failed to fetch orders");
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [pagination.limit, pagination.offset]);

	// Handle server-side pagination change
	const handlePaginationChange = (params) => {
		setPagination({
			limit: params.pageSize,
			offset: params.page * params.pageSize,
			total: pagination.total
		});
	};

	// Transform the data to match the table structure
	const transformedData = orders.map((order) => {
		// Find the total pricing component if it exists
		const totalAmount = (() => {
			try {
				if (!order.orders_pricing || !Array.isArray(order.orders_pricing) || order.orders_pricing.length === 0) {
					return 0;
				}
				
				// The pricing component name should be uppercase 'TOTAL'
				const totalPricing = order.orders_pricing.find(p => p.component === 'total');
				return totalPricing?.gross_local || 0;
			} catch (err) {
				console.warn('Error processing order pricing:', err);
				return 0;
			}
		})();
		
		// Calculate total item count by summing quantities
		const itemCount = (() => {
			try {
				const items = orderItems[order.id] || [];
				return items.reduce((total, item) => {
					// Add the quantity of this item (default to 1 if quantity is missing)
					return total + (item.quantity || 1);
				}, 0);
			} catch (err) {
				console.warn('Error calculating item count:', err);
				return 0;
			}
		})();
		
		// Format shipping method from JSON
		const shippingMethod = (() => {
			try {
				if (!order.shipping_method) return 'N/A';
				
				if (typeof order.shipping_method === 'string') {
					const parsed = JSON.parse(order.shipping_method);
					return parsed.name || 'Standard Shipping';
				}
				
				return order.shipping_method.name || 'Standard Shipping';
			} catch (err) {
				console.warn('Error parsing shipping method:', err);
				return 'Standard Shipping';
			}
		})();

		return {
			id: order.id,
			order_name: order.name || order.id,
			order_date: order.created_at,
			customer_name: order.customers ? 
				`${order.customers.first_name || ''} ${order.customers.last_name || ''}`.trim() : 
				'Unknown',
			customer_gender: order.customers?.gender || 'NOT_FOUND',
			total: {
				amount: totalAmount,
				currency: order.local_currency
			},
			fulfillment_status: order.fulfillment_status || 'UNFULFILLED',
			payment_status: order.payment_status || 'UNPAID',
			item_count: itemCount,
			shipping_method: shippingMethod
		};
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
		<Paper
			elevation={2}
			sx={{
				flex: 1,
				display: "flex",
				height: "100%",
				width: "100%",
				flexDirection: "column",
				gap: 1.5,
			}}
		>
			<FiltersBar
				activeFilters={filters}
				editFilter={editFilter}
				removeFilter={removeFilter}
				availableFilters={[
					customerNameFilterConfig,
					orderStatusFilterConfig,
					priceFilterConfig,
					orderDateFilterConfig,
					genderFilterConfig,
				]}
			>
				<Box id="filter-panel" />
			</FiltersBar>
			
			{loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
					<CircularProgress />
				</Box>
			)}
			
			{error && (
				<Box sx={{ color: 'error.main', p: 2, textAlign: 'center' }}>
					Error: {error}
				</Box>
			)}
			
			{!loading && !error && (
				<Table
					tableHeight={tableHeight}
					columns={columnDefinitions}
					rows={clientFiltering(transformedData, filters)}
					initialState={{
						sorting: { sortModel: [{ field: "order_date", sort: "desc" }] },
					}}
					pagination
					paginationMode="server"
					rowCount={pagination.total}
					onPaginationModelChange={handlePaginationChange}
					hideFooter={false}
					disableColumnFilter
					slots={{ toolbar: CustomQuickSearch }}
					checkboxSelection={allowCheckboxSelection}
					getRowClassName={(params) => {
						if (
							params.row.payment_status === "REFUNDED"
						) {
							return "datagrid-row-error";
						}
						return "";
					}}
				/>
			)}
		</Paper>
	);
}

function CustomQuickSearch(props) {
	return (
		<React.Fragment>
			<Portal container={() => document.getElementById("filter-panel")}>
				<GridToolbarQuickFilter
					variant="filled"
					placeholder="Search order ID, customer name..."
					sx={{
						width: 200,
						borderColor: "gray.200",
						paddingBottom: 0,
						".MuiInputBase-root": {
							fontSize: "xs",
							height: 30,
							paddingX: 0.5,
						},
						".MuiInputBase-input": {
							paddingY: 0,
						},
						".MuiSvgIcon-root": {
							height: 16,
							width: 16,
						},
					}}
				/>
			</Portal>
		</React.Fragment>
	);
}
