"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbTruck } from "react-icons/tb";

export default function ShippingSettings() {
	return (
		<>
			<DashboardHeader
				title="Shipping"
				icon={<TbTruck size={20} />}
			/>
		</>
	);
}

