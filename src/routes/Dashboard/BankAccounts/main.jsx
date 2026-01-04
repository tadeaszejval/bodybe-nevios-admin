"use client";
import React from "react";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { TbBuildingBank } from "react-icons/tb";
import { BankAccountsTable } from "../../../components/dashboard/bank-accounts/BankAccountsTable";

export default function DashboardBankAccounts() {
	return (
		<PageContainer>
			<DashboardHeader
				title="Bank"
				icon={<TbBuildingBank size={20} />}
			/>
			<BankAccountsTable />
		</PageContainer>
	);
}

export const BankAccounts = DashboardBankAccounts;

