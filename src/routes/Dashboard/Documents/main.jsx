import React from "react";
import { Box } from "@mui/material";
import { TbFileDescription } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardDocuments() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Documents"
        icon={<TbFileDescription size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Documents = DashboardDocuments;
