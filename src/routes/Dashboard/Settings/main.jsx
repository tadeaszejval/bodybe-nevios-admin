"use client";
import React from "react";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { TbSettings } from "react-icons/tb";

export default function DashboardSettings() {
	return (
		<>
			<DashboardHeader
				title="Settings"
				icon={<TbSettings size={20} />}
			/>
		</>
	);
}

export const Settings = DashboardSettings;
