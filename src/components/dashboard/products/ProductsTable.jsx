"use client";
import { Box, Portal, CircularProgress, Avatar, Paper } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
	dateColumnFactory,
	genericColumnFactory,
	idColumnFactory,
} from "../../../components/ColumnDefinitions";
import {
	productStatusFilterConfig,
	vendorFilterConfig,
	productTypeFilterConfig,
} from "../../../components/CustomFilterDefinitions";
import { FiltersBar } from "../../../components/FiltersBar";
import { Table } from "../../../components/Table";
import { clientFiltering } from "../../../core/filters";
import { formatReadableDatetime } from "../../../core/formatters";
import { useFilters } from "../../../hooks/useFilters";
import { supabase } from "../../../utils/supabase";
import { ProductStatusBadge } from "./ProductStatusBadge";

export function ProductsTable({ tableHeight, allowCheckboxSelection = false }) {
	const { filters, editFilter, removeFilter } = useFilters();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		total: 0,
		limit: 100,
		offset: 0
	});

	// Fetch products from Supabase
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				
				// Get count of total products for pagination
				const { count, error: countError } = await supabase
					.from('products')
					.select('*', { count: 'exact', head: true });
					
				if (countError) throw countError;
				
				// Fetch the products
				const { data, error: fetchError } = await supabase
					.from('products')
					.select(`
						id, 
						title,
						featured_image,
						vendor,
						type,
						status,
						created_at,
						eid,
						handle,
						tags
					`)
					.range(pagination.offset, pagination.offset + pagination.limit - 1)
					.order('created_at', { ascending: false });
					
				if (fetchError) throw fetchError;
				
				setProducts(data || []);
				setPagination(prev => ({
					...prev,
					total: count || 0
				}));
			} catch (err) {
				console.error("Error fetching products:", err);
				setError(err.message || "Failed to fetch products");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
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
	const transformedData = products.map((product) => {
		return {
			id: product.id,
			eid: product.eid,
			title: product.title || 'Untitled Product',
			featured_image: product.featured_image || null,
			vendor: product.vendor || 'N/A',
			type: product.type || 'N/A',
			status: product.status || 'DRAFT',
			created_at: product.created_at,
			handle: product.handle || '',
			tags: product.tags || ''
		};
	});

	const columnDefinitions = [
		genericColumnFactory({
			field: "featured_image",
			headerName: "Image",
			minWidth: 70,
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
							src={params.value}
							alt={params.row.title}
							variant="rounded"
							sx={{ 
								width: 50, 
								height: 50,
								objectFit: "cover",
                                borderRadius: 1,
                                border: "0.5px solid rgb(228, 228, 228)",
                                backgroundColor: "rgb(250, 250, 250)",

							}}
						/>
					) : (
						<Box
							sx={{
								width: 50,
								height: 50,
								bgcolor: 'gray.100',
								borderRadius: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'gray.400',
								fontSize: 'xs',
							}}
						>
							No img
						</Box>
					)}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "title",
			headerName: "Title",
			minWidth: 220,
			flex: 2,
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
			minWidth: 150,
			flex: 1,
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
			field: "handle",
			headerName: "Handle",
			minWidth: 150,
			flex: 1,
		}),
	];

	return (
		<Paper
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
					productStatusFilterConfig,
					vendorFilterConfig,
					productTypeFilterConfig,
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
						sorting: { sortModel: [{ field: "created_at", sort: "desc" }] },
					}}
					pagination
					paginationMode="server"
					rowCount={pagination.total}
					onPaginationModelChange={handlePaginationChange}
					hideFooter={false}
					disableColumnFilter
					slots={{ toolbar: CustomQuickSearch }}
					checkboxSelection={allowCheckboxSelection}
					rowHeight={65}
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
					placeholder="Search product title, vendor..."
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
