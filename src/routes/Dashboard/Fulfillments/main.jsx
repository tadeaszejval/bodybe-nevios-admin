"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import { TbPackage } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { FulfillmentTable } from "../../../components/dashboard/fulfillments/FulfillmentTable";

export default function DashboardFulfillments() {

  return (
    <PageContainer>
      <DashboardHeader
        title="Fulfillments"
        icon={<TbPackage size={24} />}
        actions={
          <Box display="flex" gap={1}>
          </Box>
        }
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <FulfillmentTable tableHeight="100%" />
      </Paper>
    </PageContainer>
  );
}

export const Fulfillments = DashboardFulfillments;