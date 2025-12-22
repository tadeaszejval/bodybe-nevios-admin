"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbCreditCard } from "react-icons/tb";

export default function BillingSettings() {
	return (
		<>
			<DashboardHeader
				title="Billing"
				icon={<TbCreditCard size={20} />}
			/>
		</>
	);
}

