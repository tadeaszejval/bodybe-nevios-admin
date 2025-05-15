import React from "react";
import { Box } from "@mui/material";
import { TbChartBar } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardAnalytics() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Analytics"
        icon={<TbChartBar size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Analytics = DashboardAnalytics;
