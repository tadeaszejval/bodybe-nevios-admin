"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbCheck, TbEdit, TbArchive } from "react-icons/tb";

const PRODUCT_STATUSES = {
  ACTIVE: {
    value: "ACTIVE",
    label: "Active",
    color: "green",
    icon: <TbCheck size={14} />
  },
  DRAFT: {
    value: "DRAFT",
    label: "Draft",
    color: "gray",
    icon: <TbEdit size={14} />
  },
  ARCHIVED: {
    value: "ARCHIVED",
    label: "Archived",
    color: "gray",
    icon: <TbArchive size={14} />
  },
  UNKNOWN: {
    value: null,
    label: "Unknown",
    color: "gray",
    icon: <TbEdit size={14} />
  }
};

export const PRODUCT_STATUSES_LIST = Object.values(PRODUCT_STATUSES);

export const productStatusMatcher = (value) =>
  match(value?.toUpperCase?.())
    .with("ACTIVE", () => PRODUCT_STATUSES.ACTIVE)
    .with("DRAFT", () => PRODUCT_STATUSES.DRAFT)
    .with("ARCHIVED", () => PRODUCT_STATUSES.ARCHIVED)
    .otherwise(() => PRODUCT_STATUSES.UNKNOWN); // Default fallback for null/undefined/other values

export function ProductStatusBadge({ status, customSx = {} }) {
  const statusMeta = productStatusMatcher(status);
  
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