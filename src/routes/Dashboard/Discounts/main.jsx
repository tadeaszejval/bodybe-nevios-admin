"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import { TbTicket } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { useRouter } from "next/navigation";
import { DiscountsTable } from "../../../components/dashboard/discounts/DiscountsTable";
import { NeviosPrimaryButton } from "../../../components/nevios/NeviosButtons";

export default function DashboardDiscounts() {
  const router = useRouter();

  const handleNewDiscount = () => {
    router.push("/dashboard/discounts/create");
  };

  return (
    <PageContainer>
      <DashboardHeader
        title="Discount Codes"
        icon={<TbTicket size={24} />}
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DiscountsTable tableHeight="100%" />
      </Paper>
    </PageContainer>
  );
}

export const Discounts = DashboardDiscounts;

