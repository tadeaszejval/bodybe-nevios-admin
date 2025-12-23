"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { formatCurrencyNumber } from "../../../core/formatters";
import { TbCheck, TbAlertTriangle, TbArrowUp, TbMinus } from "react-icons/tb";

const RECONCILIATION_STATUSES = {
	EXACT_MATCH: {
		value: "EXACT_MATCH",
		label: "Exact Match",
		color: "green",
		icon: <TbCheck size={14} />
	},
	OVERPAID: {
		value: "OVERPAID",
		label: "Overpaid",
		color: "blue",
		icon: <TbArrowUp size={14} />
	},
	UNDERPAID: {
		value: "UNDERPAID",
		label: "Underpaid",
		color: "orange",
		icon: <TbAlertTriangle size={14} />
	},
	UNRECONCILED: {
		value: "UNRECONCILED",
		label: "Unreconciled",
		color: "gray",
		icon: <TbMinus size={14} />
	},
};

export const RECONCILIATION_STATUSES_LIST = Object.values(RECONCILIATION_STATUSES);

export const reconciliationStatusMatcher = (value) =>
	match(value)
		.with("EXACT_MATCH", () => RECONCILIATION_STATUSES.EXACT_MATCH)
		.with("OVERPAID", () => RECONCILIATION_STATUSES.OVERPAID)
		.with("UNDERPAID", () => RECONCILIATION_STATUSES.UNDERPAID)
		.with("UNRECONCILED", () => RECONCILIATION_STATUSES.UNRECONCILED)
		.otherwise(() => RECONCILIATION_STATUSES.UNRECONCILED); // Default fallback

export function ReconciliationStatusBadge({ status, difference, customSx = {} }) {
	// Handle case sensitivity by converting to uppercase
	const normalizedStatus = status?.toUpperCase() || "UNRECONCILED";
	const statusMeta = reconciliationStatusMatcher(normalizedStatus);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
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
				{statusMeta.icon}
				{statusMeta.label}
			</Box>
			{difference && difference !== 0 && (
				<Box sx={{ fontSize: "xs", color: "gray.500" }}>
					Diff: {formatCurrencyNumber(difference)}
				</Box>
			)}
		</Box>
	);
}

