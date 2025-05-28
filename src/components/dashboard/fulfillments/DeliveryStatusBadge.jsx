"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbClock, TbTruck, TbTruckDelivery, TbCheck, TbX, TbArrowBack } from "react-icons/tb";

const DELIVERY_STATUSES = {
  PENDING: {
    value: "PENDING",
    label: "Pending",
    color: "gray",
    icon: <TbClock size={14} />
  },
  IN_TRANSIT: {
    value: "IN_TRANSIT",
    label: "In Transit",
    color: "blue",
    icon: <TbTruck size={14} />
  },
  OUT_FOR_DELIVERY: {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    color: "yellow",
    icon: <TbTruckDelivery size={14} />
  },
  DELIVERED: {
    value: "DELIVERED",
    label: "Delivered",
    color: "green",
    icon: <TbCheck size={14} />
  },
  FAILED: {
    value: "FAILED",
    label: "Failed",
    color: "red",
    icon: <TbX size={14} />
  },
  RETURNED: {
    value: "RETURNED",
    label: "Returned",
    color: "orange",
    icon: <TbArrowBack size={14} />
  }
};

export const DELIVERY_STATUSES_LIST = Object.values(DELIVERY_STATUSES);

export const deliveryStatusMatcher = (value) =>
  match(value)
    .with("PENDING", () => DELIVERY_STATUSES.PENDING)
    .with("IN_TRANSIT", () => DELIVERY_STATUSES.IN_TRANSIT)
    .with("OUT_FOR_DELIVERY", () => DELIVERY_STATUSES.OUT_FOR_DELIVERY)
    .with("DELIVERED", () => DELIVERY_STATUSES.DELIVERED)
    .with("FAILED", () => DELIVERY_STATUSES.FAILED)
    .with("RETURNED", () => DELIVERY_STATUSES.RETURNED)
    .otherwise(() => DELIVERY_STATUSES.PENDING);

export function DeliveryStatusBadge({ value, customSx = {} }) {
  const normalizedStatus = value?.toUpperCase() || "PENDING";
  const statusMeta = deliveryStatusMatcher(normalizedStatus);
  
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