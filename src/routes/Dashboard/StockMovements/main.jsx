import React from "react";
import { Box } from "@mui/material";
import { TbReplace } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardStockMovements() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Stock Movements"
        icon={<TbReplace size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const StockMovements = DashboardStockMovements;
