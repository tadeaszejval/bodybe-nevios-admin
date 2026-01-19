"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import { TbClockPause } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { BackordersTable } from "../../../components/dashboard/backorders/BackordersTable";

export default function DashboardBackorders() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Backorders"
        icon={<TbClockPause size={24} />}
        actions={
          <Box display="flex" gap={1}>
          </Box>
        }
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <BackordersTable tableHeight="100%" />
      </Paper>
    </PageContainer>
  );
}

export const Backorders = DashboardBackorders;
