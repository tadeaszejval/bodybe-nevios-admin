"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbShoppingCart, TbBuildingStore, TbTruckDelivery, TbBriefcase, TbDots } from "react-icons/tb";

const CHANNEL_TYPES = {
	SHOPIFY: {
		value: "SHOPIFY",
		label: "Shopify",
		color: "green",
		icon: <TbShoppingCart size={14} />
	},
	RETAIL: {
		value: "RETAIL",
		label: "Retail",
		color: "blue",
		icon: <TbBuildingStore size={14} />
	},
	WHOLESALE: {
		value: "WHOLESALE",
		label: "Wholesale",
		color: "purple",
		icon: <TbTruckDelivery size={14} />
	},
	B2B: {
		value: "B2B",
		label: "B2B",
		color: "orange",
		icon: <TbBriefcase size={14} />
	},
	OTHER: {
		value: "OTHER",
		label: "Other",
		color: "gray",
		icon: <TbDots size={14} />
	},
};

export const CHANNEL_TYPES_LIST = Object.values(CHANNEL_TYPES);

export const channelTypeMatcher = (value) =>
	match(value)
		.with("SHOPIFY", () => CHANNEL_TYPES.SHOPIFY)
		.with("RETAIL", () => CHANNEL_TYPES.RETAIL)
		.with("WHOLESALE", () => CHANNEL_TYPES.WHOLESALE)
		.with("B2B", () => CHANNEL_TYPES.B2B)
		.with("OTHER", () => CHANNEL_TYPES.OTHER)
		.otherwise(() => CHANNEL_TYPES.OTHER); // Default fallback

export function SalesChannelTypeBadge({ type, customSx = {} }) {
	// Handle case sensitivity by converting to uppercase
	const normalizedType = type?.toUpperCase() || "OTHER";
	const typeMeta = channelTypeMatcher(normalizedType);

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

