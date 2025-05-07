"use client";
import { Box, Divider, List } from "@mui/material";
import {
	TbHome,
	TbSpeakerphone,
	TbTicket,
	TbArchive,
	TbUsers,
	TbHeartSpark,
	TbChartBar,
	TbReportAnalytics,
	TbUser,
	TbLogout,
	TbShoe,
	TbBuildingStore,
	TbReplace,
	TbCash,
	TbFileDescription,
	TbMail,
	TbToolsKitchen2,
} from "react-icons/tb";
import { CommandBar } from "../components/CommandBar";
import { OnboardingButton } from "../components/OnboardingButton";
import { OrganizationSelector } from "../components/OrganizationSelector";
import { SidebarItem } from "../components/SidebarItem";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";

export const SIDEBAR_WIDTH = 250;
const ICON_SIZE = 18;

export function Sidebar() {
	const { user, signOut } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		await signOut();
		router.push("/login");
	};

	return (
		<Box
			component="nav"
			data-tour="sidebar"
			sx={{
				display: { xs: "none", sm: "flex" },
				flexDirection: "column",
				height: "100%",
				maxHeight: "100vh",
				width: SIDEBAR_WIDTH,
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					position: "fixed",
					width: SIDEBAR_WIDTH,
					height: "100%",
					overflowY: "auto",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						mx: 1.5,
						mt: 1.5,
					}}
				>
					<OrganizationSelector />
				</Box>
				<SidebarDivider />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						flex: 1,
					}}
				>
					<List
						sx={{
							pt: 0.5,
							pb: 0,
						}}
					>
						<Box
							component="li"
							sx={{
								px: 1.5,
								mb: 1.5,
							}}
						>
							<CommandBar />
						</Box>
						<SidebarItem
							href="/dashboard/home"
							title="Home"
							icon={<TbHome size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/orders"
							title="Orders"
							icon={<TbTicket size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/products"
							title="Products"
							icon={<TbShoe size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/customers"
							title="Customers"
							icon={<TbUsers size={ICON_SIZE} />}
							rightAdornment={
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: "xs",
										color: "primary.50",
										bgcolor: "primary.600",
										borderRadius: 999,
										height: 18,
										width: 18,
									}}
								>
									4
								</Box>
							}
						/>
						<SidebarDivider />
						<SidebarItem
							href="/dashboard/reports"
							title="Reports"
							icon={<TbReportAnalytics size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/analytics"
							title="Analytics"
							icon={<TbChartBar size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/marketing"
							title="Marketing"
							icon={<TbHeartSpark size={ICON_SIZE} />}
						/>
						<SidebarDivider />
						<SidebarItem
							href="/dashboard/stores"
							title="Stores"
							icon={<TbBuildingStore size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/inventory"
							title="Inventory"
							icon={<TbArchive size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/stock-movements"
							title="Stock Movements"
							icon={<TbReplace size={ICON_SIZE} />}
						/>
						<SidebarDivider />
						<SidebarItem
							href="/dashboard/payments"
							title="Payments"
							icon={<TbCash size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/documents"
							title="Documents"
							icon={<TbFileDescription size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/emails"
							title="Emails"
							icon={<TbMail size={ICON_SIZE} />}
						/>
					</List>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
						flex: 1,
						mb: 1.5,
					}}
				>
					<List
						sx={{
							pt: 0.5,
							pb: 0,
						}}
					>
						<SidebarDivider />
						<SidebarItem
							href="/dashboard/account"
							title="Profile"
							icon={<TbUser size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/changelog"
							title="Changelog"
							icon={<TbSpeakerphone />}
						/>
						<SidebarItem
							href="/dashboard/kit"
							title="Kit"
							icon={<TbToolsKitchen2 />}
						/>
						<SidebarDivider />
						<SidebarItem
							href="#"
							title="Logout"
							icon={<TbLogout size={ICON_SIZE} />}
							onClick={handleLogout}
							customColor="error.main"
							customHoverColor="error.main"
						/>
					</List>
					<Box
						sx={{
							px: 1.5,
							display: "flex",
							width: "100%",
						}}
					>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

function SidebarDivider() {
	return (
		<Box sx={{ py: 1.5 }}>
			<Divider />
		</Box>
	);
}
