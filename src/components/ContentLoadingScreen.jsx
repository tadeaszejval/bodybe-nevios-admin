"use client";
import { Box } from "@mui/material";
import { Logo } from "./Logo";

export function ContentLoadingScreen() {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "400px",
			}}
		>
			<Logo animate height={24} />
		</Box>
	);
}

