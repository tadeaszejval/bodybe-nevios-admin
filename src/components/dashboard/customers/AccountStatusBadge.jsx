"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbCheck, TbX } from "react-icons/tb";

const ACCOUNT_STATUSES = {
  ENABLED: {
    value: true,
    label: "Registered",
    color: "green",
    icon: <TbCheck size={14} />
  },
  DISABLED: {
    value: false,
    label: "Not Registered",
    color: "grey",
    icon: <TbX size={14} />
  },
  UNKNOWN: {
    value: null,
    label: "Unknown",
    color: "red",
    icon: <TbX size={14} />
  }
};

export const ACCOUNT_STATUSES_LIST = Object.values(ACCOUNT_STATUSES);

export const accountStatusMatcher = (value) =>
  match(value)
    .with(true, () => ACCOUNT_STATUSES.ENABLED)
    .with(false, () => ACCOUNT_STATUSES.DISABLED)
    .otherwise(() => ACCOUNT_STATUSES.UNKNOWN); // Default fallback for null/undefined

export function AccountStatusBadge({ value, customSx = {} }) {
  const statusMeta = accountStatusMatcher(value);
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
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