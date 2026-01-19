"use client";
import { Box, Divider, List } from "@mui/material";
import { darken } from "@mui/material/styles";
import {
	TbHome,
	TbDiscountFilled,
	TbTicket,
	TbArchive,
	TbUsers,
	TbChartBar,
	TbReportAnalytics,
	TbLogout,
	TbShoe,
	TbBuildingStore,
	TbReplace,
	TbCash,
	TbFileDescription,
	TbMail,
	TbSettings,
	TbPackage,
	TbBuildingBank,
	TbPackages,
	TbProgressAlert,
	TbArrowBackUp,
} from "react-icons/tb";
import { useColorScheme } from "@mui/material";
import { SidebarItem } from "./SidebarItem";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/navigation";

export const SIDEBAR_WIDTH = 250;
const ICON_SIZE = 18;

export function Sidebar() {
	const { signOut } = useAuth();
	const router = useRouter();
	const { mode, setMode } = useColorScheme();

	const handleLogout = async () => {
		await signOut();
		router.push("/login");
	};

	const toggleColorMode = () => {
		setMode(mode === 'light' ? 'dark' : 'light');
	};

	return (
		<Box
			component="nav"
			sx={{
				display: { xs: "none", sm: "flex" },
				flexDirection: "column",
				height: "100%",
				width: SIDEBAR_WIDTH,
				backgroundColor: "background.defaultDark",
				boxShadow: (theme) => `1px 1px 5px 0px ${darken(theme.palette.background.defaultDark, 0.2)} inset`,
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					overflowY: "auto",
					scrollbarWidth: "thin",
					scrollbarColor: "rgba(0,0,0,0.2) transparent",
					paddingTop: "10px",

				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						minHeight: "100%",
					}}
				>
					<List
						sx={{
							pt: 0.5,
							pb: 0,
							flex: 1,
						}}
					>
						{/* Overview */}
						<SidebarItem
							href="/dashboard/home"
							title="Home"
							icon={<TbHome size={ICON_SIZE} />}
						/>


						<SidebarItem
							href="/dashboard/orders"
							title="Orders"
							icon={<TbTicket size={ICON_SIZE} />}
							rightAdornment={
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: "xs",
										fontWeight: "600",
										color: "gray.600",
										bgcolor: "background.defaultDarker",
										borderRadius: "8px",
										padding: "1px 5px",
									}}
								>
									0
								</Box>
							}
						/>
						<SidebarItem
							href="/dashboard/customers"
							title="Customers"
							icon={<TbUsers size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/discounts"
							title="Discounts"
							icon={<TbDiscountFilled size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/analytics"
							title="Analytics"
							icon={<TbChartBar size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/returns"
							deemphasized={true}
							title="Returns"
							icon={<TbArrowBackUp size={ICON_SIZE} />}
						/>
						{/*<SidebarItem
							deemphasized={true}
							href="/dashboard/reports"
							title="Reports"
							icon={<TbReportAnalytics size={ICON_SIZE} />}
						/>
						*/}

						<SidebarDivider />

						{/* Products & Inventory */}
						<SidebarItem
							href="/dashboard/products"
							title="Products"
							icon={<TbShoe size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/fulfillments"
							title="Fulfillments"
							icon={<TbPackage size={ICON_SIZE} />}
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
						<SidebarItem
							href="/dashboard/inventory-operations"
							title="Inventory Operations"
							icon={<TbPackages size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/backorders"
							title="Backorders"
							icon={<TbProgressAlert size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/stores"
							title="Stores"
							deemphasized={true}
							icon={<TbBuildingStore size={ICON_SIZE} />}
						/>

						<SidebarDivider />

						{/* Finance & Admin */}
						<SidebarItem
							href="/dashboard/payments"
							title="Payments"
							icon={<TbCash size={ICON_SIZE} />}
						/>
						<SidebarItem
							href="/dashboard/bank-accounts"
							title="Bank"
							icon={<TbBuildingBank size={ICON_SIZE} />}
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

					{/* Bottom section with profile, logout, etc. */}
					<Box
						sx={{
							mt: "auto", // Push to bottom
							pb: 1.5,
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
								href="/dashboard/settings/general"
								title="Settings"
								deemphasized={true}
								icon={<TbSettings size={ICON_SIZE} />}
							/>
							<SidebarItem
								title="Logout"
								icon={<TbLogout size={ICON_SIZE} />}
								onClick={handleLogout}
							/>
						</List>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

function SidebarDivider() {
	return (
		<Box sx={{ py: 1.5 }}>
			<Divider sx={{ border: "0.3px solid rgb(224, 224, 224)" }} />
		</Box>
	);
}
