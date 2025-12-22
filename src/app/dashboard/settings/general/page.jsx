"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { PageContainer } from "../../../../components/PageContainer";

export default function GeneralSettingsPage() {
	return (
		<PageContainer>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
				General
			</Typography>
			<Typography variant="body2" color="text.secondary">
				General settings content will go here...
			</Typography>
		</PageContainer>
	);
}

