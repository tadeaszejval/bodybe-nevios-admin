"use client";
import { Box, IconButton } from "@mui/material";
import * as React from "react";
import { TbChevronRight } from "react-icons/tb";
import { Breadcrumb } from "../components/Breadcrumb";
import { usePageTitle } from "../framework/usePageTitle";
import { Tooltip } from "@mui/material";
export function DashboardHeader({
	title,
	subtitle,
	actions,
	breadcrumbItemList,
	icon,
	iconColor = "black",
	iconTooltipTitle,
	iconOnClick = () => {},
	badges,
}) {
	usePageTitle(title);
	return (
		<Box
			data-tour="dashboard-header"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 1,
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					position: "relative",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						rowGap: { xs: 1.5, sm: 0.5 },
						flexWrap: "wrap",
						width: "100%",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							fontWeight: 600,
							fontSize: "xl",
						}}
					>
						{icon && (
							<Tooltip title={iconTooltipTitle}>
								<IconButton 
									sx={{ 
										variant: "chip",
										display: "flex",
										alignItems: "center",
										color: "black",
								}}
								color={iconColor}
								onClick={iconOnClick}
							>
								{icon}
							</IconButton>
							</Tooltip>
						)}
						{iconOnClick && (
							<Box
								sx={{
									variant: "chip",
									display: "flex",
									alignItems: "center",
									color: "secondary.main",
									padding: 0,
								}}
							>
								<TbChevronRight size={15} />
							</Box>
						)}
						{breadcrumbItemList ? (
							<Breadcrumb fontSize="xl" itemList={breadcrumbItemList} />
						) : (
							title
						)}
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						{actions}
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 1,
					color: "secondary.main",
					fontSize: "sm",
				}}
			>
				{subtitle}
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 1,
				}}
			>
				{badges}
			</Box>
		</Box>
	);
}
