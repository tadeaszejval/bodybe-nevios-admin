import React from "react";
import { Box, Typography } from "@mui/material";

export default function DashboardMarketing() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Marketing
      </Typography>
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Marketing = DashboardMarketing;
