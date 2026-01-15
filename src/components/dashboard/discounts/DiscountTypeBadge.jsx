"use client";
import React from "react";
import { StatusBadge } from "../../StatusBadge";

export function DiscountTypeBadge({ type }) {
  const badgeMap = {
    PERCENTAGE: {
      label: "Percentage",
      color: "blue",
    },
    FIXED: {
      label: "Fixed Amount",
      color: "green",
    },
    FREE_SHIPPING: {
      label: "Free Shipping",
      color: "yellow",
    },
    VOUCHER: {
      label: "Gift Card",
      color: "orange",
    },
  };

  const badge = badgeMap[type] || {
    label: type || "Unknown",
    color: "gray",
  };

  return <StatusBadge label={badge.label} color={badge.color} />;
}

