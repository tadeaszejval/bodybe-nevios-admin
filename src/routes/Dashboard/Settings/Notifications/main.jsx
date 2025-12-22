"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbBell } from "react-icons/tb";

export default function NotificationsSettings() {
	return (
		<>
			<DashboardHeader
				title="Notifications"
				icon={<TbBell size={20} />}
			/>
		</>
	);
}

