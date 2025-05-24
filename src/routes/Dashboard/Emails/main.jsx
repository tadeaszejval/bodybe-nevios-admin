"use client";
import React from "react";
import { Box, Button, Paper } from "@mui/material";
import { TbMail, TbRefresh } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { EmailTable } from "../../../components/dashboard/emails/EmailTable";

export default function DashboardEmails() {

  return (
    <PageContainer>
      <DashboardHeader
        title="Emails"
        icon={<TbMail size={24} />}
        actions={
          <Box display="flex" gap={1}>
            <Button size="small" variant="contained" color="shadow" startIcon={<TbRefresh />}>
              Refresh
            </Button>
            <Button size="small" variant="contained">
              Send email to customer
            </Button>
          </Box>
        }
      />
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <EmailTable tableHeight="100%" allowCheckboxSelection />
      </Paper>
    </PageContainer>
  );
}

export const Emails = DashboardEmails;
