"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { NeviosFormPaper } from "../../../../components/nevios/NeviosFormPaper";
import { NeviosTable } from "../../../../components/nevios/NeviosTable";
import { NeviosPrimaryButton } from "../../../../components/nevios/NeviosButtons";
import { TbShoppingCart, TbPlus } from "react-icons/tb";
import { useModuleQuery } from "../../../../hooks/useModuleQuery";
import { SalesChannelTypeBadge } from "../../../../components/dashboard/settings/sales-channels/SalesChannelTypeBadge";

export default function DashboardSalesChannels() {
	const router = useRouter();
	const {
		data: salesChannels,
		loading,
		totalCount,
		pagination,
		handlePaginationChange,
		searchTerm,
		updateSearch,
	} = useModuleQuery("configuration/sales-channels", {
		enableSearch: true,
		defaultOrderBy: "name",
		defaultAscending: true,
		method: "GET",
	});

	const columns = [
		{
			field: "name",
			headerName: "Channel",
			flex: 1,
			minWidth: 200,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							{params.row.name}
						</Typography>
					</Box>
				</Box>
			),
		},
		{
			field: "account_type",
			headerName: "Type",
			minWidth: 120,
			renderCell: (params) => (
				<Box
					sx={{
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
					}}
				>
					<SalesChannelTypeBadge type={params.value || "OTHER"} />
				</Box>
			),
		},
		{
			field: "order_name_format",
			headerName: "Order Format",
			minWidth: 150,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
						<Typography variant="body2" sx={{ color: "gray.600" }}>
							{params.row.order_name_format}
						</Typography>
					</Box>
				</Box>
			),
		},
		{
			field: "markets_count",
			headerName: "Markets",
			width: 100,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
						<Typography variant="body2" sx={{ color: "gray.600" }}>
							{params.value || 0}
						</Typography>
					</Box>
				</Box>
			),
		},
	];

	const handleAddSalesChannel = () => {
		console.log("Add sales channel clicked");
		// TODO: Open create sales channel dialog
	};

	const handleRowClick = (params) => {
		// Navigate to sales channel detail page
		router.push(`/dashboard/settings/sales-channels/${params.row.id}`);
	};

	return (
		<>
			<DashboardHeader
				title="Sales Channels"
				icon={<TbShoppingCart size={20} />}
				description="Manage different ways you sell products"
				action={
					<NeviosPrimaryButton
						onClick={handleAddSalesChannel}
						startIcon={<TbPlus size={18} />}
					>
						Add Channel
					</NeviosPrimaryButton>
				}
			/>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<NeviosFormPaper
					title="Sales Channels"
					description="Configure sales channels like online store, wholesale, retail, and B2B"
					gap={2}
				>
					<NeviosTable
						loading={loading}
						columns={columns}
						data={salesChannels}
						totalCount={totalCount}
						pagination={pagination}
						onPaginationChange={handlePaginationChange}
						onRowClick={handleRowClick}
						enableSearch={true}
						searchTerm={searchTerm}
						onSearchChange={updateSearch}
						searchPlaceholder="Search sales channels by name or ID"
						hideFooter={true}
						checkboxSelection={false}
						tableHeight="600px"
						emptyStateProps={{
							title: "No sales channels yet",
							description: "Create your first sales channel to start selling products",
						}}
					/>
				</NeviosFormPaper>
			</Box>
		</>
	);
}

export const SalesChannels = DashboardSalesChannels;
