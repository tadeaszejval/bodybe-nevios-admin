"use client";
import { Box, Avatar } from "@mui/material";
import React from "react";
import {
	dateColumnFactory,
	genericColumnFactory,
	idColumnFactory,
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime } from "../../../core/formatters";
import { ProductStatusBadge } from "./ProductStatusBadge";

// Transform function for product data
const transformProducts = (products) => {
	return products.map((product) => ({
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
	}));
};

export function ProductsTable({ tableHeight, allowCheckboxSelection = false }) {
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
				tableName="products"
				tableConfig={{
					table: 'products',
					select: `
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
					`,
					defaultSort: [{ field: 'created_at', sort: 'desc' }]
				}}
				columns={columnDefinitions}
				availableFilters={[]} // No filters for products table
				transform={transformProducts}
				tableHeight={tableHeight}
				enableFilters={false} // Disable filters
				enableSearch={true}
				hideFooter={false}
				checkboxSelection={allowCheckboxSelection}
				rowHeight={65}
				emptyStateProps={{
					title: 'No products found',
					description: 'There are no products to display',
				}}
			/>
		</Box>
	);
}
