"use client";
import { Box } from "@mui/material";
import React from "react";
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

// Transform function for customer data
const transformCustomers = (customers) => {
	return customers.map((customer) => ({
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
		country: customer.country || 'N/A'
	}));
};

export function CustomersTable({ 
	tableHeight, 
	allowCheckboxSelection = false,
	data = [],
	loading = false,
	error = null,
	totalCount = 0,
	pagination = { page: 0, pageSize: 100 },
	onPaginationChange,
	sortModel = [],
	onSortChange
}) {
	const router = useRouter();

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
					<GenderBadge gender={params.value} />
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
					<AccountStatusBadge enabled={params.value} />
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
					<SubscribedBadge subscribed={params.value} />
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

	// Transform the data
	const transformedData = React.useMemo(() => {
		return transformCustomers(data);
	}, [data]);

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
				data={transformedData}
				loading={loading}
				error={error}
				totalCount={totalCount}
				pagination={pagination}
				onPaginationChange={onPaginationChange}
				sortModel={sortModel}
				onSortChange={onSortChange}
				onRowClick={handleRowClick}
				tableHeight={tableHeight}
				enableFilters={true}
				hideFooter={false}
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
