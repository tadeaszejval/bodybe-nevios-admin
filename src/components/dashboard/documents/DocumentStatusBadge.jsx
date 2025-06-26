"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { ColorDot } from "../../../components/ColorDot";

const DOCUMENT_STATUSES = {
  DRAFT: {
    value: "DRAFT",
    label: "Draft",
    color: "gray", // Draft/inactive color
  },
  ISSUED: {
    value: "ISSUED",
    label: "Issued",
    color: "blue", // Active/issued color
  },
  PAID: {
    value: "PAID",
    label: "Paid",
    color: "green", // Success color
  },
  COMPLETED: {
    value: "COMPLETED",
    label: "Completed",
    color: "green", // Success color
  },
  CANCELLED: {
    value: "CANCELLED",
    label: "Cancelled",
    color: "red", // Error/cancelled color
  },
};

export const DOCUMENT_STATUSES_LIST = Object.values(DOCUMENT_STATUSES);

export const documentStatusMatcher = (value) =>
  match(value)
    .with("DRAFT", () => DOCUMENT_STATUSES.DRAFT)
    .with("ISSUED", () => DOCUMENT_STATUSES.ISSUED)
    .with("PAID", () => DOCUMENT_STATUSES.PAID)
    .with("COMPLETED", () => DOCUMENT_STATUSES.COMPLETED)
    .with("CANCELLED", () => DOCUMENT_STATUSES.CANCELLED)
    .otherwise(() => DOCUMENT_STATUSES.DRAFT); // Default fallback

export function DocumentStatusBadge({ status, customSx = {} }) {
  // Handle case sensitivity by converting to uppercase
  const normalizedStatus = status?.toUpperCase() || "DRAFT";
  const statusMeta = documentStatusMatcher(normalizedStatus);
  
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