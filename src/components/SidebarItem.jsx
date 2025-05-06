"use client";
import { Box, ListItem } from "@mui/material";
import * as React from "react";
import { HiLockClosed } from "react-icons/hi";
import { usePathname } from "../framework/usePathname";

export function SidebarItem({
	href,
	target,
	icon: Icon,
	rightAdornment: RightAdornment,
	title,
	deemphasized,
	onClick,
	customColor,
	customHoverColor,
	buttonStyle,
	sx,
	...rest
}) {
	const pathname = usePathname();
	const itemIsActive = pathname?.startsWith(href);
	
	const handleClick = (e) => {
		if (onClick) {
			e.preventDefault();
			onClick(e);
		}
	};
	
	return (
		<ListItem
			disableGutters
			sx={{
				display: "flex",
				py: 0,
				px: buttonStyle ? 0 : 1.5,
				mb: 0,
				...sx,
			}}
			{...rest}
		>
			<Box
				href={href}
				component="a"
				target={target}
				color="info"
				onClick={handleClick}
				sx={{
					borderRadius: buttonStyle ? 1 : 1,
					alignItems: "center",
					justifyContent: buttonStyle ? "center" : "flex-start",
					letterSpacing: 0,
					py: buttonStyle ? 1 : 0.5,
					px: buttonStyle ? 2 : 1.25,
					textDecoration: "none",
					textTransform: "none",
					display: "flex",
					gap: 1.5,
					width: "100%",
					color: customColor || (itemIsActive ? "gray.800" : "gray.500"),
					...(deemphasized && {
						color: "gray.500",
						pointerEvents: "none",
					}),
					...(buttonStyle && {
						backgroundColor: customColor || "primary.main",
						color: "white",
						fontWeight: 500,
						transition: "all 0.2s ease-in-out",
						border: "none",
						boxShadow: (theme) => theme.shadows[1],
					}),
					"&::before": {
						content: "''",
						position: "absolute",
						top: 3,
						bottom: 3,
						left: -3,
						width: 6,
						backgroundColor: (!buttonStyle && itemIsActive) ? "gray.700" : "transparent",
						borderRadius: 2,
					},
					"&:hover": {
						...(buttonStyle 
							? {
								backgroundColor: customHoverColor || "primary.dark",
								boxShadow: (theme) => theme.shadows[2],
								transform: "translateY(-1px)",
							}
							: {
								bgcolor: customHoverColor 
									? (theme) => theme.palette.mode === 'light' 
										? `${customHoverColor}15` // 15% opacity for light mode
										: `${customHoverColor}25` // 25% opacity for dark mode
									: itemIsActive
										? "hsl(213deg 94% 18% / 5%)"
										: "hsl(210deg 88% 21% / 3%)",
							}),
						cursor: "pointer",
						color: buttonStyle ? "white" : customColor,
					},
					"&:active": {
						...(buttonStyle && {
							transform: "translateY(0px)",
							boxShadow: (theme) => theme.shadows[1],
						}),
					},
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "20px",
						height: "20px",
						color: "inherit",
					}}
				>
					{Icon && Icon}
				</Box>
				<Box
					sx={{
						display: "flex",
						width: "100%",
						alignItems: "center",
						justifyContent: buttonStyle ? "center" : "space-between",
						textOverflow: "ellipsis",
						fontSize: buttonStyle ? "sm" : "sm",
						fontWeight: buttonStyle ? "500" : (itemIsActive ? "600" : "medium"),
					}}
				>
					{title}
					{RightAdornment && RightAdornment}
				</Box>
				{deemphasized && (
					<Box
						component="span"
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "gray.300",
							height: 12,
						}}
					>
						<HiLockClosed size={12} />
					</Box>
				)}
			</Box>
		</ListItem>
	);
}
