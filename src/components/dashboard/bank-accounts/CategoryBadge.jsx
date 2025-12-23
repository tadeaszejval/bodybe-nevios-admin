"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbCash, TbRefresh, TbReceipt, TbArrowsExchange, TbDots } from "react-icons/tb";

const CATEGORY_TYPES = {
	PAYMENT: {
		value: "PAYMENT",
		label: "Payment",
		color: "blue",
		icon: <TbCash size={14} />
	},
	REFUND: {
		value: "REFUND",
		label: "Refund",
		color: "orange",
		icon: <TbRefresh size={14} />
	},
	FEE: {
		value: "FEE",
		label: "Fee",
		color: "red",
		icon: <TbReceipt size={14} />
	},
	TRANSFER: {
		value: "TRANSFER",
		label: "Transfer",
		color: "purple",
		icon: <TbArrowsExchange size={14} />
	},
	OTHER: {
		value: "OTHER",
		label: "Other",
		color: "gray",
		icon: <TbDots size={14} />
	},
};

export const CATEGORY_TYPES_LIST = Object.values(CATEGORY_TYPES);

export const categoryMatcher = (value) =>
	match(value)
		.with("PAYMENT", () => CATEGORY_TYPES.PAYMENT)
		.with("REFUND", () => CATEGORY_TYPES.REFUND)
		.with("FEE", () => CATEGORY_TYPES.FEE)
		.with("TRANSFER", () => CATEGORY_TYPES.TRANSFER)
		.with("OTHER", () => CATEGORY_TYPES.OTHER)
		.otherwise(() => CATEGORY_TYPES.OTHER); // Default fallback

export function CategoryBadge({ category, customSx = {} }) {
	// Handle case sensitivity by converting to uppercase
	const normalizedCategory = category?.toUpperCase() || "OTHER";
	const categoryMeta = categoryMatcher(normalizedCategory);

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				padding: 0,
				backgroundColor: `${categoryMeta.color}.50`,
				color: `${categoryMeta.color}.800`,
				fontWeight: 500,
				borderRadius: 1,
				borderColor: `${categoryMeta.color}.200`,
				borderWidth: 1,
				borderStyle: "solid",
				px: 0.75,
				py: 0.25,
				fontSize: "xs",
				...customSx,
			}}
		>
			{categoryMeta.icon}
			{categoryMeta.label}
		</Box>
	);
}

