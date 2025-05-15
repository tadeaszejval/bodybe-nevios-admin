import React from "react";
import { Box } from "@mui/material";
import { TbMail } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardEmails() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Emails"
        icon={<TbMail size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Emails = DashboardEmails;
