"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import { NeviosFormPaper } from "../../../nevios/NeviosFormPaper";
import { NeviosPrimaryButton, NeviosSecondaryButton } from "../../../nevios/NeviosButtons";
import { TbPlus, TbEdit, TbWorld, TbTrash } from "react-icons/tb";
import { queryShippingZones, deleteShippingZone } from "../../../../../actions/settings/shipping";
import { CreateZoneDialog } from "./CreateZoneDialog";
import NeviosConfirmDialog from "../../../nevios/NeviosConfirmDialog";

export function ShippingZonesTab() {
	const [zones, setZones] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [zoneToDelete, setZoneToDelete] = useState(null);

	const loadZones = async () => {
		try {
			setLoading(true);
			const result = await queryShippingZones();
			if (result.success) {
				setZones(result.data || []);
			}
		} catch (err) {
			setError("Failed to load shipping zones");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadZones();
	}, []);

	const handleDelete = async () => {
		if (!zoneToDelete) return;
		
		try {
			await deleteShippingZone(zoneToDelete.id);
			setDeleteDialogOpen(false);
			setZoneToDelete(null);
			loadZones();
		} catch (err) {
			console.error("Failed to delete zone:", err);
		}
	};

	const getCountryFlag = (countryCode) => {
		const code = countryCode.toUpperCase();
		return String.fromCodePoint(...[...code].map(c => 127397 + c.charCodeAt()));
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ px: 3 }}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ px: 3 }}>
			{/* Header with Create Button */}
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Box>
					<Typography variant="h6" sx={{ fontWeight: 600 }}>
						Shipping Zones
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{zones.length} zones • Group countries for reusable configuration
					</Typography>
				</Box>
				<NeviosPrimaryButton
					size="small"
					startIcon={<TbPlus size={18} />}
					onClick={() => setCreateDialogOpen(true)}
				>
					Create Zone
				</NeviosPrimaryButton>
			</Box>

			{/* Zones Grid */}
			{zones.length === 0 ? (
				<NeviosFormPaper>
					<Box sx={{ textAlign: "center", py: 6 }}>
						<TbWorld size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
						<Typography variant="h6" sx={{ mb: 1 }}>
							No shipping zones yet
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Create zones to group countries and simplify your shipping configuration
						</Typography>
						<NeviosPrimaryButton
							startIcon={<TbPlus size={18} />}
							onClick={() => setCreateDialogOpen(true)}
						>
							Create Your First Zone
						</NeviosPrimaryButton>
					</Box>
				</NeviosFormPaper>
			) : (
				<Box sx={{ display: "grid", gap: 2 }}>
					{zones.map((zone) => (
						<NeviosFormPaper key={zone.id}>
							<Box>
								{/* Zone Header */}
								<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
									<Box sx={{ flex: 1 }}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
											<Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
												{zone.name}
											</Typography>
											<Chip
												size="small"
												color={zone.is_active ? "success" : "default"}
												label={zone.is_active ? "Active" : "Inactive"}
											/>
										</Box>
										{zone.description && (
											<Typography variant="body2" color="text.secondary">
												{zone.description}
											</Typography>
										)}
									</Box>
									<Box sx={{ display: "flex", gap: 1 }}>
										<NeviosSecondaryButton
											size="small"
											startIcon={<TbEdit size={16} />}
										>
											Edit
										</NeviosSecondaryButton>
										<NeviosSecondaryButton
											size="small"
											startIcon={<TbTrash size={16} />}
											onClick={() => {
												setZoneToDelete(zone);
												setDeleteDialogOpen(true);
											}}
										>
											Delete
										</NeviosSecondaryButton>
									</Box>
								</Box>

								{/* Countries */}
								{zone.countries && zone.countries.length > 0 ? (
									<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
										{zone.countries.map((country) => (
											<Box
												key={country}
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 0.5,
													px: 1.5,
													py: 0.5,
													borderRadius: 1,
													backgroundColor: "action.hover",
													fontSize: "0.875rem",
												}}
											>
												<span style={{ fontSize: "1.2em" }}>{getCountryFlag(country)}</span>
												<span>{country}</span>
											</Box>
										))}
									</Box>
								) : (
									<Box sx={{ mb: 2 }}>
										<Chip size="small" color="info" label="🌍 Worldwide (all countries)" />
									</Box>
								)}

								{/* Usage Count */}
								<Typography variant="caption" color="text.secondary">
									Used in {zone.usage_count || 0} shipping sets
								</Typography>
							</Box>
						</NeviosFormPaper>
					))}
				</Box>
			)}

			{/* Create Zone Dialog */}
			<CreateZoneDialog
				open={createDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				onSuccess={() => {
					setCreateDialogOpen(false);
					loadZones();
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<NeviosConfirmDialog
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				onConfirm={handleDelete}
				title="Delete Shipping Zone"
				message={`Are you sure you want to delete "${zoneToDelete?.name}"? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
			/>
		</Box>
	);
}

