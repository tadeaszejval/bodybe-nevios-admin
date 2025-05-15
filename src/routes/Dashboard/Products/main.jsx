"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import { TbDownload, TbPackage } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { ProductsTable } from "../../../components/dashboard/products/ProductsTable";
import { PageContainer } from "../../../components/PageContainer";

export default function DashboardProducts() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Products"
        icon={<TbPackage size={24} />}
        actions={<Button variant="contained" color="primary" endIcon={<TbDownload />}>Export</Button>}
      />
      <Box sx={{ flex: 1 }}>
        <ProductsTable allowCheckboxSelection />
      </Box>
    </PageContainer>
  );
}

export const Products = DashboardProducts;
