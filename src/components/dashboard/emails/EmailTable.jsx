"use client";
import { Box, Portal, CircularProgress } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
	dateColumnFactory,
	genericColumnFactory,
    clickableColumnFactory,
} from "../../../components/ColumnDefinitions";
import { FiltersBar } from "../../../components/FiltersBar";
import { Table } from "../../../components/Table";
import { clientFiltering } from "../../../core/filters";
import { formatReadableDatetime } from "../../../core/formatters";
import { useFilters } from "../../../hooks/useFilters";
import { supabase } from "../../../utils/supabase";
import { EmailStatusBadge } from "./EmailStatusBadge";
import { TextOperatorValueBlock, OrderDateValueBlock } from "../../../components/CustomFilterDefinitions";

// Email filter configurations
const fromFilterConfig = {
	field: "from",
	operatorValueBlock: (params) => <TextOperatorValueBlock {...params} />,
};

const toFilterConfig = {
	field: "to",
	operatorValueBlock: (params) => <TextOperatorValueBlock {...params} />,
};

const subjectFilterConfig = {
	field: "subject",
	operatorValueBlock: (params) => <TextOperatorValueBlock {...params} />,
};

const sentDateFilterConfig = {
	field: "created_at",
	operatorValueBlock: (params) => <OrderDateValueBlock {...params} />,
};

export function EmailTable({ tableHeight, allowCheckboxSelection = false }) {
	const { filters, editFilter, removeFilter } = useFilters();
	const [emails, setEmails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		total: 0,
		limit: 100,
		offset: 0
	});

	// Fetch emails from Supabase
	useEffect(() => {
		const fetchEmails = async () => {
			try {
				setLoading(true);
				
				// Get count of total emails for pagination
				const { count, error: countError } = await supabase
					.from('email')
					.select('*', { count: 'exact', head: true });
					
				if (countError) throw countError;
				
				// Fetch the emails with customer information
				const { data, error: fetchError } = await supabase
					.from('email')
					.select(`
						*,
						customer:customers(id, first_name, last_name, email)
					`)
					.range(pagination.offset, pagination.offset + pagination.limit - 1)
					.order('created_at', { ascending: false });
					
				if (fetchError) throw fetchError;
				
				setEmails(data || []);
				setPagination(prev => ({
					...prev,
					total: count || 0
				}));
			} catch (err) {
				console.error("Error fetching emails:", err);
				setError(err.message || "Failed to fetch emails");
			} finally {
				setLoading(false);
			}
		};

		fetchEmails();
	}, [pagination.limit, pagination.offset]);

	// Handle server-side pagination change
	const handlePaginationChange = (params) => {
		setPagination({
			limit: params.pageSize,
			offset: params.page * params.pageSize,
			total: pagination.total
		});
	};

	const columnDefinitions = [
        genericColumnFactory({
			field: "to",
			headerName: "Email to:",
			minWidth: 150,
			flex: 1.5,
			renderCell: (params) => {
				const customer = params.row.customer;
				if (customer) {
					const firstName = customer.first_name || '';
					const lastName = customer.last_name || '';
					const fullName = `${firstName} ${lastName}`.trim();
					
					if (fullName) {
						return (
							<Box
								sx={{
									lineHeight: 1.2,
									display: "flex",
									flexDirection: "column",
									height: "100%",
									justifyContent: "center",
								}}
							>
								<Box sx={{ fontWeight: 500 }}>{fullName}</Box>
								<Box sx={{ fontSize: "xs", color: "gray.500" }}>{params.value}</Box>
							</Box>
						);
					}
				}
				
				// If no customer data or name, just show the email
				return (
					<Box
						sx={{
							height: "100%",
							display: "flex",
							alignItems: "center",
						}}
					>
						{params.value}
					</Box>
				);
			},
		}),
        dateColumnFactory({
			field: "created_at",
			headerName: "Date",
			flex: 1,
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
			field: "status",
			headerName: "Status",
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
					<EmailStatusBadge status={params.value} />
				</Box>
			),
		}),
		clickableColumnFactory({
			field: "subject",
			headerName: "Subject",
			minWidth: 200,
			flex: 2,
			link: (params) => `/dashboard/emails/${params.id}`
		}),
        genericColumnFactory({
			field: "from",
			headerName: "From",
			minWidth: 200,
			flex: 1.5,
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
					subjectFilterConfig,
					fromFilterConfig,
					toFilterConfig,
					sentDateFilterConfig,
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
					rows={clientFiltering(emails, filters)}
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
					placeholder="Search emails..."
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