"use client";
import * as React from "react";
import { Box, useTheme } from "@mui/material";
import { darken } from "@mui/material/styles";
import { MobileNav } from "../components/MobileNav";
import { Sidebar, SIDEBAR_WIDTH } from "../components/Sidebar";
import { useRegisterTours } from "../context/TourProvider";
import { NavigationBackButton } from "./NavigationBackButton";
import { ContentLoadingScreen } from "./ContentLoadingScreen";
import { Logo } from "./Logo";
import { DashboardOverlay } from "./DashboardOverlay";
import { usePathname } from "next/navigation";
import { getOverlayPatterns } from "../config/overlayRoutes";

export function DashboardLayout({ children }) {
	useRegisterTours();
	const theme = useTheme();
	const pathname = usePathname();
	
	// Get all overlay patterns from configuration
	const overlayPatterns = getOverlayPatterns();
	
	// Check if we're on any overlay route
	const isOverlayRoute = overlayPatterns.some(pattern => 
		pathname?.startsWith(pattern)
	);
	
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
					zIndex: 1001, // Above settings overlay
				}}
			>
			<Box sx={{ width: "33%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", paddingLeft: 1, gap: 2 }}>
				<Box>
					<Logo width={100} textColor="white" symbolColor={theme.palette.primary[500]} stripeColor="white" />
				</Box>
			</Box>
				<Box sx={{ width: "33%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
					<Box>
						<NavigationBackButton />
					</Box>

				</Box>
				<Box sx={{ width: "33%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
	
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
					backgroundColor: "background.default",
					flex: 1,
					boxShadow: (theme) => `1px 1px 5px 0px ${darken(theme.palette.background.default, 0.2)} inset`,
				}}
			>
				<Sidebar />
				<MobileNav />
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
						display: "flex",
						flexDirection: "column",
						gap: 2,
					}}
				>
					<React.Suspense fallback={<ContentLoadingScreen />}>
						{/* Only render main dashboard content if NOT on overlay route */}
						{!isOverlayRoute && children}
					</React.Suspense>
				</Box>
				</Box>
			</Box>
			
			{/* Dashboard Overlay - reusable for settings and other modules */}
			<DashboardOverlay 
				triggerPatterns={overlayPatterns}
				showCloseButton={true}
				hasBackdrop={true}
				backdropBlur={true}
			>
				<React.Suspense fallback={<ContentLoadingScreen />}>
					{isOverlayRoute && children}
				</React.Suspense>
			</DashboardOverlay>
		</Box>
	);
}
