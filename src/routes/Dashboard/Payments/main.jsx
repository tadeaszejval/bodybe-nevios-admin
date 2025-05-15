import React from "react";
import { Box } from "@mui/material";
import { TbCash } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardPayments() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Payments"
        icon={<TbCash size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Payments = DashboardPayments;
