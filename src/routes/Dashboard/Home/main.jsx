import React from "react";
import { Box } from "@mui/material";
import { TbHome } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";

export default function DashboardHome() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Home"
        icon={<TbHome size={24} />}
      />
      {/* Add your dashboard widgets and content here */}
    </Box>
  );
}

export const Home = DashboardHome;

