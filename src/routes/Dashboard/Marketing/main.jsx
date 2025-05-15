import React from "react";
import { Box } from "@mui/material";
import { TbHeartSpark } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardMarketing() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Marketing"
        icon={<TbHeartSpark size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Marketing = DashboardMarketing;
