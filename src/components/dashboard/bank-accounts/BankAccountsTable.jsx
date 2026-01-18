"use client";
import { Box, Chip } from "@mui/material";
import React, { useCallback } from "react";
import {
	currencyColumnFactory,
	dateColumnFactory,
	genericColumnFactory,
	clickableColumnFactory
} from "../../ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { ReconciliationStatusBadge } from "./ReconciliationStatusBadge";
import { NeviosBadge } from "../../nevios/NeviosBadge";

export function BankAccountsTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {
	// Transform raw bank transaction data to table format
	const transformBankTransactionData = useCallback((transactions) => {
		return transactions.map(transaction => ({
			id: transaction.id,
			transaction_date: transaction.transaction_date,
			amount: transaction.amount,
			currency: transaction.currency,
			type: transaction.type,
			category: transaction.category,
			reconciled: transaction.reconciled,
			reconciliation_status: transaction.reconciliation_status,
			reconciliation_difference: transaction.reconciliation_difference,
			counterparty_name: transaction.counterparty_name || 'N/A',
			counterparty_account: transaction.counterparty_account || 'N/A',
			variable_symbol: transaction.variable_symbol || '-',
			reference_number: transaction.reference_number || '-',
			description: transaction.description || '-',
			bank_account_name: transaction.bank_account?.name || 'Unknown Account',
			bank_account_number: transaction.bank_account?.account_number || 'N/A',
			payment_name: transaction.payment?.name || null,
			payment_id: transaction.payment?.id || null,
			// Keep original data for reference
			_original: transaction
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
	} = useModuleQuery('bank', {
		expand: ["payment", "bank_account"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformBankTransactionData
	});

	const columnDefinitions = [
		clickableColumnFactory({
			field: "transaction_date",
			headerName: "Date",
			flex: 1.2,
			minWidth: 120,
			link: (params) => `/dashboard/bank-transactions/${params.id}`,
			renderCell: (params) => (
				<Box
					sx={{
						fontSize: "sm",
						color: "gray.700",
						fontWeight: 500,
					}}
				>
					{new Date(params.value).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</Box>
			),
		}),
	genericColumnFactory({
		field: "type",
		headerName: "Type",
		flex: 1,
		minWidth: 110,
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
				<NeviosBadge value={params.value} configKey="transactionType" />
			</Box>
		),
	}),
		currencyColumnFactory({
			field: "amount",
			headerName: "Amount",
			minWidth: 130,
			flex: 1.2,
			renderCell: (params) => (
				<Box
					sx={{
						fontWeight: 600,
						color: params.row.type === 'INCOMING' ? 'success.main' : 'error.main',
					}}
				>
					{params.row.type === 'INCOMING' ? '+' : '-'} {params.row.currency} {formatCurrencyNumber(Math.abs(params.value))}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "counterparty_name",
			headerName: "Counterparty",
			minWidth: 200,
			flex: 2,
			renderCell: (params) => (
				<Box>
					<Box sx={{ fontSize: "sm", fontWeight: 500 }}>
						{params.value}
					</Box>
					{params.row.counterparty_account !== 'N/A' && (
						<Box sx={{ fontSize: "xs", color: "gray.500" }}>
							{params.row.counterparty_account}
						</Box>
					)}
				</Box>
			),
		}),
	genericColumnFactory({
		field: "category",
		headerName: "Category",
		flex: 1,
		minWidth: 110,
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
				{params.value ? (
					<NeviosBadge value={params.value} configKey="transactionCategory" />
				) : (
					<Box sx={{ color: "gray.400", fontSize: "sm" }}>-</Box>
				)}
			</Box>
		),
	}),
		genericColumnFactory({
			field: "reconciliation_status",
			headerName: "Reconciliation",
			flex: 1.3,
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
					<ReconciliationStatusBadge 
						status={params.value}
						difference={params.row.reconciliation_difference}
					/>
				</Box>
			),
		}),
		genericColumnFactory({
			field: "variable_symbol",
			headerName: "VS",
			flex: 0.8,
			minWidth: 100,
			renderCell: (params) => (
				<Box
					sx={{
						fontSize: "sm",
						color: "gray.600",
						fontFamily: 'monospace',
					}}
				>
					{params.value}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "bank_account_name",
			headerName: "Bank Account",
			flex: 1.5,
			minWidth: 150,
			renderCell: (params) => (
				<Box>
					<Box sx={{ fontSize: "sm", fontWeight: 500 }}>
						{params.value}
					</Box>
					<Box sx={{ fontSize: "xs", color: "gray.500" }}>
						{params.row.bank_account_number}
					</Box>
				</Box>
			),
		}),
		clickableColumnFactory({
			field: "payment_name",
			headerName: "Linked Payment",
			minWidth: 130,
			flex: 1.2,
			link: (params) => params.row.payment_id ? `/dashboard/payments/${params.row.payment_id}` : null,
			renderCell: (params) => (
				params.value ? (
					<Box
						sx={{
							fontSize: "sm",
							color: "primary.main",
							fontWeight: 500,
							textDecoration: "underline",
							cursor: "pointer",
						}}
					>
						{params.value}
					</Box>
				) : (
					<Box sx={{ color: "gray.400", fontSize: "sm" }}>Not linked</Box>
				)
			),
		}),
		genericColumnFactory({
			field: "description",
			headerName: "Description",
			flex: 2,
			minWidth: 200,
			renderCell: (params) => (
				<Box
					sx={{
						fontSize: "sm",
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
				activeFilters={filters}
				onFiltersChange={updateFilters}
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search transactions by counterparty, reference, or description..."
				emptyStateProps={{
					title: 'No transactions found',
					description: 'There are no bank transactions to display',
				}}
				sx={{
					"& .MuiDataGrid-row": {
						cursor: "pointer",
					},
				}}
				getRowClassName={(params) => {
					if (params.row.reconciliation_status === "UNDERPAID") {
						return "datagrid-row-warning";
					}
					if (params.row.reconciliation_status === "OVERPAID") {
						return "datagrid-row-info";
					}
					return "";
				}}
			/>
		</Box>
	);
}

