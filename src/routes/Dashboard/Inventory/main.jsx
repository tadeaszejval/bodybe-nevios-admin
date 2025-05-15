import React from "react";
import { Box } from "@mui/material";
import { TbArchive } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardInventory() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Inventory"
        icon={<TbArchive size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Inventory = DashboardInventory;
