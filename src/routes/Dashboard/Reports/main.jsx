import React from "react";
import { Box } from "@mui/material";
import { TbReportAnalytics } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardReports() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Reports"
        icon={<TbReportAnalytics size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Reports = DashboardReports;
