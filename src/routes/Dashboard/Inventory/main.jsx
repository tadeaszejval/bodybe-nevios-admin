"use client";
import React from "react";
import { Paper } from "@mui/material";
import { TbArchive } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { InventoryTable } from "../../../components/dashboard/inventory/InventoryTable";

export default function DashboardInventory() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Inventory"
        icon={<TbArchive size={24} />}
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <InventoryTable tableHeight="100%" />
      </Paper>
    </PageContainer>
  );
}

export const Inventory = DashboardInventory;
