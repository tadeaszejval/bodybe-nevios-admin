"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { NeviosFormPaper } from "../../../nevios/NeviosFormPaper";
import { TbTruck } from "react-icons/tb";

export function ShippingMethodsTab() {
	return (
		<Box sx={{ px: 3 }}>
			<NeviosFormPaper>
				<Box sx={{ textAlign: "center", py: 6 }}>
					<TbTruck size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
					<Typography variant="h6" sx={{ mb: 1 }}>
						Shipping Methods
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Configure delivery types (HOME, POINT, STORE)
					</Typography>
					<Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
						Coming soon...
					</Typography>
				</Box>
			</NeviosFormPaper>
		</Box>
	);
}

