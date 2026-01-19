"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import { TbPackageImport } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { InventoryOperationsTable } from "../../../components/dashboard/inventory-operations/InventoryOperationsTable";

export default function DashboardInventoryOperations() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Inventory Operations"
        icon={<TbPackageImport size={24} />}
        actions={
          <Box display="flex" gap={1}>
          </Box>
        }
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <InventoryOperationsTable tableHeight="100%" />
      </Paper>
    </PageContainer>
  );
}

export const InventoryOperations = DashboardInventoryOperations;
