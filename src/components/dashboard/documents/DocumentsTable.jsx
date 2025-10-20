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
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { DocumentTypeBadge } from "./DocumentTypeBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { DOCUMENTS_FILTER_CONFIG } from "../../nevios/NeviosFilters/DocumentsFilterConfig";
import { CenterFocusStrong } from "@mui/icons-material";

export function DocumentsTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {
	// Transform raw document data to table format
	const transformDocumentData = useCallback((documents) => {
		return documents.map(document => ({
			id: document.id,
			document_name: document.name || 'Untitled Document',
			doc_type: document.doc_type,
			status: document.status,
			customer_name: document.customer?.full_name || document.customer?.first_name + ' ' + document.customer?.last_name || 'Unknown Customer',
			total: {
				currency: document.currency,
				amount: document.total_price_gross || 0
			},
			total_net: {
				currency: document.currency,
				amount: document.total_price_net || 0
			},
			total_vat: {
				currency: document.currency,
				amount: document.total_price_vat || 0
			},
			remaining_amount: {
				currency: document.currency,
				amount: (document.total_price_gross || 0) - (document.total_paid_price_gross || 0)
			},
			vat_date: document.vat_date,
			created_at: document.created_at,
			updated_at: document.updated_at,
			note: document.note || '',
			internal_note: document.internal_note || '',
			item_count: document.items?.length || 0,
			// Keep original data for reference
			_original: document
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
	} = useModuleQuery('documents', {
		expand: ["customer", "items"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformDocumentData
	});

	const columnDefinitions = [
		clickableColumnFactory({
			field: "document_name",
			headerName: "Document",
			minWidth: 80,
			flex: 2,
			link: (params) => `/dashboard/documents/${params.id}`,
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
					<Box sx={{ fontSize: "xs", color: "gray.500" }}>
						{params.row.item_count} item{params.row.item_count !== 1 ? 's' : ''}
					</Box>
				</Box>
			),
		}),
		genericColumnFactory({
			field: "doc_type",
			headerName: "Type",
			flex: 1.2,
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
					<DocumentTypeBadge type={params.value} />
				</Box>
			),
		}),
		dateColumnFactory({
			field: "created_at",
			headerName: "Created",
			flex: 1.3,
			minWidth: 200,
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
			minWidth: 150,
			flex: 2,
		}),
		currencyColumnFactory({
			field: "total",
			headerName: "Total (Gross)",
			minWidth: 130,
			flex: 1.2,
			renderCell: (params) => (
				<Box sx={{ fontWeight: 500 }}>
					{params.value.currency} {formatCurrencyNumber(params.value.amount)}
				</Box>
			),
		}),
		currencyColumnFactory({
			field: "remaining_amount",
			headerName: "Remaining",
			minWidth: 130,
			flex: 1.1,
			renderCell: (params) => {
				const isFullyPaid = params.value.amount <= 0;
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
						justifyContent: "flex-end",
						height: "100%",
						width: "100%",
						px: 0.5,
						color: isFullyPaid ? "green.600" : "red.600",
						fontWeight: 500,
						backgroundColor: isFullyPaid ? "green.50" : "red.50",
						borderRadius: "4px",
						height: "fit-content"
					}}>

						{params.value.currency} {formatCurrencyNumber(params.value.amount)}
					</Box>
					</Box>
				);
			},
		}),
		currencyColumnFactory({
			field: "total_net",
			headerName: "Total (Net)",
			minWidth: 130,
			flex: 1.1,
			renderCell: (params) => (
				<Box sx={{ color: "gray.600" }}>
					{params.value.currency} {formatCurrencyNumber(params.value.amount)}
				</Box>
			),
		}),
		currencyColumnFactory({
			field: "total_vat",
			headerName: "Total (Vat)",
			minWidth: 130,
			flex: 0.8,
			renderCell: (params) => (
				<Box sx={{ color: "gray.500" }}>
					{params.value.currency} {formatCurrencyNumber(params.value.amount)}
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
				filterConfigs={DOCUMENTS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search documents by name, customer, or content..."
				emptyStateProps={{
					title: 'No documents found',
					description: 'There are no documents to display',
				}}
				checkboxSelection={true}
				getRowClassName={(params) => {
					if (params.row.status === "CANCELLED") {
						return "datagrid-row-error";
					}
					return "";
				}}
			/>
		</Box>
	);
} 