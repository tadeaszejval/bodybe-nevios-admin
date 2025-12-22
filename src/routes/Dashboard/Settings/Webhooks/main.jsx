"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbWebhook } from "react-icons/tb";

export default function WebhooksSettings() {
	return (
		<>
			<DashboardHeader
				title="Webhooks"
				icon={<TbWebhook size={20} />}
			/>
		</>
	);
}

