"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbPackage, TbTruckDelivery, TbTruckLoading, TbX, TbClock } from "react-icons/tb";

const FULFILLMENT_STATUSES = {
  UNFULFILLED: {
    value: "UNFULFILLED",
    label: "Unfulfilled",
    color: "gray",
    icon: <TbPackage size={14} />
  },
  FULFILLED: {
    value: "FULFILLED",
    label: "Fulfilled",
    color: "green",
    icon: <TbTruckLoading size={14} />
  },
  CANCELLED: {
    value: "CANCELLED",
    label: "Cancelled",
    color: "red",
    icon: <TbX size={14} />
  },
  PARTIAL: {
    value: "PARTIAL",
    label: "Partial",
    color: "yellow",
    icon: <TbTruckDelivery size={14} />
  },
  PENDING: {
    value: "PENDING",
    label: "Pending",
    color: "blue",
    icon: <TbClock size={14} />
  }
};

export const FULFILLMENT_STATUSES_LIST = Object.values(FULFILLMENT_STATUSES);

export const fulfillmentStatusMatcher = (value) =>
  match(value)
    .with("UNFULFILLED", () => FULFILLMENT_STATUSES.UNFULFILLED)
    .with("FULFILLED", () => FULFILLMENT_STATUSES.FULFILLED)
    .with("CANCELLED", () => FULFILLMENT_STATUSES.CANCELLED)
    .with("PARTIAL", () => FULFILLMENT_STATUSES.PARTIAL)
    .with("PENDING", () => FULFILLMENT_STATUSES.PENDING)
    .otherwise(() => FULFILLMENT_STATUSES.UNFULFILLED);

export function FulfillmentStatusBadge({ value, customSx = {} }) {
  const normalizedStatus = value?.toUpperCase() || "UNFULFILLED";
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