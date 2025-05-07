import React from "react";
import { Box, Typography } from "@mui/material";

export default function DashboardProducts() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Products
      </Typography>
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Products = DashboardProducts;
