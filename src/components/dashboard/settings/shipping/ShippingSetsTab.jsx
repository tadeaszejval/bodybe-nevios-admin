"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { NeviosFormPaper } from "../../../nevios/NeviosFormPaper";
import { TbTag } from "react-icons/tb";

export function ShippingSetsTab() {
	return (
		<Box sx={{ px: 3 }}>
			<NeviosFormPaper>
				<Box sx={{ textAlign: "center", py: 6 }}>
					<TbTag size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
					<Typography variant="h6" sx={{ mb: 1 }}>
						Shipping Sets
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Configure pricing per market and zone combination
					</Typography>
					<Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
						Coming soon...
					</Typography>
				</Box>
			</NeviosFormPaper>
		</Box>
	);
}

