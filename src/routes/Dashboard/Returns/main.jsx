"use client";
import React from "react";
import { TbArrowBack } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { ReturnsTable } from "../../../components/dashboard/returns/ReturnsTable";
import { PageContainer } from "../../../components/PageContainer";

export default function DashboardReturns() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Returns"
        icon={<TbArrowBack size={24} />}
      />
      <ReturnsTable tableHeight="100%" allowCheckboxSelection />
    </PageContainer>
  );
}

export const Returns = DashboardReturns;
