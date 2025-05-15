"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import { TbDownload, TbTicket } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { OrdersTable } from "../../../components/dashboard/orders/OrdersTable";
import { PageContainer } from "../../../components/PageContainer";

export default function DashboardOrders() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Orders"
        icon={<TbTicket size={24} />}
        actions={<Button variant="contained" color="primary" endIcon={<TbDownload />}>Export</Button>}
      />
      <Box sx={{ flex: 1 }}>
        <OrdersTable allowCheckboxSelection />
      </Box>
    </PageContainer>
  );
}

export const Orders = DashboardOrders;
