"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { TbUsers } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { CustomersTable } from "../../../components/dashboard/customers/CustomersTable";
import { NeviosPrimaryButton } from "../../../components/nevios/NeviosButtons";

export default function DashboardCustomers() {
  const router = useRouter();

  const handleNewCustomer = () => {
    router.push("/dashboard/customers/create");
  };

  return (
    <PageContainer>
      <DashboardHeader
        title="Customers"
        icon={<TbUsers size={24} />}
        actions={
          <Box display="flex" gap={1}>
            <NeviosPrimaryButton 
              size="medium" 
              onClick={handleNewCustomer}
            >
              Add Customer
            </NeviosPrimaryButton>
          </Box>
        }
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CustomersTable tableHeight="100%" />
      </Paper>
    </PageContainer>
  );
}

export const Customers = DashboardCustomers;
