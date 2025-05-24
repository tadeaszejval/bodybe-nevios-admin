"use client";
import { Box, Paper } from "@mui/material";
import { HelpMenu } from "../components/HelpMenu";
import { MobileNav } from "../components/MobileNav";
import { Sidebar, SIDEBAR_WIDTH } from "../components/Sidebar";
import { useRegisterTours } from "../context/TourProvider";
import { NavigationBackButton } from "./NavigationBackButton";
import { OrganizationSelector } from "./OrganizationSelector";
import { CommandBar } from "./CommandBar";
export function DashboardLayout({ children }) {
	useRegisterTours();
	return (
		<Box sx={{
			display: "flex",
			flexDirection: "column",
			height: "100vh",
			overflow: "hidden",
			backgroundColor: "rgba(26, 26, 26)",
		}}>
			{/* Helper bar at the top */}
			<Box 
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					height: "60px",
					width: "100%",
					position: "fixed",
					backgroundColor: "rgba(26, 26, 26)",
					top: 0,
					left: 0,
					gap: 2,
					flexShrink: 0, // Prevent shrinking
					px: 2,
				}}
			>
				<Box sx={{ width: "33%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
					<Box sx={{maxWidth: "250px"	}}>
					</Box>
				</Box>
				<Box sx={{ width: "33%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
					<Box>
						<NavigationBackButton />
					</Box>

				</Box>
				<Box sx={{ width: "33%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
					<Box sx={{maxWidth: "250px"	}}>
						<OrganizationSelector />
					</Box>
				</Box>
			</Box>
			
			{/* Main dashboard content */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: `${SIDEBAR_WIDTH}px 1fr` },
					width: "100%",
					position: "fixed",
					top: "60px",
					left: 0,
					borderRadius: "12px 12px 0 0",
					height: "calc(100vh - 60px)",
					overflow: "hidden",
					backgroundColor: "rgba(241, 241, 241, 1)",
					flex: 1,
					boxShadow: "1px 1px 5px 0px rgba(112,112,112,0.75) inset",
				}}
			>
				<Sidebar />
				<MobileNav />
				<HelpMenu />
				<Box
					sx={{
						py: 0,
						pr: 0,
						height: "100%", // Use 100% of parent height
						width: {
							xs: "100%",
							sm: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
						},
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
					}}
				>
					<Box
						sx={{
							height: "100%",
							width: "100%",
							overflowY: "auto",
							scrollbarWidth: "thin",
							scrollbarColor: (theme) =>
								`${theme.palette.primary.main} transparent`,
							display: "flex",
							flexDirection: "column",
							gap: 2,
						}}
					>
						{children}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
