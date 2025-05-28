"use client";
import { Box } from "@mui/material";
import React, { useCallback } from "react";
import {
	dateColumnFactory,
	genericColumnFactory,
	clickableColumnFactory
} from "../../../components/ColumnDefinitions";
import { NeviosEnhancedTable } from "../../nevios/NeviosEnhancedTable";
import { formatReadableDatetime } from "../../../core/formatters";
import { GenderBadge } from "./GenderBadge";
import { AccountStatusBadge } from "./AccountStatusBadge";
import { SubscribedBadge } from "./SubscribedBadge";
import { useRouter } from "next/navigation";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { CUSTOMERS_FILTER_CONFIG } from "../../nevios/NeviosFilters/CustomersFilterConfig";

export function CustomersTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {
	const router = useRouter();

	// Transform raw customer data to table format
	const transformCustomerData = useCallback((customers) => {
		const transformed = customers.map(customer => ({
			id: customer.id,
			email: customer.email || 'No Email',
			first_name: customer.first_name || '',
			last_name: customer.last_name || '',
			full_name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown',
			gender: customer.gender || 'NOT_SPECIFIED',
			account_enabled: customer.account_enabled || false,
			subscribed: customer.subscribed || false,
			created_at: customer.created_at,
			phone: customer.phone || 'N/A',
			country: customer.country || 'N/A',
			// Keep original data for reference
			_original: customer
		}));
		return transformed;
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
	} = useModuleQuery('customers', {
		expand: ["orders", "addresses"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformCustomerData
	});

	const columnDefinitions = [
		clickableColumnFactory({
			field: "full_name",
			headerName: "Customer",
			minWidth: 180,
			flex: 2,
			link: (params) => `/dashboard/customers/${params.id}`,
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
					<Box sx={{ fontSize: "xs", color: "gray.500" }}>{params.row.email}</Box>
				</Box>
			),
		}),
		genericColumnFactory({
			field: "gender",
			headerName: "Gender",
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
					<GenderBadge value={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "account_enabled",
			headerName: "Account Status",
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
					<AccountStatusBadge value={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "subscribed",
			headerName: "Subscribed",
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
					<SubscribedBadge value={params.value} />
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

	// Handle row clicks
	const handleRowClick = (params, event) => {
		if (event.ctrlKey || event.metaKey) {
			window.open(`/dashboard/customers/${params.id}`, '_blank');
		} else {
			router.push(`/dashboard/customers/${params.id}`);
		}
	};

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
				searchPlaceholder="Search customers by name, email, phone, or country..."
				enableFilters={true}
				filterConfigs={CUSTOMERS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
				emptyStateProps={{
					title: 'No customers found',
					description: 'There are no customers to display',
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
