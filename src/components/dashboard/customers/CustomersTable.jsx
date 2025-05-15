"use client";
import { Box, Portal, CircularProgress } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	dateColumnFactory,
	genericColumnFactory,
	idColumnFactory,
} from "../../../components/ColumnDefinitions";
import {
	customerNameFilterConfig,
	genderFilterConfig,
	emailFilterConfig,
	createdAtFilterConfig,
	accountStatusFilterConfig,
	subscribedFilterConfig,
} from "../../../components/CustomFilterDefinitions";
import { FiltersBar } from "../../../components/FiltersBar";
import { Table } from "../../../components/Table";
import { clientFiltering } from "../../../core/filters";
import { formatReadableDatetime } from "../../../core/formatters";
import { useFilters } from "../../../hooks/useFilters";
import { supabase } from "../../../utils/supabase";
import { GenderBadge } from "./GenderBadge";
import { AccountStatusBadge } from "./AccountStatusBadge";
import { SubscribedBadge } from "./SubscribedBadge";

export function CustomersTable({ tableHeight, allowCheckboxSelection = false }) {
	const router = useRouter();
	const { filters, editFilter, removeFilter } = useFilters();
	const [customers, setCustomers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		total: 0,
		limit: 100,
		offset: 0
	});

	// Fetch customers from Supabase
	useEffect(() => {
		const fetchCustomers = async () => {
			try {
				setLoading(true);
				
				// Get count of total customers for pagination
				const { count, error: countError } = await supabase
					.from('customers')
					.select('*', { count: 'exact', head: true });
					
				if (countError) throw countError;
				
				// Fetch the customers
				const { data, error: fetchError } = await supabase
					.from('customers')
					.select(`
						id, 
						email,
						first_name, 
						last_name,
						gender,
						created_at,
						phone,
						country,
						account_enabled,
						subscribed
					`)
					.range(pagination.offset, pagination.offset + pagination.limit - 1)
					.order('created_at', { ascending: false });
					
				if (fetchError) throw fetchError;
				
				setCustomers(data);
				setPagination(prev => ({
					...prev,
					total: count || 0
				}));
			} catch (err) {
				console.error("Error fetching customers:", err);
				setError(err.message || "Failed to fetch customers");
			} finally {
				setLoading(false);
			}
		};

		fetchCustomers();
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
	const transformedData = customers.map((customer) => {
		return {
			id: customer.id,
			email: customer.email || 'N/A',
			customer_name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown',
			gender: customer.gender || 'NOT_FOUND',
			created_at: customer.created_at,
			phone: customer.phone || 'N/A',
			account_enabled: customer.account_enabled,
			subscribed: customer.subscribed
		};
	});

	const columnDefinitions = [
		idColumnFactory({
			field: "email",
			headerName: "Email",
			minWidth: 150,
			flex: 2,
		}),
        genericColumnFactory({
			field: "subscribed",
			headerName: "Subscribed",
			minWidth: 140,
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
					<SubscribedBadge status={params.value} />
				</Box>
			),
		}),
		genericColumnFactory({
			field: "customer_name",
			headerName: "Name",
			minWidth: 180,
			flex: 1.5,
		}),
		genericColumnFactory({
			field: "gender",
			headerName: "Gender",
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
					<GenderBadge status={params.value} />
				</Box>
			),
		}),
        idColumnFactory({
			field: "phone",
			headerName: "Phone",
			minWidth: 200,
			flex: 1,
		}),
        dateColumnFactory({
			field: "created_at",
			headerName: "Customer Since",
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
			field: "account_enabled",
			headerName: "Account",
			minWidth: 150,
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
					<AccountStatusBadge status={params.value} />
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
				gap: 1.5,
			}}
		>
			<FiltersBar
				activeFilters={filters}
				editFilter={editFilter}
				removeFilter={removeFilter}
				availableFilters={[
					emailFilterConfig,
					customerNameFilterConfig,
					genderFilterConfig,
					accountStatusFilterConfig,
					subscribedFilterConfig,
					createdAtFilterConfig,
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
					onRowClick={(params) => {
						router.push(`/dashboard/customers/${params.id}`);
					}}
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
				/>
			)}
		</Box>
	);
}

function CustomQuickSearch(props) {
	return (
		<React.Fragment>
			<Portal container={() => document.getElementById("filter-panel")}>
				<GridToolbarQuickFilter
					variant="filled"
					placeholder="Search email, name..."
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
