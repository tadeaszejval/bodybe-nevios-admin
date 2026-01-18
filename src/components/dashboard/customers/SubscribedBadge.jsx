"use client";
import { NeviosBadge } from "../../nevios/NeviosBadge";

/**
 * Subscribed Badge Component
 * Now uses the universal NeviosBadge with subscribed config
 */
export function SubscribedBadge({ value, customSx = {} }) {
  return (
    <NeviosBadge 
      value={value} 
      configKey="subscribed"
      customSx={customSx}
    />
  );
}
