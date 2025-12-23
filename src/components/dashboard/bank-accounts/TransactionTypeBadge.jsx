"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";

const TRANSACTION_TYPES = {
	INCOMING: {
		value: "INCOMING",
		label: "Incoming",
		color: "green",
		icon: <TbArrowDown size={14} />
	},
	OUTGOING: {
		value: "OUTGOING",
		label: "Outgoing",
		color: "red",
		icon: <TbArrowUp size={14} />
	},
};

export const TRANSACTION_TYPES_LIST = Object.values(TRANSACTION_TYPES);

export const transactionTypeMatcher = (value) =>
	match(value)
		.with("INCOMING", () => TRANSACTION_TYPES.INCOMING)
		.with("OUTGOING", () => TRANSACTION_TYPES.OUTGOING)
		.otherwise(() => TRANSACTION_TYPES.INCOMING); // Default fallback

export function TransactionTypeBadge({ type, customSx = {} }) {
	// Handle case sensitivity by converting to uppercase
	const normalizedType = type?.toUpperCase() || "INCOMING";
	const typeMeta = transactionTypeMatcher(normalizedType);

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				padding: 0,
				backgroundColor: `${typeMeta.color}.50`,
				color: `${typeMeta.color}.800`,
				fontWeight: 500,
				borderRadius: 1,
				borderColor: `${typeMeta.color}.200`,
				borderWidth: 1,
				borderStyle: "solid",
				px: 0.75,
				py: 0.25,
				fontSize: "xs",
				...customSx,
			}}
		>
			{typeMeta.icon}
			{typeMeta.label}
		</Box>
	);
}

