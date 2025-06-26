"use client";
import { Box, Chip } from "@mui/material";
import React, { useCallback } from "react";
import {
	currencyColumnFactory,
	dateColumnFactory,
	genericColumnFactory,
	clickableColumnFactory,
	idColumnFactory
} from "../../ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { PAYMENTS_FILTER_CONFIG } from "../../nevios/NeviosFilters/PaymentsFilterConfig";
import { TbCreditCard, TbRefresh, TbTrash } from "react-icons/tb";

// Payment Status Badge Component
const PaymentStatusBadge = ({ status }) => {
	const getStatusConfig = (status) => {
		switch (status?.toUpperCase()) {
			case 'PAID':
				return { color: 'success', label: 'Paid' };
			case 'UNPAID':
				return { color: 'warning', label: 'Unpaid' };
			case 'REFUNDED':
				return { color: 'error', label: 'Refunded' };
			default:
				return { color: 'default', label: status || 'Unknown' };
		}
	};

	const config = getStatusConfig(status);
	
	return (
		<Chip
			label={config.label}
			color={config.color}
			size="small"
			variant="outlined"
		/>
	);
};

// Payment Type Badge Component
const PaymentTypeBadge = ({ type }) => {
	const getTypeConfig = (type) => {
		switch (type?.toUpperCase()) {
			case 'GATEWAY':
				return { color: 'primary', label: 'Gateway' };
			case 'COD':
				return { color: 'secondary', label: 'Cash on Delivery' };
			case 'BANK_TRANSFER':
				return { color: 'info', label: 'Bank Transfer' };
			case 'MANUAL':
				return { color: 'default', label: 'Manual' };
			default:
				return { color: 'default', label: type || 'Unknown' };
		}
	};

	const config = getTypeConfig(type);
	
	return (
		<Chip
			label={config.label}
			color={config.color}
			size="small"
			variant="filled"
		/>
	);
};

export function PaymentsTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = "",
	onPaymentAction
}) {
	// Transform raw payment data to table format
	const transformPaymentData = useCallback((payments) => {
		return payments.map(payment => ({
			id: payment.id,
			payment_name: payment.name,
			payment_date: payment.created_at,
			customer_name: payment.customer?.full_name || payment.customer?.email || 'Unknown Customer',
			order_name: payment.order?.name || 'No Order',
			amount: {
				currency: payment.currency,
				amount: payment.amount || 0
			},
			status: payment.status,
			type: payment.type,
			paid_at: payment.paid_at,
			refunded_at: payment.refunded_at,
			external_name: payment.external_name,
			provider_name: payment.provider_name,
			provider_status: payment.provider_status_title,
			// Keep original data for reference
			_original: payment
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
	} = useModuleQuery('payment', {
		expand: ["customer", "order"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformPaymentData
	});

	// Handle bulk actions
	const handleBulkAction = useCallback(async (actionKey, selectedRows, selectedIds) => {
		try {
			switch (actionKey) {
				case 'mark_paid':
					// Mark selected payments as paid
					for (const paymentId of selectedIds) {
						await fetch(`/server/payment/update/mark-paid/${paymentId}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({})
						});
					}
					break;
				case 'refund':
					// Refund selected payments
					for (const paymentId of selectedIds) {
						await fetch(`/server/payment/update/refund/${paymentId}`, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({})
						});
					}
					break;
				case 'delete':
					// Delete selected payments
					for (const paymentId of selectedIds) {
						await fetch(`/server/payment/delete/${paymentId}`, {
							method: 'DELETE'
						});
					}
					break;
			}
			
			// Refresh data after bulk action
			refreshData();
			
			// Call external handler if provided
			if (onPaymentAction) {
				onPaymentAction(actionKey, selectedRows);
			}
		} catch (error) {
			console.error(`Error performing bulk action ${actionKey}:`, error);
		}
	}, [refreshData, onPaymentAction]);

	// Handle row click to view payment details
	const handleRowClick = useCallback((params) => {
		// Navigate to payment detail view (if it exists)
		// For now, just log the payment data
		console.log('Payment clicked:', params.row);
	}, []);

	// Define bulk actions
	const bulkActions = [
		{
			key: 'mark_paid',
			label: 'Mark as Paid',
			icon: <TbCreditCard size={16} />,
			variant: 'contained',
			color: 'success'
		},
		{
			key: 'refund',
			label: 'Refund',
			icon: <TbRefresh size={16} />,
			variant: 'outlined',
			color: 'warning'
		},
		{
			key: 'delete',
			label: 'Delete',
			icon: <TbTrash size={16} />,
			variant: 'outlined',
			color: 'error'
		}
	];

	const columnDefinitions = [
		clickableColumnFactory({
			field: "payment_name",
			headerName: "Payment ID",
			minWidth: 150,
			link: (params) => `/dashboard/payments/${params.id}`
		}),
		dateColumnFactory({
			field: "payment_date",
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
			field: "customer_name",
			headerName: "Customer",
			minWidth: 180,
			flex: 2,
		}),
		clickableColumnFactory({
			field: "order_name",
			headerName: "Order",
			minWidth: 120,
			flex: 1,
			link: (params) => params.row._original.order?.id ? `/dashboard/orders/${params.row._original.order.id}` : null
		}),
		currencyColumnFactory({
			field: "amount",
			headerName: "Amount",
			minWidth: 120,
			flex: 1,
			renderCell: (params) => (
				<Box>
					{params.value.currency} {formatCurrencyNumber(params.value.amount)}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "status",
			headerName: "Status",
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
					<PaymentStatusBadge status={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "type",
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
					<PaymentTypeBadge type={params.value} />
				</Box>
			),
		}),
		dateColumnFactory({
			field: "paid_at",
			headerName: "Paid At",
			flex: 1.5,
			minWidth: 160,
			renderCell: (params) => (
				<Box
					sx={{
						fontSize: "s",
						color: params.value ? "gray.600" : "gray.400",
					}}
				>
					{params.value ? formatReadableDatetime(params.value) : 'Not paid'}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "external_name",
			headerName: "External Ref",
			flex: 1.2,
			minWidth: 120,
			renderCell: (params) => (
				<Box
					sx={{
						fontSize: "s",
						color: "gray.500",
						fontFamily: "monospace"
					}}
				>
					{params.value || '-'}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "provider_name",
			headerName: "Provider",
			flex: 1,
			minWidth: 100,
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
				onRowClick={handleRowClick}
				tableHeight={tableHeight}
				hideFooter={false}
				enableFilters={true}
				filterConfigs={PAYMENTS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search payments by customer, payment ID, or external reference..."
				checkboxSelection={true}
				bulkActions={bulkActions}
				onBulkAction={handleBulkAction}
				emptyStateProps={{
					title: 'No payments found',
					description: 'There are no payment records to display',
					buttonText: 'Create Payment',
					action: () => console.log('Create payment clicked') // Replace with actual navigation
				}}
			/>
		</Box>
	);
}
