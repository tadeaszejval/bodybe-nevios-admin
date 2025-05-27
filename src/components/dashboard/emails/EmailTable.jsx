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
import { EmailStatusBadge } from "./EmailStatusBadge";
import { useRouter } from "next/navigation";

// Transform function for email data
const transformEmails = (emails) => {
	return emails.map((email) => ({
		id: email.id,
		subject: email.subject || 'No Subject',
		from: email.from || 'Unknown',
		to: email.to || 'Unknown',
		status: email.status || 'UNKNOWN',
		created_at: email.created_at,
		customer_name: email.customer ? 
			`${email.customer.first_name || ''} ${email.customer.last_name || ''}`.trim() : 
			'Unknown'
	}));
};

export function EmailTable({ 
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
					<EmailStatusBadge status={params.value} />
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

	// Handle row clicks
	const handleRowClick = (params, event) => {
		if (event.ctrlKey || event.metaKey) {
			window.open(`/dashboard/emails/${params.id}`, '_blank');
		} else {
			router.push(`/dashboard/emails/${params.id}`);
		}
	};

	// Transform the data
	const transformedData = React.useMemo(() => {
		return transformEmails(data);
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
					title: 'No emails found',
					description: 'There are no emails to display',
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