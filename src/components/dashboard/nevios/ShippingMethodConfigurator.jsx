"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Link, IconButton, Collapse, CircularProgress, Alert } from "@mui/material";
import { NeviosFormPaper } from "../../nevios/NeviosFormPaper";
import { TbPlus, TbPencil, TbDotsVertical, TbChevronDown, TbChevronUp, TbWorld } from "react-icons/tb";
import {
	queryShippingZones,
	retrieveShippingMethods,
	retrieveShippingSets,
} from "../../../../actions/settings/shipping";

/**
 * ShippingMethodConfigurator
 * 
 * A reusable component for managing shipping zones and their associated shipping sets.
 * Displays zones in a collapsible format with shipping rates/methods for each zone.
 * 
 * @param {Object} props
 * @param {string} props.fulfillmentLocation - The fulfillment location ID (optional)
 * @param {function} props.onAddZone - Callback when "Add shipping zone" is clicked
 * @param {function} props.onEditZone - Callback when a zone is edited
 * @param {function} props.onAddRate - Callback when "Add rate" is clicked for a zone
 * @param {function} props.onEditRate - Callback when a rate is edited
 */
export function ShippingMethodConfigurator({
	fulfillmentLocation,
	onAddZone,
	onEditZone,
	onAddRate,
	onEditRate,
}) {
	const [zones, setZones] = useState([]);
	const [shippingMethods, setShippingMethods] = useState([]);
	const [shippingSets, setShippingSets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedZones, setExpandedZones] = useState({});

	useEffect(() => {
		loadData();
	}, [fulfillmentLocation]);

	const loadData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch zones, methods, and sets in parallel
			const [zonesResult, methodsResult, setsResult] = await Promise.all([
				queryShippingZones(),
				retrieveShippingMethods(),
				retrieveShippingSets(fulfillmentLocation ? { fulfillment_location: fulfillmentLocation } : {}),
			]);

			if (zonesResult.success) {
				const zonesData = zonesResult.data || [];
				setZones(zonesData);
				
				// Auto-expand first zone
				if (zonesData.length > 0) {
					setExpandedZones({ [zonesData[0].id]: true });
				}
			}

			if (methodsResult.success) {
				setShippingMethods(methodsResult.data || []);
			}

			if (setsResult.success) {
				setShippingSets(setsResult.data || []);
			}
		} catch (err) {
			console.error("Failed to load shipping data:", err);
			setError("Failed to load shipping configuration. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const toggleZone = (zoneId) => {
		setExpandedZones((prev) => ({
			...prev,
			[zoneId]: !prev[zoneId],
		}));
	};

	const getCountryFlag = (countryCode) => {
		const code = countryCode.toUpperCase();
		return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt()));
	};

	// Get shipping sets for a specific zone
	const getSetsForZone = (zoneId) => {
		return shippingSets.filter((set) => set.shipping_zone === zoneId);
	};

	// Get method details by ID
	const getMethodById = (methodId) => {
		return shippingMethods.find((method) => method.id === methodId);
	};

	// Format price display
	const formatPrice = (price, currency = "CZK") => {
		// Assuming price is stored in cents/smallest unit
		const amount = typeof price === "number" ? price / 100 : parseFloat(price);
		
		// Simple currency symbol mapping
		const currencySymbols = {
			CZK: "Kč",
			EUR: "€",
			USD: "$",
			GBP: "£",
		};

		const symbol = currencySymbols[currency] || currency;
		
		if (currency === "CZK") {
			return `${symbol} ${amount.toFixed(2)}`;
		}
		
		return `${symbol}${amount.toFixed(2)}`;
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
			<Alert severity="error" sx={{ mb: 3 }}>
				{error}
			</Alert>
		);
	}

	return (
		<NeviosFormPaper>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					Shipping zones
				</Typography>
				<Link
					component="button"
					onClick={() => onAddZone?.()}
					sx={{
						fontSize: "0.875rem",
						fontWeight: 500,
						textDecoration: "none",
						cursor: "pointer",
						"&:hover": { textDecoration: "underline" },
					}}
				>
					Add shipping zone
				</Link>
			</Box>

			{zones.length === 0 ? (
				<Box
					sx={{
						textAlign: "center",
						py: 8,
						borderTop: 1,
						borderColor: "divider",
					}}
				>
					<TbWorld size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
					<Typography variant="h6" sx={{ mb: 1 }}>
						No shipping zones yet
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
						Create zones to group countries and configure shipping rates
					</Typography>
					<Link
						component="button"
						onClick={() => onAddZone?.()}
						sx={{
							fontSize: "0.875rem",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						Add shipping zone
					</Link>
				</Box>
			) : (
				zones.map((zone, index) => {
					const zoneSets = getSetsForZone(zone.id);
					
					return (
						<Box
							key={zone.id}
							sx={{
								borderTop: 1,
								borderColor: "divider",
							}}
						>
							{/* Zone Header */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									py: 2,
									cursor: "pointer",
									"&:hover": { backgroundColor: "action.hover" },
								}}
								onClick={() => toggleZone(zone.id)}
							>
								<Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
									{zone.countries && zone.countries.length > 0 && (
										<Box sx={{ fontSize: "1.5rem" }}>
											{getCountryFlag(zone.countries[0])}
										</Box>
									)}
									<Box>
										<Typography variant="body1" sx={{ fontWeight: 500 }}>
											{zone.name}
											{zone.description && ` • ${zone.description}`}
										</Typography>
										{zone.countries && zone.countries.length > 0 && (
											<Typography variant="body2" color="text.secondary">
												{zone.countries.slice(0, 5).join(", ")}
												{zone.countries.length > 5 && `, ${zone.countries.length - 5} more`}
											</Typography>
										)}
									</Box>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<IconButton
										size="small"
										onClick={(e) => {
											e.stopPropagation();
											onEditZone?.(zone);
										}}
									>
										<TbDotsVertical size={20} />
									</IconButton>
									{expandedZones[zone.id] ? (
										<TbChevronUp size={20} />
									) : (
										<TbChevronDown size={20} />
									)}
								</Box>
							</Box>

							{/* Zone Content (Shipping Rates) */}
							<Collapse in={expandedZones[zone.id]}>
								<Box sx={{ pb: 2, pl: 6 }}>
									{zoneSets.length === 0 ? (
										<Box sx={{ py: 2 }}>
											<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
												No shipping rates configured for this zone
											</Typography>
										</Box>
									) : (
										<Box sx={{ mb: 2 }}>
											{zoneSets.map((set) => {
												const method = getMethodById(set.shipping_method);
												
												return (
													<Box
														key={set.id}
														sx={{
															display: "flex",
															justifyContent: "space-between",
															alignItems: "center",
															py: 1.5,
														}}
													>
														<Typography variant="body1">
															{method?.name || "Unknown Method"}
														</Typography>
														<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
															<Box
																sx={{
																	px: 2,
																	py: 0.5,
																	borderRadius: 2,
																	backgroundColor: "primary.lighter",
																	color: "primary.main",
																	fontWeight: 500,
																	fontSize: "0.875rem",
																}}
															>
																{formatPrice(set.price, set.market_currency?.split("_")[0] || "CZK")}
															</Box>
															<IconButton
																size="small"
																onClick={() => onEditRate?.(set, zone)}
															>
																<TbDotsVertical size={20} />
															</IconButton>
														</Box>
													</Box>
												);
											})}
										</Box>
									)}

									{/* Add Rate Button */}
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											color: "text.secondary",
											cursor: "pointer",
											py: 1,
											"&:hover": { color: "primary.main" },
										}}
										onClick={() => onAddRate?.(zone)}
									>
										<TbPlus size={18} />
										<Typography variant="body2" sx={{ fontWeight: 500 }}>
											Add rate
										</Typography>
									</Box>
								</Box>
							</Collapse>
						</Box>
					);
				})
			)}
		</NeviosFormPaper>
	);
}

