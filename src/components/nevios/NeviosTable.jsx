"use client";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { NeviosSecondaryIconButton, NeviosSimpleToggleButton } from "./NeviosButtons";
import { TbSearch } from "react-icons/tb";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import * as React from "react";
import { DotLoader } from "../DotLoader";
export const defaultAscendingSortOrder = ["asc", "desc", null];
export const defaultDescendingSortOrder = ["desc", "asc", null];
export function NeviosTable({
	tableHeight,
	sortingOrder = defaultAscendingSortOrder,
	hideFooter = true,
	loading,
	columns,
	rows = [],
	variant = "simple",
	rowHeight,
	emptyStateProps = {},
	...props
}) {
	const [sortModel, setSortModel] = React.useState(
		props?.initialState?.sorting ? props?.initialState?.sorting?.sortModel : [],
	);
	const theme = useTheme();
	const matchesSmBreakpoint = useMediaQuery(theme.breakpoints.up("sm"));
	
	// Calculate default rowHeight based on breakpoint if custom rowHeight is not provided
	const calculatedRowHeight = rowHeight || (matchesSmBreakpoint ? 40 : 32);
	
	return (
		// wrapping components to prevent tables from overflowing outside their parent containers
		<div
			style={{
				flex: 1,
				height: "100%",
				width: "100%",
				overflowX: "auto",
				overflowY: "hidden",
			}}
		>
			<Box
				sx={{
					flex: 1,
					minHeight: tableHeight,
					maxHeight: "80vh",
					height: tableHeight || "100%",
					width: "100%",
					borderTop: (theme) => `0.5px solid ${theme.palette.gray[200]}`,
				}}
			>
				<Box sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					height: "50px",
					px: 1.5,
					justifyContent: "space-between",
					gap: 2,
					borderBottom: (theme) => `0.75px solid ${theme.palette.gray[200]}`,
				}}>
					<Box sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: 0.5,
					}}>
						<NeviosSimpleToggleButton toggled={true}>Active</NeviosSimpleToggleButton>
						<NeviosSimpleToggleButton>Inactive</NeviosSimpleToggleButton>
					</Box>
					<Box sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: 0.5,
					}}>
						<NeviosSecondaryIconButton>
							<TbSearch size={16} />
						</NeviosSecondaryIconButton>
					</Box>

				</Box>
				<DataGrid
					disableRowSelectionOnClick
					columnHeaderHeight={matchesSmBreakpoint ? 40 : 32}
					rowHeight={calculatedRowHeight}
					sortingOrder={sortingOrder}
					sortModel={sortModel}
					onSortModelChange={(model) => setSortModel(model)}
					hideFooter={hideFooter}
					loading={loading}
					columns={columns}
					rows={rows}
					sx={{
						[`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
							{
								outline: "none",
							},
						[`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
							{
								outline: "none",
							},
						".datagrid-row-error": {
							backgroundColor: theme.palette.red["50"],
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.red["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
							'[data-mui-color-scheme="dark"] &': {
								backgroundColor: theme.palette.red["50"],
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.red["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
							},
						},
						".datagrid-row-disabled": {
							".MuiCheckbox-root": {
								visibility: "hidden",
							},
							opacity: 0.75,
							backgroundColor: theme.palette.gray["50"],
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.gray["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
							'[data-mui-color-scheme="dark"] &': {
								backgroundColor: theme.palette.gray["50"],
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.gray["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
							},
						},
						".MuiDataGrid-row": {
							borderTop: `0.7px solid ${theme.palette.gray[200]}`,
						},
						'.MuiDataGrid-row, .MuiDataGrid-cell': {
							cursor: 'default',
						},
						'.MuiDataGrid-row[role="row"]:hover': {
							backgroundColor: theme.palette.action.hover,
							cursor: 'pointer',
						},
						...(variant === "simple" && {
							borderRadius: 0,
							".MuiDataGrid-columnHeader": {
								borderTopRightRadius: 0,
								borderTopLeftRadius: 0,
								backgroundColor: theme.palette.gray["50"],
							},
							border: "none",
							// remove the left padding from the first column, where aria-colindex="1"
							".MuiDataGrid-cell[aria-colindex='1']": {
								paddingLeft: 0,
							},
							".MuiDataGrid-columnHeader[aria-colindex='1']": {
								paddingLeft: 0,
							},
						}),
					}}
					{...props}
					slots={{
						...props.slots,
						loadingOverlay: () => {
							return (
								<Box
									sx={{
										position: "absolute",
										inset: 0,
										height: "100%",
										width: "100%",
										pointerEvents: "none",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										zIndex: 4,
										// make a pseudo element that is partially opaque from bottom to top
										"&::before": {
											content: '""',
											position: "absolute",
											inset: 0,
											height: "100%",
											width: "100%",
											pointerEvents: "none",
											zIndex: 5,
											opacity: 0.5,
											background: (theme) => `linear-gradient(to top,
                      ${theme.palette.background.paper},
                      ${theme.palette.background.paper} 100%
                      )`,
										},
									}}
								>
									<DotLoader loading={true} dotSize={6} />
								</Box>
							);
						},
						noRowsOverlay: () => {
							return (
								<Box
									sx={{
										height: "100%",
										width: "100%",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										gap: 2,
										color: "gray.800",
									}}
								>
									{/* Add your icon and message here */}
									<Box sx={{ fontSize: "48px" }}>📋</Box>
									<Box sx={{ fontSize: "16px", fontWeight: 500 }}>
										{emptyStateProps.title || 'No data available'}
									</Box>
									<Box sx={{ fontSize: "14px", color: "gray.400" }}>
										{emptyStateProps.description || 'There are no rows to display'}
									</Box>
									<Button variant="contained" color="primary">{emptyStateProps.buttonText || 'View All Orders'}</Button>
								</Box>
							);
						},
					}}
				/>
			</Box>
		</div>
	);
}
function hslToHex(hslString) {
	if (!hslString) {
		return "";
	}
	const matches = hslString.match(/\d+/g);
	// check that we got matches
	if (!matches) {
		return "";
	}
	// Extract the H, S, and L values from the HSL string
	const [h, s, l] = matches.map(Number);
	// Convert HSL to Hex
	const hslToHex = (h, s, l) => {
		l /= 100;
		const a = (s * Math.min(l, 1 - l)) / 100;
		const f = (n) => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, "0");
		};
		return `${f(0)}${f(8)}${f(4)}`;
	};
	return hslToHex(h, s, l);
}
