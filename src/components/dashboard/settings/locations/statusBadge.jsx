"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbCheck, TbX } from "react-icons/tb";

const LOCATION_STATUSES = {
  ACTIVE: {
    value: true,
    label: "Active",
    color: "green",
    icon: <TbCheck size={14} />
  },
  INACTIVE: {
    value: false,
    label: "Inactive",
    color: "gray",
    icon: <TbX size={14} />
  },
};

export const LOCATION_STATUSES_LIST = Object.values(LOCATION_STATUSES);

export const locationStatusMatcher = (value) =>
  match(value)
    .with(true, () => LOCATION_STATUSES.ACTIVE)
    .with(false, () => LOCATION_STATUSES.INACTIVE)
    .otherwise(() => LOCATION_STATUSES.INACTIVE); // Default fallback

export function LocationStatusBadge({ status, customSx = {} }) {
  const statusMeta = locationStatusMatcher(status);
  
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