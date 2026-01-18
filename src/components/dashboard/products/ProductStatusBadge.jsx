"use client";
import { NeviosBadge } from "../../nevios/NeviosBadge";

/**
 * Product Status Badge Component
 * Now uses the universal NeviosBadge with productStatus config
 */
export function ProductStatusBadge({ status, customSx = {} }) {
  return (
    <NeviosBadge 
      value={status} 
      configKey="productStatus"
      customSx={customSx}
    />
  );
}
