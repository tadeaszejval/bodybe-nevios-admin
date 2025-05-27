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
          </Box>
        }
      />
        <EmailTable tableHeight="100%" allowCheckboxSelection />
    </PageContainer>
  );
}

export const Emails = DashboardEmails;
