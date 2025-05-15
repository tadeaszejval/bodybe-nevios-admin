"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { ColorDot } from "../../../components/ColorDot";

const PAYMENT_STATUSES = {
  UNPAID: {
    value: "UNPAID",
    label: "Unpaid",
    color: "red", // Warning/alert color
  },
  PARTIALLY_PAID: {
    value: "PARTIALLY_PAID",
    label: "Partially Paid",
    color: "yellow", // In-progress color
  },
  PAID: {
    value: "PAID",
    label: "Paid",
    color: "green", // Success color
  },
};

export const PAYMENT_STATUSES_LIST = Object.values(PAYMENT_STATUSES);

export const paymentStatusMatcher = (value) =>
  match(value)
    .with("UNPAID", () => PAYMENT_STATUSES.UNPAID)
    .with("PARTIALLY_PAID", () => PAYMENT_STATUSES.PARTIALLY_PAID)
    .with("PAID", () => PAYMENT_STATUSES.PAID)
    .otherwise(() => PAYMENT_STATUSES.UNPAID); // Default fallback

export function PaymentStatusBadge({ status, customSx = {} }) {
  // Handle case sensitivity by converting to uppercase
  const normalizedStatus = status?.toUpperCase() || "UNPAID";
  const statusMeta = paymentStatusMatcher(normalizedStatus);
  
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
