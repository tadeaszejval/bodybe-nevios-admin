import React from "react";
import { PageContainer } from "../../../components/PageContainer";
import { TbCash } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PaymentsTable } from "../../../components/dashboard/payments/PaymentsTable";

export default function DashboardPayments() {
  return (
    <PageContainer>
      <DashboardHeader
        title="Payments"
        icon={<TbCash size={24} />}
      />
      <PaymentsTable />
    </PageContainer>
  );
}

export const Payments = DashboardPayments;
