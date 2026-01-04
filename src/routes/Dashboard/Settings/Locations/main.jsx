"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Chip } from "@mui/material";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { NeviosFormPaper } from "../../../../components/nevios/NeviosFormPaper";
import { NeviosBlock } from "../../../../components/nevios/NeviosBlock";
import { NeviosTable } from "../../../../components/nevios/NeviosTable";
import { NeviosPrimaryButton } from "../../../../components/nevios/NeviosButtons";
import { NeviosButtonSelect } from "../../../../components/nevios/NeviosSelect";
import { TbMap, TbPlus, TbBuildingCottage, TbBuildingStore, TbMapPin, TbAdjustmentsExclamation } from "react-icons/tb";
import { useModuleQuery } from "../../../../hooks/useModuleQuery";
import { LocationStatusBadge } from "../../../../components/dashboard/settings/locations/statusBadge";
import { setDefaultLocation } from "../../../../../actions/settings/locations";

export default function DashboardLocations() {
	const router = useRouter();
	const [changingDefault, setChangingDefault] = useState(false);
	const {
		data: locations,
		loading,
		error,
		totalCount,
		pagination,
		handlePaginationChange,
		searchTerm,
		updateSearch,
		refetch,
	} = useModuleQuery("configuration/locations", {
		enableSearch: true,
		defaultOrderBy: "name",
		defaultAscending: true,
		method: "GET",
	});

	const columns = [
		{
			field: "name",
			headerName: "Name",
			flex: 1,
			minWidth: 140,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
					{params.row.type === "WAREHOUSE" && (
						<TbBuildingCottage size={18} />
					)}
					{params.row.type === "STORE" && (
						<TbBuildingStore size={18} />
					)}
					<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							{params.row.name}
						</Typography>
						<Typography variant="body3" sx={{ color: "gray.500" }}>
							{params.row.city}
						</Typography>
					</Box>
				</Box>
			),
		},
		{
			field: "is_active",
			headerName: "Status",
			minWidth: 90,
			renderCell: (params) =>
				<Box
					sx={{
						lineHeight: 1.2,
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
					}}
				>
					<LocationStatusBadge status={params.value} />
				</Box>
		},
	];
	const handleAddLocation = () => {
		console.log("Add location clicked");
		// TODO: Open create location dialog
	};

	const handleRowClick = (params) => {
		// Navigate to location detail page
		router.push(`/dashboard/settings/locations/${params.row.id}`);
	};

	const handleChangeDefaultLocation = async (locationId) => {
		try {
			setChangingDefault(true);
			const result = await setDefaultLocation(locationId);

			if (result.success) {
				// Refetch locations to update the UI
				refetch?.();
			}
		} catch (error) {
			console.error("Error setting default location:", error);
		} finally {
			setChangingDefault(false);
		}
	};

	// Find the default location
	const defaultLocation = locations?.find(loc => loc.is_default);

	return (
		<>
			<DashboardHeader
				title="Locations"
				icon={<TbMap size={20} />}
				description="Manage warehouses, stores, and fulfillment locations"
				action={
					<NeviosPrimaryButton
						onClick={handleAddLocation}
						startIcon={<TbPlus size={18} />}
					>
						Add Location
					</NeviosPrimaryButton>
				}
			/>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

				<NeviosFormPaper
					title="Locations"
					description="Configure your physical locations and their shipping capabilities"
					gap={2}
				>
					<NeviosTable
						loading={loading}
						columns={columns}
						data={locations}
						totalCount={totalCount}
						pagination={pagination}
						onPaginationChange={handlePaginationChange}
						onRowClick={handleRowClick}
						enableSearch={true}
						searchTerm={searchTerm}
						onSearchChange={updateSearch}
						searchPlaceholder="Search locations by name, address, or city"
						hideFooter={true}
						checkboxSelection={false}
						tableHeight="600px"
						emptyStateProps={{
							title: "No locations yet",
							description: "Create your first location to start managing warehouses and stores",
							buttonText: "Add Location",
							action: handleAddLocation,
						}}
					/>
				</NeviosFormPaper>

				<NeviosFormPaper
					title="Default location"
					description="This location is used by Nevios when no other location is specified"
					footerDescription={"Default locations must be able to fulfill orders."}
					gap={0}
				>
				<NeviosBlock
					icon={<TbMapPin size={18} />}
					primaryText="Shop location"
					secondaryText={defaultLocation?.name || "No default location set"}
					rightContent={
						<NeviosButtonSelect
							value={defaultLocation?.id || "Choose a location"}
							onChange={(e) => handleChangeDefaultLocation(e.target.value)}
							disabled={changingDefault || loading}
							options={locations?.map((location) => ({
								value: location.id,
								label: location.name,
							})) || []}
						/>
					}
				/>
				</NeviosFormPaper>

				<NeviosFormPaper
					title="Location rules"
					description="Location shipping rules define which countries/zones each warehouse can ship to and how orders should be routed to different locations."
					footerDescription={"If no rules are set, all orders are fulfilled from the default location."}
					gap={0}
				>
				<NeviosBlock
					icon={<TbAdjustmentsExclamation size={18} />}
					primaryText="Configure rules"
					onClick={() => router.push("/dashboard/settings/locations/rules")}
				/>
				</NeviosFormPaper>
			</Box>
		</>
	);
}

export const Locations = DashboardLocations;
