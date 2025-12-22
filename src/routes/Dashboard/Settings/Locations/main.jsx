"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbMap } from "react-icons/tb";

export default function LocationsSettings() {
	return (
		<>
			<DashboardHeader
				title="Locations"
				icon={<TbMap size={20} />}
			/>
		</>
	);
}

