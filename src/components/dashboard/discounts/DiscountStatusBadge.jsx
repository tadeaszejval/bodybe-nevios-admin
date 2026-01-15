"use client";
import React from "react";
import { StatusBadge } from "../../StatusBadge";

export function DiscountStatusBadge({ status }) {
  const badgeMap = {
    ACTIVE: {
      label: "Active",
      color: "green",
    },
    RESERVED: {
      label: "Reserved",
      color: "yellow",
    },
    USED: {
      label: "Used",
      color: "red",
    },
  };

  const badge = badgeMap[status] || {
    label: status || "Unknown",
    color: "gray",
  };

  return <StatusBadge label={badge.label} color={badge.color} />;
}

