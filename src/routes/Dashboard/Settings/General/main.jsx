"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbSettings } from "react-icons/tb";

export default function GeneralSettings() {
	return (
		<>
			<DashboardHeader
				title="General Settings"
				icon={<TbSettings size={20} />}
			/>
		</>
	);
}

