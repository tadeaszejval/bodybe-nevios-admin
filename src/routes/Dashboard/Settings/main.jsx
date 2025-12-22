"use client";
import React from "react";
import { Typography } from "@mui/material";
import { PageContainer } from "../../../components/PageContainer";

export default function DashboardSettings() {
	return (
		<PageContainer customSx={{ maxWidth: "900px" }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
				General
			</Typography>
			<Typography variant="body2" color="text.secondary">
				General settings content will go here...
			</Typography>
		</PageContainer>
	);
}

export const Settings = DashboardSettings;

