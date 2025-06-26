"use client";
import React from "react";
import { Box, Paper } from "@mui/material";
import { TbFileInvoice, TbRefresh } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { DocumentsTable } from "../../../components/dashboard/documents/DocumentsTable";

export default function DashboardDocuments() {

  return (
    <PageContainer>
      <DashboardHeader
        title="Documents"
        icon={<TbFileInvoice size={24} />}
        actions={
          <Box display="flex" gap={1}>
          </Box>
        }
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DocumentsTable tableHeight="100%" />
      </Paper>
    </PageContainer>
  );
}

export const Documents = DashboardDocuments;
