"use client";
import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
	dateColumnFactory,
	genericColumnFactory,
	clickableColumnFactory,
	currencyColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { DiscountTypeBadge } from "./DiscountTypeBadge";
import { DiscountStatusBadge } from "./DiscountStatusBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { DISCOUNTS_FILTER_CONFIG } from "../../nevios/NeviosFilters/DiscountsFilterConfig";

export function DiscountsTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {
	// Transform raw discount data to table format
	const transformDiscountData = useCallback((discounts) => {
		return discounts.map(discount => {
			// Calculate usage percentage
			const usagePercentage = discount.usage_limit 
				? Math.round((discount.used_count / discount.usage_limit) * 100)
				: 0;
			
			// Format discount value display
			let valueDisplay = '';
			if (discount.discount_type === 'PERCENTAGE') {
				valueDisplay = `${discount.discount_value}%`;
			} else if (discount.discount_type === 'FIXED') {
				valueDisplay = `$${formatCurrencyNumber(discount.discount_value)}`;
			} else if (discount.discount_type === 'FREE_SHIPPING') {
				valueDisplay = 'Free Shipping';
			} else if (discount.discount_type === 'VOUCHER') {
				valueDisplay = `$${formatCurrencyNumber(discount.discount_value)}`;
			}

			// Format usage display
			const usageDisplay = discount.usage_limit 
				? `${discount.used_count} / ${discount.usage_limit}`
				: `${discount.used_count} / ∞`;

			return {
				id: discount.id,
				code: discount.code,
				description: discount.description || 'No description',
				discount_type: discount.discount_type,
				discount_value: discount.discount_value,
				value_display: valueDisplay,
				status: discount.status,
				used_count: discount.used_count,
				usage_limit: discount.usage_limit,
				usage_display: usageDisplay,
				usage_percentage: usagePercentage,
				min_subtotal: discount.min_subtotal,
				max_discount: discount.max_discount,
				allowed_market_currencies: discount.allowed_market_currencies || [],
				customer: discount.customer,
				voucher_order_item: discount.voucher_order_item,
				created_at: discount.created_at,
				// Keep original data for reference
				_original: discount
			};
		});
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
	} = useModuleQuery('discounts', {
		expand: ["customer", "voucher_order_item"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformDiscountData
	});

	const columnDefinitions = [
		clickableColumnFactory({
			field: "code",
			headerName: "Code",
			minWidth: 150,
			flex: 1.5,
			link: (params) => `/dashboard/discounts/${params.id}`,
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
					<Box sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.9rem' }}>
						{params.value}
					</Box>
					<Box sx={{ fontSize: "xs", color: "gray.500", mt: 0.3 }}>
						{params.row.description}
					</Box>
				</Box>
			),
		}),
		genericColumnFactory({
			field: "status",
			headerName: "Status",
			flex: 1,
			minWidth: 100,
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
					<DiscountStatusBadge status={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "value_display",
			headerName: "Value",
			flex: 1,
			minWidth: 100,
			renderCell: (params) => (
				<Box
					sx={{
						fontSize: "s",
						fontWeight: 600,
					}}
				>
					{params.value}
				</Box>
			),
		}),
		genericColumnFactory({
			field: "discount_type",
			headerName: "Type",
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
					<DiscountTypeBadge type={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "usage_display",
			headerName: "Usage",
			flex: 1.2,
			minWidth: 120,
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
					<Box sx={{ fontSize: "s", fontWeight: 500 }}>
						{params.value}
					</Box>
					{params.row.usage_limit && (
						<Box 
							sx={{ 
								fontSize: "xs", 
								color: params.row.usage_percentage > 80 ? "error.main" : "gray.500",
								mt: 0.3
							}}
						>
							{params.row.usage_percentage}% used
						</Box>
					)}
				</Box>
			),
		}),
		currencyColumnFactory({
			field: "min_subtotal",
			headerName: "Min. Order",
			minWidth: 110,
			flex: 1,
			renderCell: (params) => (
				<Box sx={{ fontSize: "s", color: "gray.600" }}>
					{params.value ? `$${formatCurrencyNumber(params.value)}` : '—'}
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
				rowHeight={"45px"}
				filterConfigs={DISCOUNTS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search discount codes..."
				emptyStateProps={{
					title: 'No discounts found',
					description: 'Create discount codes to manage promotions and gift cards',
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

