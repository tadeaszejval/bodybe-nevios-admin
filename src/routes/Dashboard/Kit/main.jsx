"use client";
import React from "react";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { Box, Typography } from "@mui/material";
import { PageContainer } from "../../../components/PageContainer";

export default function KitPage() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Kit"
      />
      <Box sx={{display: "flex", flexDirection: "column"}}>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
        <Typography variant="h7">Heading 7</Typography>
        <Typography variant="caption1">Caption 1</Typography>
        <Typography variant="caption2">Caption 2</Typography>
        <Typography variant="caption3">Caption 3</Typography>
        <Typography variant="caption4">Caption 4</Typography>
        <Typography variant="caption5">Caption 5</Typography>
        <Typography variant="caption6">Caption 6</Typography>
        <Typography variant="caption7">Caption 7</Typography>
      </Box>
    </PageContainer>
  );
}

export const Kit = KitPage;