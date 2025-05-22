"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";
import { TbArrowLoopRight, TbClock, TbMailForward, TbMailCheck, TbMailOpened, TbMailPlus, TbMailX, TbMailCog } from "react-icons/tb";

const EMAIL_STATUSES = {
  PROCESSING: {
    value: "PROCESSING",
    label: "Processing",
    color: "gray",
    icon: <TbArrowLoopRight size={14} />
  },
  SCHEDULED: {
    value: "SCHEDULED",
    label: "Scheduled",
    color: "gray",
    icon: <TbClock size={14} />
  },
  SENT: {
    value: "SENT",
    label: "Sent",
    color: "blue",
    icon: <TbMailForward size={14} />
  },
  DELIVERED: {
    value: "DELIVERED",
    label: "Delivered",
    color: "blue",
    icon: <TbMailCheck size={14} />
  },
  DELIVERY_DELAYED: {
    value: "DELIVERY_DELAYED",
    label: "Delivery Delayed",
    color: "orange",
    icon: <TbClock size={14} />
  },
  COMPLAINED: {
    value: "COMPLAINED",
    label: "Complained",
    color: "red",
    icon: <TbMailCog size={14} />
  },
  BOUNCED: {
    value: "BOUNCED",
    label: "Bounced",
    color: "red",
    icon: <TbMailX size={14} />
  },
  OPENED: {
    value: "OPENED",
    label: "Opened",
    color: "green",
    icon: <TbMailOpened size={14} />
  },
  CLICKED: {
    value: "CLICKED",
    label: "Clicked",
    color: "green",
    icon: <TbMailPlus size={14} />
  },
};

export const EMAIL_STATUSES_LIST = Object.values(EMAIL_STATUSES);

export const emailStatusMatcher = (value) =>
  match(value)
    .with("PROCESSING", () => EMAIL_STATUSES.PROCESSING)
    .with("SCHEDULED", () => EMAIL_STATUSES.SCHEDULED)
    .with("SENT", () => EMAIL_STATUSES.SENT)
    .with("DELIVERED", () => EMAIL_STATUSES.DELIVERED)
    .with("DELIVERY_DELAYED", () => EMAIL_STATUSES.DELIVERY_DELAYED)
    .with("COMPLAINED", () => EMAIL_STATUSES.COMPLAINED)
    .with("BOUNCED", () => EMAIL_STATUSES.BOUNCED)
    .with("OPENED", () => EMAIL_STATUSES.OPENED)
    .with("CLICKED", () => EMAIL_STATUSES.CLICKED)
    .otherwise(() => EMAIL_STATUSES.FAILED); // Default fallback

export function EmailStatusBadge({ status, customSx = {} }) {
  // Handle case sensitivity by converting to uppercase
  const normalizedStatus = status?.toUpperCase() || "NOT_FOUND";
  const statusMeta = emailStatusMatcher(normalizedStatus);
  
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