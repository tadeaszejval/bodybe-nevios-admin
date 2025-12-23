"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { ColorDot } from "../components/ColorDot";
const ALL_STATUSES = {
	processed: {
		value: "processed",
		label: "Processed",
		color: "green",
	},
	possible_fraud: {
		value: "possible_fraud",
		label: "Possible Fraud",
		color: "yellow",
	},
	processing: {
		value: "processing",
		label: "Processing...",
		color: "blue",
	},
	failed: {
		value: "failed",
		label: "Failed",
		color: "red",
	},
};
export const ALL_STATUSES_LIST = Object.values(ALL_STATUSES);
export const statusMatcher = (value) =>
	match(value)
		.with("processed", (value) => ALL_STATUSES.processed)
		.with("possible_fraud", (value) => ALL_STATUSES.possible_fraud)
		.with("processing", (value) => ALL_STATUSES.processing)
		.with("failed", (value) => ALL_STATUSES.failed)
		.exhaustive();
export function StatusBadge({ status, label, color, customSx = {} }) {
	// If label and color are provided directly, use them
	// Otherwise, use the status matcher for predefined statuses
	let statusMeta;
	
	if (label && color) {
		statusMeta = { label, color };
	} else if (status) {
		try {
			statusMeta = statusMatcher(status);
		} catch (error) {
			// Fallback for unknown statuses
			statusMeta = {
				label: status,
				color: "gray"
			};
		}
	} else {
		// Default fallback
		statusMeta = {
			label: "Unknown",
			color: "gray"
		};
	}
	
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				padding: 0,
				backgroundColor: `${statusMeta.color}.50`,
				color: `${statusMeta.color}.800`,
				fontWeight: 500,
				borderRadius: 1,
				borderColor: `${statusMeta.color}.200`,
				borderWidth: 1,
				borderStyle: "solid",
				px: 0.75,
				py: 0.25,
				fontSize: "xs",
				...customSx,
			}}
		>
			<ColorDot color={statusMeta.color} />
			{statusMeta.label}
		</Box>
	);
}
