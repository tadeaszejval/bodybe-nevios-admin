import React from "react";
import { Box, Typography } from "@mui/material";

export default function DashboardReports() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Reports
      </Typography>
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Reports = DashboardReports;
