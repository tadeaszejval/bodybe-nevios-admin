"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Chip } from "@mui/material";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { NeviosFormPaper } from "../../../../components/nevios/NeviosFormPaper";
import { NeviosBlock } from "../../../../components/nevios/NeviosBlock";
import { NeviosBlockGroup } from "../../../../components/nevios/NeviosBlockGroup";
import { TbMap, TbMapPin, TbBuildingStore, TbPencil, TbTruck, TbPackage } from "react-icons/tb";
import { ContentLoadingScreen } from "../../../../components/ContentLoadingScreen";
import { retrieveLocations, modifyLocation } from "../../../../../actions/settings/locations";
import { NeviosToggle } from "../../../../components/nevios/NeviosToggle";
import EditLocationNamePopup from "../../../../components/dashboard/settings/locations/EditLocationNamePopup";
import EditLocationAddressPopup from "../../../../components/dashboard/settings/locations/EditLocationAddressPopup";

export function LocationView({ locationId }) {
	const [location, setLocation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [canShip, setCanShip] = useState(true);
	const [canFulfill, setCanFulfill] = useState(false);
	const [editNameOpen, setEditNameOpen] = useState(false);
	const [editAddressOpen, setEditAddressOpen] = useState(false);
	const [savingName, setSavingName] = useState(false);
	const [savingAddress, setSavingAddress] = useState(false);
	const router = useRouter();

	useEffect(() => {
		async function fetchLocation() {
			try {
				setLoading(true);
				const result = await retrieveLocations(locationId);
				
				if (result.success && result.data) {
					// If data is an array, take the first item, otherwise use data directly
					setLocation(Array.isArray(result.data) ? result.data[0] : result.data);
				}
			} catch (error) {
				console.error("Error fetching location:", error);
			} finally {
				setLoading(false);
			}
		}

		if (locationId) {
			fetchLocation();
		}
	}, [locationId]);

	const handleEdit = () => {
		setEditNameOpen(true);
	};

	const handleEditAddress = () => {
		setEditAddressOpen(true);
	};

	const handleSaveName = async (newName) => {
		try {
			setSavingName(true);
			const result = await modifyLocation(locationId, { name: newName });
			
			if (result.success) {
				// Update local state
				setLocation(prev => ({ ...prev, name: newName }));
				setEditNameOpen(false);
			}
		} catch (error) {
			console.error("Error updating location name:", error);
		} finally {
			setSavingName(false);
		}
	};

	const handleSaveAddress = async (addressData) => {
		try {
			setSavingAddress(true);
			const result = await modifyLocation(locationId, addressData);
			
			if (result.success) {
				// Update local state
				setLocation(prev => ({ ...prev, ...addressData }));
				setEditAddressOpen(false);
			}
		} catch (error) {
			console.error("Error updating location address:", error);
		} finally {
			setSavingAddress(false);
		}
	};

	const handleDelete = () => {
		console.log("Delete location:", locationId);
		// TODO: Open delete confirmation dialog
	};

	const handleBack = () => {
		router.push("/dashboard/settings/locations");
	};

	if (loading) {
		return <ContentLoadingScreen />;
	}

	if (!location) {
		return (
			<Box sx={{ p: 3 }}>
				<DashboardHeader
					title="Location not found"
					icon={<TbMap size={20} />}
					iconOnClick={handleBack}
				/>
			</Box>
		);
	}

	return (
		<>
			<DashboardHeader
				title={location.name}
				icon={<TbMap size={20} />}
				iconOnClick={handleBack}
				iconTooltipTitle="Back to list of locations"
			/>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{/* Location Information */}
				<NeviosFormPaper
					title="Location Information"
					description="Basic information about this location"
					gap={2}
				>
					<NeviosBlockGroup>
						<NeviosBlock
							icon={<TbBuildingStore size={18} />}
							primaryText="Name"
							secondaryText={location.name}
							rightContent={
								<IconButton size="small" onClick={handleEdit}>
									<TbPencil size={18} />
								</IconButton>
							}
						/>
					<NeviosBlock
						icon={<TbMapPin size={18} />}
						primaryText="Address"
						secondaryText={
							location.address 
								? `${location.address}${location.city ? `, ${location.city}` : ''}${location.postal_code ? ` ${location.postal_code}` : ''}`
								: "No address set"
						}
						rightContent={
							<IconButton size="small" onClick={handleEditAddress}>
								<TbPencil size={18} />
							</IconButton>
						}
					/>
					</NeviosBlockGroup>
				</NeviosFormPaper>

				{/* Location Settings */}
				<NeviosFormPaper
					title="Location Settings"
					description="Configure capabilities and features for this location"
					gap={2}
				>
					<NeviosBlockGroup>
						<NeviosBlock
							icon={<TbTruck size={18} />}
							primaryText="Can ship from location"
							rightContent={
								<NeviosToggle
									checked={canShip}
									onChange={(e) => setCanShip(e.target.checked)}
									name="can_ship"
								/>
							}
						/>
					</NeviosBlockGroup>
				</NeviosFormPaper>
			</Box>

		{/* Edit Name Popup */}
		<EditLocationNamePopup
			open={editNameOpen}
			onClose={() => setEditNameOpen(false)}
			onSave={handleSaveName}
			initialName={location.name}
			loading={savingName}
		/>

		{/* Edit Address Popup */}
		<EditLocationAddressPopup
			open={editAddressOpen}
			onClose={() => setEditAddressOpen(false)}
			onSave={handleSaveAddress}
			initialData={{
				address: location.address,
				city: location.city,
				country: location.country,
				postal_code: location.postal_code
			}}
			loading={savingAddress}
		/>
	</>
);
}

