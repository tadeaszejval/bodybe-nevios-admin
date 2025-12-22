"use client";
import React from "react";
import { DashboardHeader } from "../../../../components/DashboardHeader";
import { TbUsers } from "react-icons/tb";

export default function UsersSettings() {
	return (
		<>
			<DashboardHeader
				title="Users"
				icon={<TbUsers size={20} />}
			/>
		</>
	);
}

