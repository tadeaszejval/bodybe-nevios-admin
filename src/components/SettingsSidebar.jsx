"use client";
import React from "react";
import { Box } from "@mui/material";
import { NeviosFormPaper } from "./nevios/NeviosFormPaper";
import { SidebarItem } from "./SidebarItem";
import { TbSettings, TbUsers, TbCreditCard, TbTruck, TbBell, TbApi, TbBuildingStore, TbMap, TbWebhook } from "react-icons/tb";

const ICON_SIZE = 18;

export function SettingsSidebar() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				position: "sticky",
				top: 80,
				alignSelf: "flex-start",
			}}
		>
			<NeviosFormPaper removeSidePadding={true} gap={1}>
                <SidebarItem
                    href="/dashboard/settings/general"
                    title="General"
                    icon={<TbSettings size={ICON_SIZE} />}
                />
                <SidebarItem
                    deemphasized={true}
                    href="/dashboard/settings/billing"
                    title="Billing"
                    icon={<TbCreditCard size={ICON_SIZE} />}
                />
                <SidebarItem
                    deemphasized={true}
                    href="/dashboard/settings/users"
                    title="Users"
                    icon={<TbUsers size={ICON_SIZE} />}
                />
                <SidebarItem
                    href="/dashboard/settings/sales_channels"
                    title="Sales Channels"
                    icon={<TbBuildingStore size={ICON_SIZE} />}
                />
                <SidebarItem
                    href="/dashboard/settings/locations"
                    title="Locations"
                    icon={<TbMap size={ICON_SIZE} />}
                />
                <SidebarItem
                    href="/dashboard/settings/shipping"
                    title="Shipping"
                    icon={<TbTruck size={ICON_SIZE} />}
                />
                <SidebarItem

                    href="/dashboard/settings/payments"
                    title="Payments"
                    icon={<TbCreditCard size={ICON_SIZE} />}
                />
                <SidebarItem
                    deemphasized={true}
                    href="/dashboard/settings/notifications"
                    title="Notifications"
                    icon={<TbBell size={ICON_SIZE} />}
                />
                <SidebarItem
                    deemphasized={true}
                    href="/dashboard/settings/integrations"
                    title="Integrations"
                    icon={<TbApi size={ICON_SIZE} />}
                />
                <SidebarItem
                    deemphasized={true}
                    href="/dashboard/settings/webhooks"
                    title="Webhooks"
                    icon={<TbWebhook size={ICON_SIZE} />}
                />
			</NeviosFormPaper>
		</Box>
	);
}

