import React from "react";
import { Box } from "@mui/material";
import { TbBuildingStore } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
  
export default function DashboardStores() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Stores"
        icon={<TbBuildingStore size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Stores = DashboardStores;
