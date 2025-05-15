"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbMail, TbMailOff } from "react-icons/tb";

const SUBSCRIPTION_STATUSES = {
  SUBSCRIBED: {
    value: true,
    label: "Subscribed",
    color: "green",
    icon: <TbMail size={14} />
  },
  UNSUBSCRIBED: {
    value: false,
    label: "Unsubscribed",
    color: "gray",
    icon: <TbMailOff size={14} />
  },
  UNKNOWN: {
    value: null,
    label: "Unknown",
    color: "gray",
    icon: <TbMailOff size={14} />
  }
};

export const SUBSCRIPTION_STATUSES_LIST = Object.values(SUBSCRIPTION_STATUSES);

export const subscriptionStatusMatcher = (value) =>
  match(value)
    .with(true, () => SUBSCRIPTION_STATUSES.SUBSCRIBED)
    .with(false, () => SUBSCRIPTION_STATUSES.UNSUBSCRIBED)
    .otherwise(() => SUBSCRIPTION_STATUSES.UNKNOWN); // Default fallback for null/undefined

export function SubscribedBadge({ status, customSx = {} }) {
  const statusMeta = subscriptionStatusMatcher(status);
  
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