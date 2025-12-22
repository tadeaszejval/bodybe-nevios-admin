"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbApi } from "react-icons/tb";

export default function IntegrationsSettings() {
	return (
		<>
			<DashboardHeader
				title="Integrations"
				icon={<TbApi size={20} />}
			/>
		</>
	);
}

