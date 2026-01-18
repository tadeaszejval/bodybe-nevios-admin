"use client";
import { NeviosBadge } from "../../nevios/NeviosBadge";

/**
 * Gender Badge Component
 * Now uses the universal NeviosBadge with gender config
 */
export function GenderBadge({ value, customSx = {} }) {
  return (
    <NeviosBadge 
      value={value} 
      configKey="gender"
      customSx={customSx}
    />
  );
}
