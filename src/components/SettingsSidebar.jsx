"use client";
import React from "react";
import { Box } from "@mui/material";
import { NeviosFormPaper } from "./nevios/NeviosFormPaper";

export function SettingsSidebar() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}
		>
			<NeviosFormPaper title="Settings">
				{/* Settings navigation items will go here */}
			</NeviosFormPaper>
		</Box>
	);
}

