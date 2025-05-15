"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { ColorDot } from "../../../components/ColorDot";
import { TbPackage, TbTruckDelivery, TbTruckLoading } from "react-icons/tb";

const FULFILLMENT_STATUSES = {
  UNFULFILLED: {
    value: "UNFULFILLED",
    label: "Unfulfilled",
    color: "gray", // Processing color,
    icon: <TbPackage size={14} />
  },
  PARTIALLY_FULFILLED: {
    value: "PARTIALLY_FULFILLED",
    label: "Partially Fulfilled",
    color: "yellow", // Warning/in-progress color
    icon: <TbTruckDelivery size={14} />
  },
  FULFILLED: {
    value: "FULFILLED",
    label: "Fulfilled",
    color: "blue", // Success color
    icon: <TbTruckLoading size={14} />
  },
};

export const FULFILLMENT_STATUSES_LIST = Object.values(FULFILLMENT_STATUSES);

export const fulfillmentStatusMatcher = (value) =>
  match(value)
    .with("UNFULFILLED", () => FULFILLMENT_STATUSES.UNFULFILLED)
    .with("PARTIALLY_FULFILLED", () => FULFILLMENT_STATUSES.PARTIALLY_FULFILLED)
    .with("FULFILLED", () => FULFILLMENT_STATUSES.FULFILLED)
    .otherwise(() => FULFILLMENT_STATUSES.UNFULFILLED); // Default fallback

export function FulfillmentStatusBadge({ status, customSx = {} }) {
  // Handle case sensitivity by converting to uppercase
  const normalizedStatus = status?.toUpperCase() || "UNFULFILLED";
  const statusMeta = fulfillmentStatusMatcher(normalizedStatus);
  
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
      {statusMeta.icon}
      {statusMeta.label}
    </Box>
  );
}
