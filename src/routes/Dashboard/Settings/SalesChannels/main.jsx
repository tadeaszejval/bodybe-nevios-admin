"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbBuildingStore } from "react-icons/tb";

export default function SalesChannelsSettings() {
	return (
		<>
			<DashboardHeader
				title="Sales Channels"
				icon={<TbBuildingStore size={20} />}
			/>
		</>
	);
}

