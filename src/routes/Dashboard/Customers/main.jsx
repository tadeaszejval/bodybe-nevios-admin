"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { TbUsers } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { Paper } from "@mui/material";
import { CustomersTable } from "../../../components/dashboard/customers/CustomersTable";
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
            <Button 
              size="small" 
              variant="contained" 
              color="primary"
              onClick={handleNewCustomer}
            >
              Add Customer
            </Button>
          </Box>
        }
      />
        <CustomersTable tableHeight="100%" allowCheckboxSelection />
    </PageContainer>
  );
}

export const Customers = DashboardCustomers;
