"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbFileBroken, TbFileDescription } from "react-icons/tb";

const DOCUMENT_TYPES = {
  INVOICE: {
    value: "INVOICE",
    label: "Invoice",
    color: "blue", // Primary document type
    icon: <TbFileDescription />
  },
  DEPOSIT_INVOICE: {
    value: "DEPOSIT_INVOICE",
    label: "Deposit Invoice",
    color: "orange", // Special document type
    icon: <TbFileBroken />
  },
};

export const DOCUMENT_TYPES_LIST = Object.values(DOCUMENT_TYPES);

export const documentTypeMatcher = (value) =>
  match(value)
    .with("INVOICE", () => DOCUMENT_TYPES.INVOICE)
    .with("DEPOSIT_INVOICE", () => DOCUMENT_TYPES.DEPOSIT_INVOICE)
    .otherwise(() => DOCUMENT_TYPES.INVOICE); // Default fallback

export function DocumentTypeBadge({ type, customSx = {} }) {
  // Handle case sensitivity by converting to uppercase
  const normalizedType = type?.toUpperCase() || "INVOICE";
  const typeMeta = documentTypeMatcher(normalizedType);
  
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