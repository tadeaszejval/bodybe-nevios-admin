"use client";
import { Box, Avatar } from "@mui/material";
import { TbShoe } from "react-icons/tb";
import React, { useCallback } from "react";
import {
	dateColumnFactory,
	genericColumnFactory,
	idColumnFactory,
	clickableColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime } from "../../../core/formatters";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { useRouter } from "next/navigation";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { PRODUCTS_FILTER_CONFIG } from "../../nevios/NeviosFilters/ProductsFilterConfig";

export function ProductsTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {
	const router = useRouter();

	// Transform raw product data to table format
	const transformProductData = useCallback((products) => {
		return products.map(product => ({
			id: product.id,
			eid: product.eid,
			title: product.title || 'Untitled Product',
			featured_image: product.featured_image || null,
			vendor: product.vendor || 'N/A',
			type: product.type || 'N/A',
			category: product.category || 'N/A',
			status: product.status || 'draft',
			created_at: product.created_at,
			handle: product.handle || '',
			tags: product.tags || '',
			url: product.url || '',
			description: product.description || '',
			// Keep original data for reference
			_original: product
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
	} = useModuleQuery('product', {
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformProductData
	});

	const columnDefinitions = [
		genericColumnFactory({
			field: "featured_image",
			headerName: "Image",
			minWidth: 50,
			flex: 0.5,
			sortable: false,
			renderCell: (params) => (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						height: "100%",
					}}
				>
					{params.value ? (
						<Avatar
							src={`${params.value}&width=128`}
							alt={params.row.title}
							variant="rounded"
							sx={{ 
								width: 40, 
								height: 40,
								objectFit: "cover",
								borderRadius: 1,
								border: "0.5px solid rgb(228, 228, 228)",
								backgroundColor: "rgb(250, 250, 250)",
							}}
						/>
					) : (
						<Box
							sx={{
								width: 40,
								height: 40,
								bgcolor: 'gray.100',
								borderRadius: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'gray.400',
								fontSize: 'xs',
							}}
						>
							<TbShoe size={20} />
						</Box>
					)}
				</Box>
			),
		}),
		clickableColumnFactory({
			field: "title",
			headerName: "Title",
			minWidth: 220,
			flex: 2,
			link: (params) => `/dashboard/products/${params.id}`,
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
					{params.row.handle && (
						<Box sx={{ fontSize: "xs", color: "gray.500" }}>/{params.row.handle}</Box>
					)}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "status",
			headerName: "Status",
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
					<ProductStatusBadge status={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "vendor",
			headerName: "Vendor",
			minWidth: 150,
			flex: 1,
		}),
		genericColumnFactory({
			field: "type",
			headerName: "Type",
			minWidth: 120,
			flex: 1,
			renderCell: (params) => (
				<Box sx={{ textTransform: 'capitalize' }}>
					{params.value}
				</Box>
			),
		}),
		dateColumnFactory({
			field: "created_at",
			headerName: "Date Created",
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
		idColumnFactory({
			field: "eid",
			headerName: "ID",
			minWidth: 100,
			flex: 0.8,
		}),
	];

	// Handle row clicks
	const handleRowClick = (params, event) => {
		if (event.ctrlKey || event.metaKey) {
			window.open(`/dashboard/products/${params.id}`, '_blank');
		} else {
			router.push(`/dashboard/products/${params.id}`);
		}
	};

	// Bulk actions configuration
	const bulkActions = [
		{
			key: 'activate',
			label: 'Activate Products',
			icon: 'CheckCircleIcon',
			variant: 'contained',
			color: 'success'
		},
		{
			key: 'deactivate',
			label: 'Deactivate Products',
			icon: 'PauseCircleIcon',
			variant: 'outlined',
			color: 'warning'
		},
		{
			key: 'archive',
			label: 'Archive Products',
			icon: 'ArchiveIcon',
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
			case 'activate':
				console.log('Activating products:', selectedIds);
				// TODO: Implement activate action
				break;
			case 'deactivate':
				console.log('Deactivating products:', selectedIds);
				// TODO: Implement deactivate action
				break;
			case 'archive':
				if (window.confirm(`Archive ${selectedIds.length} products?`)) {
					console.log('Archiving products:', selectedIds);
					// TODO: Implement archive action
				}
				break;
			case 'export':
				console.log('Exporting products:', selectedData);
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
				onRowClick={handleRowClick}
				tableHeight={tableHeight}
				hideFooter={false}
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search products by title, description, vendor, type, tags, or handle..."
				enableFilters={true}
				filterConfigs={PRODUCTS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				bulkActions={bulkActions}
				onBulkAction={handleBulkAction}
				checkboxSelection={true}
				getRowId={(row) => row.id}
				rowHeight={55}
				emptyStateProps={{
					title: 'No products found',
					description: 'There are no products to display',
				}}
				sx={{
					"& .MuiDataGrid-row": {
						cursor: "pointer",
					},
				}}
			/>
		</Box>
	);
}
