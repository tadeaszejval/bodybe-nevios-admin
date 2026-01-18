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
import { NeviosBadge } from "../../nevios/NeviosBadge";
import { useModuleQuery } from "../../../hooks/useModuleQuery";
import { EMAILS_FILTER_CONFIG } from "../../nevios/NeviosFilters/EmailsFilterConfig";

export function EmailTable({ 
	tableHeight,
	initialFilters = {},
	initialSearch = ""
}) {

	// Transform raw email data to table format
	const transformEmailData = useCallback((emails) => {
		return emails.map(email => ({
			id: email.id,
			subject: email.subject || 'No Subject',
			from: email.from || 'Unknown',
			to: email.to || 'Unknown',
			status: email.status || 'UNKNOWN',
			created_at: email.created_at,
			customer_name: email.customer ? 
				`${email.customer.first_name || ''} ${email.customer.last_name || ''}`.trim() : 
				'Unknown',
			// Keep original data for reference
			_original: email
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
	} = useModuleQuery('email', {
		expand: ["customer"],
		initialFilters,
		initialSearch,
		enableSearch: true,
		transformData: transformEmailData
	});

	const columnDefinitions = [
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
			minWidth: 180,
			flex: 1.5,
		}),
		genericColumnFactory({
			field: "to",
			headerName: "To",
			minWidth: 180,
			flex: 1.5,
		}),
		genericColumnFactory({
			field: "status",
			headerName: "Status",
			flex: 1,
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
					<NeviosBadge value={params.value} configKey="emailStatus" />
				</Box>
			),
		}),
		dateColumnFactory({
			field: "created_at",
			headerName: "Date",
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
				enableSearch={true}
				searchTerm={searchTerm}
				onSearchChange={updateSearch}
				searchPlaceholder="Search emails by subject, sender, recipient, or customer..."
				enableFilters={true}
				filterConfigs={EMAILS_FILTER_CONFIG}
				activeFilters={filters}
				onFiltersChange={updateFilters}
			emptyStateProps={{
				title: 'No emails found',
				description: 'There are no emails to display',
			}}
		/>
		</Box>
	);
}