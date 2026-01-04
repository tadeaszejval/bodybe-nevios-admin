"use client";
import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { PageContainer } from "../../../../components/PageContainer";
import { NeviosFormPaper } from "../../../../components/nevios/NeviosFormPaper";
import { TbTruck, TbPencil } from "react-icons/tb";
import { ShippingMethodConfigurator } from "../../../../components/dashboard/nevios/ShippingMethodConfigurator";
import { DashboardHeader } from "../../../../components/DashboardHeader";

export default function DashboardShipping() {
	const [fulfillmentLocation, setFulfillmentLocation] = useState(null);

	const handleAddZone = () => {
		console.log("Add shipping zone clicked");
		// TODO: Open create zone dialog
	};

	const handleEditZone = (zone) => {
		console.log("Edit zone:", zone);
		// TODO: Open edit zone dialog
	};

	const handleAddRate = (zone) => {
		console.log("Add rate for zone:", zone);
		// TODO: Open add rate dialog
	};

	const handleEditRate = (set, zone) => {
		console.log("Edit rate:", set, "for zone:", zone);
		// TODO: Open edit rate dialog
	};

	return (
		<>
			<DashboardHeader
				title="Shipping and delivery"
				icon={<TbTruck size={24} />}
			/>

				{/* Shipping Method Configurator */}
				<ShippingMethodConfigurator
					fulfillmentLocation={fulfillmentLocation}
					onAddZone={handleAddZone}
					onEditZone={handleEditZone}
					onAddRate={handleAddRate}
					onEditRate={handleEditRate}
				/>
		</>
	);
}

export const Shipping = DashboardShipping;
