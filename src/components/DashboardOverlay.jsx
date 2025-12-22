"use client";
import { Box, IconButton } from "@mui/material";
import { darken } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { TbX } from "react-icons/tb";

/**
 * Reusable overlay component for full-screen slide-up panels
 * @param {React.ReactNode} children - Content to display in the overlay
 * @param {string[]} triggerPatterns - Array of URL patterns that trigger the overlay (e.g., ['/dashboard/settings'])
 * @param {boolean} showCloseButton - Whether to show the close (X) button
 * @param {boolean} hasBackdrop - Whether to show the dimmed backdrop
 * @param {boolean} backdropBlur - Whether to apply blur effect to backdrop
 * @param {function} onClose - Optional callback when overlay closes
 */
export function DashboardOverlay({ 
	children,
	triggerPatterns = ['/dashboard/settings'],
	showCloseButton = true,
	hasBackdrop = true,
	backdropBlur = true,
	onClose
}) {
	const pathname = usePathname();
	const router = useRouter();
	const previousRouteRef = useRef(null);

	// Check if current route matches any trigger pattern
	const isOverlayRoute = triggerPatterns.some(pattern => 
		pathname?.startsWith(pattern)
	);
	
	// Initialize state based on whether we're already on an overlay route
	const [isOpen, setIsOpen] = useState(isOverlayRoute);
	const [isAnimating, setIsAnimating] = useState(isOverlayRoute);
	const [wasOverlayRoute, setWasOverlayRoute] = useState(isOverlayRoute);
	const isInitialMount = useRef(true);

	useEffect(() => {
		// Save the route when we're NOT in an overlay (track where we came from)
		if (!isOverlayRoute && pathname) {
			previousRouteRef.current = pathname;
		}
	}, [isOverlayRoute, pathname]);

	useEffect(() => {
		// Skip animation logic on initial mount if already on overlay route
		if (isInitialMount.current) {
			isInitialMount.current = false;
			// If we're already on an overlay route on mount, don't animate
		if (isOverlayRoute) {
				return;
			}
		}
		
		// Only animate if transitioning FROM non-overlay TO overlay or vice versa
		// Don't animate or change state when navigating WITHIN overlay routes
		if (isOverlayRoute && !wasOverlayRoute) {
			// Entering overlay route from outside
			setIsAnimating(true);
			setIsOpen(false); // Start closed
			setTimeout(() => setIsOpen(true), 10); // Open with animation
			setWasOverlayRoute(true);
		} else if (!isOverlayRoute && wasOverlayRoute) {
			// Leaving overlay route
			setIsOpen(false);
			setTimeout(() => {
				setIsAnimating(false);
				setWasOverlayRoute(false);
			}, 300);
		}
		// When isOverlayRoute && wasOverlayRoute (navigating within overlay)
		// Do nothing - states remain unchanged, no re-animation
	}, [isOverlayRoute, wasOverlayRoute]);

	const handleClose = () => {
		// Trigger close animation first
		setIsOpen(false);
		
		// Wait for animation to complete, then navigate
		setTimeout(() => {
			if (onClose) {
				onClose();
			}
			// Navigate to the route we were on before entering overlay
			// If no previous route saved, default to dashboard home
			const targetRoute = previousRouteRef.current || '/dashboard/home';
			router.push(targetRoute);
		}, 300); // Match the transition duration
	};

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	// Don't render if not animating, not open, AND not on an overlay route
	// Keep mounted if we're on an overlay route to prevent flashing during navigation
	if (!isAnimating && !isOpen && !isOverlayRoute) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			{hasBackdrop && (
				<Box
					onClick={handleBackdropClick}
					sx={{
						position: "fixed",
						top: "60px",
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						backdropFilter: backdropBlur ? "blur(4px)" : "none",
						opacity: isOpen ? 1 : 0,
						transition: "opacity 0.3s ease-in-out",
						zIndex: 999,
						pointerEvents: isAnimating ? "auto" : "none",
					}}
				/>
			)}

			{/* Overlay Panel */}
			<Box
				sx={{
					position: "fixed",
					top: "60px",
					left: 0,
					right: 0,
					height: "calc(100vh - 60px)",
					backgroundColor: "background.default",
					borderRadius: "12px 12px 0 0",
					boxShadow: (theme) =>
						`0 -4px 20px 0px ${darken(theme.palette.background.default, 0.3)}`,
					transform: isOpen ? "translateY(0)" : "translateY(100%)",
					transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					zIndex: 1000,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* Close Button */}
				{showCloseButton && (
					<Box
						sx={{
							position: "absolute",
							top: 16,
							right: 16,
							zIndex: 1001,
						}}
					>
						<IconButton
							onClick={handleClose}
							size="small"
							sx={{
								backgroundColor: "background.paper",
								boxShadow: 1,
								"&:hover": {
									backgroundColor: "action.hover",
								},
							}}
						>
							<TbX size={20} />
						</IconButton>
					</Box>
				)}

				{/* Content Area */}
				<Box
					sx={{
						height: "100%",
						width: "100%",
						overflowY: "auto",
						scrollbarWidth: "thin",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{children}
				</Box>
			</Box>
		</>
	);
}

