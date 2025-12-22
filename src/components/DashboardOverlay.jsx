"use client";
import { Box, IconButton } from "@mui/material";
import { darken } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Check if current route matches any trigger pattern
	const isOverlayRoute = triggerPatterns.some(pattern => 
		pathname?.startsWith(pattern)
	);

	useEffect(() => {
		if (isOverlayRoute) {
			// Open animation
			setIsAnimating(true);
			// Small delay to trigger animation
			setTimeout(() => setIsOpen(true), 10);
		} else {
			// Close animation
			setIsOpen(false);
			// Wait for animation to complete before hiding
			setTimeout(() => setIsAnimating(false), 300);
		}
	}, [isOverlayRoute]);

	const handleClose = () => {
		// Trigger close animation first
		setIsOpen(false);
		
		// Wait for animation to complete, then navigate
		setTimeout(() => {
			if (onClose) {
				onClose();
			}
			router.back();
		}, 300); // Match the transition duration
	};

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	// Don't render if not animating and not open
	if (!isAnimating && !isOpen) {
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

