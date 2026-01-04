"use client";
import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Typography,
	TextField,
	FormControlLabel,
	Checkbox,
	Chip,
	Autocomplete,
} from "@mui/material";
import { NeviosPrimaryButton, NeviosSecondaryButton } from "../../../nevios/NeviosButtons";
import { createShippingZone } from "../../../../../actions/settings/shipping";
import { TbX } from "react-icons/tb";

// Common country list
const COUNTRIES = [
	{ code: "US", name: "United States" },
	{ code: "CA", name: "Canada" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "DE", name: "Germany" },
	{ code: "FR", name: "France" },
	{ code: "IT", name: "Italy" },
	{ code: "ES", name: "Spain" },
	{ code: "NL", name: "Netherlands" },
	{ code: "BE", name: "Belgium" },
	{ code: "AT", name: "Austria" },
	{ code: "CH", name: "Switzerland" },
	{ code: "CZ", name: "Czech Republic" },
	{ code: "SK", name: "Slovakia" },
	{ code: "PL", name: "Poland" },
	{ code: "HU", name: "Hungary" },
	{ code: "SI", name: "Slovenia" },
	{ code: "HR", name: "Croatia" },
	{ code: "RO", name: "Romania" },
	{ code: "BG", name: "Bulgaria" },
	{ code: "DK", name: "Denmark" },
	{ code: "SE", name: "Sweden" },
	{ code: "NO", name: "Norway" },
	{ code: "FI", name: "Finland" },
	{ code: "IE", name: "Ireland" },
	{ code: "PT", name: "Portugal" },
	{ code: "GR", name: "Greece" },
];

export function CreateZoneDialog({ open, onClose, onSuccess }) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		countries: [],
		is_active: true,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const result = await createShippingZone({
				name: formData.name,
				description: formData.description,
				countries: formData.countries.map(c => c.code),
				is_active: formData.is_active,
			});

			if (result.success) {
				setFormData({
					name: "",
					description: "",
					countries: [],
					is_active: true,
				});
				onSuccess();
			}
		} catch (err) {
			setError(err.message || "Failed to create zone");
		} finally {
			setLoading(false);
		}
	};

	const getCountryFlag = (countryCode) => {
		const code = countryCode.toUpperCase();
		return String.fromCodePoint(...[...code].map(c => 127397 + c.charCodeAt()));
	};

	return (
		<Dialog 
			open={open} 
			onClose={onClose} 
			maxWidth="sm" 
			fullWidth
			PaperProps={{
				sx: { borderRadius: 2 }
			}}
		>
			<DialogTitle>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Typography variant="h6" sx={{ fontWeight: 600 }}>
						Create Shipping Zone
					</Typography>
					<NeviosSecondaryButton
						size="small"
						onClick={onClose}
						sx={{ minWidth: "auto", p: 0.5 }}
					>
						<TbX size={20} />
					</NeviosSecondaryButton>
				</Box>
			</DialogTitle>

			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
						{/* Zone Name */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
								Zone Name *
							</Typography>
							<TextField
								fullWidth
								size="small"
								placeholder="e.g., DACH, EU Central, Worldwide"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
							/>
						</Box>

						{/* Description */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
								Description
							</Typography>
							<TextField
								fullWidth
								size="small"
								placeholder="e.g., Germany, Austria, Switzerland"
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							/>
						</Box>

						{/* Countries */}
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
								Countries *
							</Typography>
							<Autocomplete
								multiple
								options={COUNTRIES}
								getOptionLabel={(option) => `${getCountryFlag(option.code)} ${option.name}`}
								value={formData.countries}
								onChange={(e, newValue) => setFormData({ ...formData, countries: newValue })}
								renderInput={(params) => (
									<TextField
										{...params}
										size="small"
										placeholder="Select countries"
									/>
								)}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											label={`${getCountryFlag(option.code)} ${option.code}`}
											{...getTagProps({ index })}
											size="small"
										/>
									))
								}
							/>
							<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
								Leave empty for worldwide zone (all countries)
							</Typography>
						</Box>

						{/* Active Status */}
						<Box>
							<FormControlLabel
								control={
									<Checkbox
										checked={formData.is_active}
										onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
									/>
								}
								label="Active"
							/>
							<Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 4 }}>
								Active zones are available for shipping configuration
							</Typography>
						</Box>

						{error && (
							<Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 1 }}>
								<Typography variant="body2" color="error.dark">
									{error}
								</Typography>
							</Box>
						)}
					</Box>
				</DialogContent>

				<DialogActions sx={{ px: 3, pb: 3 }}>
					<NeviosSecondaryButton onClick={onClose} disabled={loading}>
						Cancel
					</NeviosSecondaryButton>
					<NeviosPrimaryButton type="submit" disabled={loading || !formData.name}>
						{loading ? "Creating..." : "Create Zone"}
					</NeviosPrimaryButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}

