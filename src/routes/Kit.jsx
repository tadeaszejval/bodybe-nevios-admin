"use client";
// KitDemo: All-in-one demo of main dashboard page components
// This page demonstrates the main dashboard components directly in this file.

import { Box, Divider, Typography, Button, Stack, Popover, Tab, Tabs, TextareaAutosize, FormControl, FormLabel, FilledInput, RadioGroup, FormControlLabel, Radio, Divider as MuiDivider } from "@mui/material";
import { TbDownload, TbPlus, TbAlertTriangle, TbArrowRight, TbColorSwatch } from "react-icons/tb";
import { cheerfulFiestaPalette } from "@mui/x-charts";
import { BarChartComposition } from "../components/BarChartComposition";
import { BarListComposition } from "../components/BarListComposition";
import { ChartCard } from "../components/ChartCard";
import { ColorDot } from "../components/ColorDot";
import { DashboardHeader } from "../components/DashboardHeader";
import { DateRangerChanger } from "../components/DateRangerChanger";
import { EventCard } from "../components/EventCard";
import { FileUpload } from "../components/FileUpload";
import { LabeledDivider } from "../components/LabeledDivider";
import { LineChartComposition } from "../components/LineChartComposition";
import { NpsSurvey } from "../components/NpsSurvey";
import { OrdersTable } from "../components/OrdersTable";
import { PageContainer } from "../components/PageContainer";
import { PieChartComposition } from "../components/PieChartComposition";
import { ScatterChartComposition } from "../components/ScatterChartComposition";
import { SimpleBarChart } from "../components/SimpleBarChart";
import { SimpleLineChart } from "../components/SimpleLineChart";
import { SimplePieChart } from "../components/SimplePieChart";
import { SimpleScatterChart } from "../components/SimpleScatterChart";
import { SpeakersList } from "../components/SpeakersList";
import { SimpleDrawer } from "../components/SimpleDrawer";
import { useBroadcastTour } from "../context/BroadcastTourProvider";
import { useThemeCustomization } from "../context/ThemeCustomizationProvider";
import { formatAbbreviatedNumber, formatShortDate } from "../core/formatters";
import { DUMMY_EVENTS } from "../data/events";
import { DUMMY_TIMESERIES } from "../data/timeseries";
import { FrameworkLink } from "../framework/FrameworkLink";
import { useDisclosure } from "../hooks/useDisclosure";
import React from "react";
import dayjs from "dayjs";
import {
	ALL_AVAIL_COLOR_SCALES_LIST,
	ALL_AVAIL_FONTS_LIST,
	ALL_RADIUS_SCALES_LIST,
} from "../theme";

// --- KitDemo page ---
export default function KitDemo() {
	// For Home and Events components
	const { broadcastTour } = useBroadcastTour();
	const customizeDisclosure = useDisclosure({ provideAnchorEl: true });
	const npsDisclosure = useDisclosure();
	const { setActiveColorScale, setActiveRadiusScale, setActiveFont } = useThemeCustomization();
	const { setMode } = (typeof window !== "undefined" ? require("@mui/material").useColorScheme() : { setMode: () => {} });

	// For Events component
	const [tabValue, setTabValue] = React.useState(0);
	const newEventDisclosure = useDisclosure();
	const handleTabChange = (event, newValue) => setTabValue(newValue);
	const pastEvents = DUMMY_EVENTS.filter((event) => dayjs(event.event_date).isBefore(new Date(), "day"));
	const liveEvents = DUMMY_EVENTS.filter((event) => dayjs(event.event_date).isSame(new Date(), "day"));
	const upcomingEvents = DUMMY_EVENTS.filter((event) => dayjs(event.event_date).isAfter(new Date(), "day"));

	// Helper for Events tab panel
	function CustomTabPanel({ children, value, index, ...other }) {
		return (
			<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
				{value === index && <Box>{children}</Box>}
			</div>
		);
	}
	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			"aria-controls": `simple-tabpanel-${index}`,
		};
	}
	function EventGrid({ events }) {
		const sortedEvents = [...events].sort((a, b) => dayjs(b.event_date).isBefore(dayjs(a.event_date)) ? -1 : 1);
		return (
			<Stack direction="column" spacing={2}>
				{sortedEvents.map((event) => (
					<EventCard key={event.event_name} event={event} />
				))}
			</Stack>
		);
	}

	// --- Render ---
	return (
		<Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 1400, mx: "auto" }}>
			<Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
				Nevios UI Kit (MUI Base)
			</Typography>
			<Typography sx={{ mb: 4, color: "gray.600" }}>
				This page demonstrates the main dashboard components directly in this file. Each section below shows a live example and the code you need.
			</Typography>

			{/* --- Home Dashboard --- */}
			<Divider sx={{ my: 4 }}>Home Dashboard</Divider>
			{/* This is the Home dashboard component, inlined. */}
			<PageContainer>
				<NpsSurvey disclosure={npsDisclosure} />
				<DashboardHeader
					title="Home"
					subtitle="Welcome back, Ally"
					actions={
						<Stack spacing={1} direction="row">
							<Button
								variant="outlined"
								color="secondary"
								endIcon={<TbColorSwatch size={14} />}
								onClick={customizeDisclosure.onOpen}
							>
								Customize Theme
							</Button>
							<Popover
								open={customizeDisclosure.isOpen}
								anchorEl={customizeDisclosure.anchorEl}
								onClose={customizeDisclosure.onClose}
								sx={{ ".MuiPaper-root": { boxShadow: 2 } }}
							>
								<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", padding: 2, minWidth: 300, maxWidth: 440, gap: 1, position: "relative", width: "100%" }}>
									<Typography sx={{ fontWeight: 600, fontSize: "sm", color: "gray.800" }}>Color</Typography>
									<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, width: "100%" }}>
										{ALL_AVAIL_COLOR_SCALES_LIST.map((colorScale) => (
											<Button key={colorScale.value} color="secondary" size="small" onClick={() => setActiveColorScale(colorScale.value)} sx={{ width: "100%", gap: 1, justifyContent: "flex-start" }}>
												<ColorDot color={colorScale.value} />
												{colorScale.label}
											</Button>
										))}
									</Box>
									<Typography sx={{ fontWeight: 600, fontSize: "sm", color: "gray.800" }}>Radius</Typography>
									<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, width: "100%" }}>
										{ALL_RADIUS_SCALES_LIST.map((radiusScale) => (
											<Button key={radiusScale.value} color="secondary" size="small" onClick={() => setActiveRadiusScale(radiusScale.value)} sx={{ width: "100%", justifyContent: "flex-start" }}>
												<Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
													<Box>{radiusScale.label}</Box>
													<Box sx={{ lineHeight: 1, fontSize: "2xs", color: "gray.600", fontWeight: 400 }}>{radiusScale.description}</Box>
												</Box>
											</Button>
										))}
									</Box>
									<Typography sx={{ fontWeight: 600, fontSize: "sm", color: "gray.800" }}>Font</Typography>
									<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, width: "100%" }}>
										{ALL_AVAIL_FONTS_LIST.map((fontObject) => (
											<Button key={fontObject.value} color="secondary" size="small" onClick={() => setActiveFont(fontObject.value)} sx={{ width: "100%", justifyContent: "flex-start" }}>
												<Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
													<Box sx={{ fontFamily: fontObject.value }}>{fontObject.value}</Box>
												</Box>
											</Button>
										))}
									</Box>
									<Typography sx={{ fontWeight: 600, fontSize: "sm", color: "gray.800" }}>Mode</Typography>
									<Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, width: "100%" }}>
										<Button color="secondary" size="small" onClick={() => setMode("light")} sx={{ width: "100%", justifyContent: "flex-start" }}>Light</Button>
										<Button color="secondary" size="small" onClick={() => setMode("dark")} sx={{ width: "100%", justifyContent: "flex-start" }}>Dark</Button>
									</Box>
								</Box>
							</Popover>
							<Button variant="outlined" color="secondary" onClick={npsDisclosure.onToggle} sx={{ display: { xs: "none", md: "flex" } }}>
								{npsDisclosure.isOpen ? "Close" : "Open"} Survey
							</Button>
							<Button variant="contained" color="primary" onClick={() => broadcastTour("welcome")} sx={{ display: { xs: "none", md: "flex" } }}>
								Take a Tour
							</Button>
						</Stack>
					}
				/>
				<Stack spacing={3}>
					<Box id="home-alert" sx={{ display: "flex", alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 1, fontSize: "sm", padding: 1.5, border: (theme) => `1px dashed ${theme.palette.yellow["400"]}`, backgroundColor: "yellow.50", borderRadius: 2, boxShadow: 1 }}>
						<Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "center" }, flexDirection: "row", gap: 1 }}>
							<Box sx={{ display: "flex", alignItems: "center", padding: 1, backgroundColor: "yellow.100", borderRadius: 999, color: "yellow.800" }}>
								<TbAlertTriangle size={20} />
							</Box>
							<Box sx={{ width: "100%" }}>
								4 Speakers have not submitted outlines. <Box component="span" sx={{ color: "gray.500" }}>You may consider reaching out or extending the deadline.</Box>
							</Box>
						</Box>
						<Button color="secondary" onClick={() => { document.getElementById("home-alert")?.remove(); }}>Ignore</Button>
						<FrameworkLink to="/dashboard/speakers">
							<Button endIcon={<TbArrowRight />}>View</Button>
						</FrameworkLink>
					</Box>
					<Box data-tour="home-charts" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "repeat(3, 1fr)" }, gap: 2, rowGap: 4 }}>
						<LineChartComposition
							title="Ticket Revenue Over Time"
							totalValue={4500}
							totalRenderer={(value) => `$${value}`}
							chartHeight={250}
							chartProps={{
								dataset: DUMMY_TIMESERIES,
								xAxis: [
									{
										id: "categories",
										dataKey: "date",
										scaleType: "band",
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === DUMMY_TIMESERIES.length - 1;
										},
									},
								],
								series: [
									{
										dataKey: "value",
										valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
										stack: "total",
										area: true,
									},
									{
										dataKey: "secondaryValue",
										valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
										stack: "total",
										area: true,
									},
								],
							}}
						/>
						<BarChartComposition
							title="7d Tickets Sold"
							totalValue={210}
							chartHeight={250}
							chartProps={{
								xAxis: [
									{
										id: "barCategories",
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
										scaleType: "band",
									},
								],
								series: [
									{
										data: [14, 58, 56, 61, 59, 41, 12],
									},
								],
							}}
						/>
						<BarListComposition
							title="Tickets sold by Event"
							totalValue={1200 + 175 + 42}
							chartHeight={250}
							chartProps={{
								data: [
									{ name: "InnovateTech", value: 1200 },
									{ name: "Visionary Symposium", value: 880 },
									{ name: "Global Trends Conference", value: 175 },
									{ name: "Code Conf", value: 4 },
								],
								nameField: "name",
								valueField: "value",
							}}
						/>
					</Box>
					<Box data-tour="home-table" sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%" }}>
						<Stack spacing={1} direction="row" sx={{ justifyContent: "space-between", alignItems: "center", borderBottom: (theme) => `1px solid ${theme.palette.gray["200"]}` }}>
							<Typography variant="h3" sx={{ fontSize: "sm", color: "gray.900", fontWeight: 500 }}>
								Recent Ticket Sales
							</Typography>
							<Button component={FrameworkLink} to="/dashboard/orders" color="secondary" endIcon={<TbArrowRight />} size="small">
								See More
							</Button>
						</Stack>
						<OrdersTable tableHeight={350} />
					</Box>
				</Stack>
			</PageContainer>

			{/* --- Analytics Dashboard --- */}
			<Divider sx={{ my: 4 }}>Analytics Dashboard</Divider>
			{/* This is the Analytics dashboard component, inlined. */}
			<PageContainer>
				<DashboardHeader title="Analytics" actions={<DateRangerChanger />} />
				<Box data-tour="home-charts" sx={{ display: { xs: "block", md: "grid" }, gridTemplateColumns: { xs: undefined, md: "1fr 1fr 1fr" }, gridTemplateAreas: { xs: undefined, md: `\n              "chart1 chart1 chart2"\n              "chart3 chart4 chart4"\n              "chart5 chart5 chart5"\n            ` }, gap: 2, rowGap: 4 }}>
					<Box sx={{ gridArea: "chart1" }}>
						<LineChartComposition
							title="Ticket Revenue Over Time"
							totalValue={4500}
							totalRenderer={(value) => `$${value}`}
							chartHeight={250}
							chartProps={{
								dataset: DUMMY_TIMESERIES,
								xAxis: [
									{
										id: "categories",
										dataKey: "date",
										scaleType: "band",
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === DUMMY_TIMESERIES.length - 1;
										},
									},
								],
								series: [
									{
										dataKey: "value",
										valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
									},
								],
							}}
						/>
					</Box>
					<Box sx={{ gridArea: "chart2" }}>
						<BarChartComposition
							title="7d Tickets Sold"
							totalValue={210}
							chartHeight={250}
							chartProps={{
								xAxis: [
									{
										id: "barCategories",
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
										scaleType: "band",
									},
								],
								series: [
									{
										data: [14, 58, 56, 61, 59, 41, 12],
									},
								],
							}}
						/>
					</Box>
					<Box sx={{ gridArea: "chart3" }}>
						<PieChartComposition
							title="% of Tickets sold by Event"
							totalValue={100}
							totalRenderer={() => "100%"}
							chartHeight={250}
							chartProps={{
								colors: cheerfulFiestaPalette,
								slotProps: {
									legend: {
										direction: "row",
										position: { horizontal: "left", vertical: "bottom" },
										itemMarkWidth: 10,
										itemMarkHeight: 3,
									},
								},
								series: [
									{
										cx: 75,
										cy: 75,
										innerRadius: 50,
										outerRadius: 75,
										paddingAngle: 1,
										cornerRadius: 3,
										data: [
											{ label: "InnovateTech", value: 1200 },
											{ label: "Visionary Symposium", value: 880 },
											{ label: "Global Trends Conference", value: 175 },
											{ label: "Code Conf", value: 28 },
										],
									},
								],
							}}
						/>
					</Box>
					<Box sx={{ gridArea: "chart4" }}>
						<BarListComposition
							title="Tickets sold by Event"
							totalValue={1200 + 175 + 42}
							chartHeight={250}
							chartProps={{
								data: [
									{ name: "InnovateTech", value: 1200 },
									{ name: "Visionary Symposium", value: 880 },
									{ name: "Global Trends Conference", value: 175 },
									{ name: "Code Conf", value: 28 },
								],
								nameField: "name",
								valueField: "value",
							}}
						/>
					</Box>
					<Box sx={{ gridArea: "chart5" }}>
						<ScatterChartComposition
							title="Attendance vs Earnings"
							totalValue={54000}
							totalRenderer={(value) => `$${formatAbbreviatedNumber(value)}`}
							chartHeight={250}
							chartProps={{
								slotProps: { legend: { hidden: true } },
								yAxis: [
									{
										valueFormatter: (value) => `$${formatAbbreviatedNumber(value)}`,
									},
								],
								series: [
									{
										label: "Event",
										data: DUMMY_EVENTS.map((ev) => ({ id: ev.event_name, x: ev.count_signed_up, y: ev.cost_per_ticket * ev.count_signed_up })),
									},
								],
							}}
						/>
					</Box>
				</Box>
			</PageContainer>

			{/* --- Charts Dashboard --- */}
			<Divider sx={{ my: 4 }}>Charts Dashboard</Divider>
			{/* This is the Charts dashboard component, inlined. */}
			{/* Full Charts demo from Charts.jsx inlined below. */}
			<PageContainer customSx={{ gap: 4 }}>
				<DashboardHeader title="Charts" subtitle="Beautiful charts built with @mui/x-charts that can be incorporated into any dashboard" />
				{/* ChartGrid helper for layout */}
				{(() => {
					const COMMON_X_CONFIG = {
						id: "categories",
						dataKey: "date",
						scaleType: "band",
					};
					const MINI_TIMESERIES = [
						{ date: "2021-01-01", value: 1210 },
						{ date: "2021-01-02", value: 980 },
						{ date: "2021-01-03", value: 1400 },
						{ date: "2021-01-04", value: 1510 },
						{ date: "2021-01-05", value: 3560 },
						{ date: "2021-01-06", value: 1310 },
						{ date: "2021-01-07", value: 1010 },
					];
					function ChartGrid({ children }) {
						return (
							<Box
								sx={{
									display: { xs: "grid", md: "grid" },
									gridTemplateColumns: {
										xs: "1fr",
										md: "1fr 1fr",
										lg: "1fr 1fr 1fr",
									},
									gridAutoRows: "350px",
									gap: 2,
								}}
							>
								{children}
							</Box>
						);
					}
					return <>
						{/* Stacked Area, Pie, and Bar Charts */}
						<ChartGrid>
							<ChartCard title="Stacked Area Chart" description="Revenue over time from ticket sales">
								<SimpleLineChart
									dataset={DUMMY_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === DUMMY_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Pre-sale Revenue",
											area: true,
										},
										{
											dataKey: "secondaryValue",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Day-of Revenue",
											area: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Category Pie Chart" description="Sales by event">
								<SimplePieChart
									dataset={DUMMY_TIMESERIES}
									slotProps={{ legend: { hidden: true } }}
									series={[
										{
											data: [
												{ label: "InnovateTech", value: 1200 },
												{ label: "Visionary Symposium", value: 880 },
												{ label: "Global Trends Conference", value: 175 },
												{ label: "Code Conf", value: 28 },
											],
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Stacked Horizontal Bar Chart" description="Weekly ticket sales">
								<SimpleBarChart
									layout="horizontal"
									yAxis={[{
										...COMMON_X_CONFIG,
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									}]}
									series={[
										{
											data: [33, 64, 56, 71, 99, 141, 32],
											label: "Pre-sale Tickets",
											stack: "total",
										},
										{
											data: [14, 58, 56, 61, 59, 41, 12],
											label: "Day-of Tickets",
											stack: "total",
										},
									]}
								/>
							</ChartCard>
						</ChartGrid>
						<LabeledDivider>Line Charts</LabeledDivider>
						<ChartGrid>
							<ChartCard title="Linear Line Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											curve: "linear",
											label: "Pre-sale Revenue",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Step Line Chart" description="Ticket price over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Ticket price",
											curve: "stepBefore",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Curved Line Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											label: "Pre-sale Revenue",
											curve: "catmullRom",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Dotted Line Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											curve: "linear",
											label: "Pre-sale Revenue",
											showMark: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Line Chart + Legend" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									margin={{ top: 40 }}
									slotProps={{
										legend: {
											hidden: false,
											position: { vertical: "top", horizontal: "middle" },
											padding: 0,
										},
									}}
									series={[
										{
											dataKey: "value",
											valueFormatter: (v, i) => `${v}${i.dataIndex > 3 ? " (estimated)" : ""}`,
											curve: "linear",
											label: "Pre-sale Revenue",
											showMark: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Multi Line Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={DUMMY_TIMESERIES.slice(0, 7)}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === DUMMY_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Pre-sale Revenue",
										},
										{
											dataKey: "secondaryValue",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Day-of Revenue",
										},
									]}
								/>
							</ChartCard>
						</ChartGrid>
						<LabeledDivider>Bar Charts</LabeledDivider>
						<ChartGrid>
							<ChartCard title="Simple Bar Chart" description="Pres-sale ticket sales">
								<SimpleBarChart
									xAxis={[{
										...COMMON_X_CONFIG,
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									}]}
									series={[
										{
											data: [33, 64, 56, 71, 99, 141, 32],
											label: "Pre-sale Tickets",
											stack: "total",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Simple Horizontal Bar Chart" description="Day-of ticket sales">
								<SimpleBarChart
									layout="horizontal"
									yAxis={[{
										...COMMON_X_CONFIG,
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									}]}
									series={[
										{
											data: [14, 58, 56, 61, 59, 41, 12],
											label: "Day-of Tickets",
											stack: "total",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Multi Bar Chart" description="Pre-sale and day-of ticket sales">
								<SimpleBarChart
									xAxis={[{
										...COMMON_X_CONFIG,
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									}]}
									series={[
										{
											data: [33, 64, 56, 71, 99, 141, 32],
											label: "Pre-sale Tickets",
										},
										{
											data: [14, 58, 56, 61, 59, 41, 12],
											label: "Day-of Tickets",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Stacked Bar Chart" description="Weekly ticket sales">
								<SimpleBarChart
									xAxis={[{
										...COMMON_X_CONFIG,
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									}]}
									series={[
										{
											data: [33, 64, 56, 71, 99, 141, 32],
											label: "Pre-sale Tickets",
											stack: "total",
										},
										{
											data: [14, 58, 56, 61, 59, 41, 12],
											label: "Day-of Tickets",
											stack: "total",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Stacked Horizontal Bar Chart" description="Weekly ticket sales">
								<SimpleBarChart
									layout="horizontal"
									yAxis={[{
										...COMMON_X_CONFIG,
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									}]}
									series={[
										{
											data: [33, 64, 56, 71, 99, 141, 32],
											label: "Pre-sale Tickets",
											stack: "total",
										},
										{
											data: [14, 58, 56, 61, 59, 41, 12],
											label: "Day-of Tickets",
											stack: "total",
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Multi Bar Chart" description="Weekly ticket sales">
								<SimpleBarChart
									xAxis={[{
										...COMMON_X_CONFIG,
										data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									}]}
									series={[
										{
											data: [33, 64, 56, 71, 99, 141, 32],
											label: "Pre-sale Tickets",
											stack: "total",
										},
										{
											data: [14, 58, 56, 61, 59, 41, 12],
											label: "Day-of Tickets",
											stack: "total",
										},
									]}
								/>
							</ChartCard>
						</ChartGrid>
						<LabeledDivider>Area Charts</LabeledDivider>
						<ChartGrid>
							<ChartCard title="Simple Area Chart" description="Ticket price over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Ticket price",
											curve: "stepBefore",
											area: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Linear Area Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											curve: "linear",
											label: "Pre-sale Revenue",
											area: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Curved Area Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											label: "Pre-sale Revenue",
											curve: "catmullRom",
											area: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Dotted Area Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											curve: "linear",
											label: "Pre-sale Revenue",
											showMark: true,
											area: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Area Chart + Legend" description="Ticket sales over time">
								<SimpleLineChart
									dataset={MINI_TIMESERIES}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === MINI_TIMESERIES.length - 1;
										},
									}]}
									margin={{ top: 40 }}
									slotProps={{
										legend: {
											hidden: false,
											position: { vertical: "top", horizontal: "middle" },
											padding: 0,
										},
									}}
									series={[
										{
											dataKey: "value",
											valueFormatter: (v, i) => `${v}${i.dataIndex > 3 ? " (estimated)" : ""}`,
											curve: "linear",
											label: "Pre-sale Revenue",
											showMark: true,
											area: true,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Multi Are Chart" description="Ticket sales over time">
								<SimpleLineChart
									dataset={DUMMY_TIMESERIES.slice(0, 7)}
									xAxis={[{
										...COMMON_X_CONFIG,
										valueFormatter: formatShortDate,
										tickNumber: 2,
										tickLabelInterval(value, index) {
											return index === 0 || index === DUMMY_TIMESERIES.length - 1;
										},
									}]}
									series={[
										{
											dataKey: "value",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Pre-sale Revenue",
											area: true,
										},
										{
											dataKey: "secondaryValue",
											valueFormatter: (value) => value ? `$${formatAbbreviatedNumber(value)}` : "",
											stack: "total",
											label: "Day-of Revenue",
											area: true,
										},
									]}
								/>
							</ChartCard>
						</ChartGrid>
						<LabeledDivider>Pie Charts</LabeledDivider>
						<ChartGrid>
							<ChartCard title="Simple Donut Chart" description="Sales by event">
								<SimplePieChart
									dataset={DUMMY_TIMESERIES}
									slotProps={{ legend: { hidden: true } }}
									series={[
										{
											data: [
												{ label: "InnovateTech", value: 1200 },
												{ label: "Visionary Symposium", value: 880 },
												{ label: "Global Trends Conference", value: 175 },
												{ label: "Code Conf", value: 28 },
											],
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Simple Pie Chart" description="Sales by event">
								<SimplePieChart
									dataset={DUMMY_TIMESERIES}
									slotProps={{ legend: { hidden: true } }}
									series={[
										{
											data: [
												{ label: "InnovateTech", value: 1200 },
												{ label: "Visionary Symposium", value: 880 },
												{ label: "Global Trends Conference", value: 175 },
												{ label: "Code Conf", value: 28 },
											],
											innerRadius: 0,
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Labeled Pie Chart" description="Sales by event">
								<SimplePieChart
									dataset={DUMMY_TIMESERIES}
									slotProps={{ legend: { hidden: true } }}
									series={[
										{
											data: [
												{ label: "InnovateTech", value: 1200 },
												{ label: "Visionary Symposium", value: 880 },
												{ label: "Global Trends Conference", value: 175 },
												{ label: "Code Conf", value: 28 },
											],
											arcLabel: (item) => `${item.value}`,
											cx: 75,
											cy: 75,
											innerRadius: 0,
											outerRadius: 75,
											paddingAngle: 0,
											cornerRadius: 0,
										},
									]}
								/>
							</ChartCard>
						</ChartGrid>
						<LabeledDivider>Scatter Plots</LabeledDivider>
						<ChartGrid>
							<ChartCard title="Simple Scatter Plot" description="Sales by event">
								<SimpleScatterChart
									slotProps={{ legend: { hidden: true } }}
									yAxis={[{
										valueFormatter: (value) => `$${formatAbbreviatedNumber(value)}`,
									}]}
									series={[
										{
											label: "All Events",
											data: DUMMY_EVENTS.map((ev) => ({
												id: ev.event_name,
												x: ev.count_signed_up,
												y: ev.cost_per_ticket * ev.count_signed_up,
											})),
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Scatter Plot + Legend" description="Event sales">
								<SimpleScatterChart
									slotProps={{ legend: { hidden: false } }}
									margin={{ top: 40 }}
									yAxis={[{
										valueFormatter: (value) => `$${formatAbbreviatedNumber(value)}`,
									}]}
									series={[
										{
											label: "All Events",
											data: DUMMY_EVENTS.map((ev) => ({
												id: ev.event_name,
												x: ev.count_signed_up,
												y: ev.cost_per_ticket * ev.count_signed_up,
											})),
										},
									]}
								/>
							</ChartCard>
							<ChartCard title="Plain Scatter Plot" description="Ticket Prices by # Purchased">
								<SimpleScatterChart
									slotProps={{ legend: { hidden: true } }}
									xAxis={[{
										valueFormatter: (value) => `$${formatAbbreviatedNumber(value)}`,
									}]}
									grid={{ vertical: false, horizontal: false }}
									series={[
										{
											label: "All Events",
											data: DUMMY_EVENTS.map((ev) => ({
												id: ev.event_name,
												x: ev.cost_per_ticket * ev.count_signed_up,
												y: ev.count_signed_up,
											})),
										},
									]}
								/>
							</ChartCard>
						</ChartGrid>
					</>;
				})()}
			</PageContainer>

			{/* --- Events Dashboard --- */}
			<Divider sx={{ my: 4 }}>Events Dashboard</Divider>
			{/* This is the Events dashboard component, inlined. */}
			<PageContainer>
				<DashboardHeader
					title="Events"
					actions={
						<>
							<Button startIcon={<TbPlus />} variant="contained" onClick={newEventDisclosure.onOpen}>
								New Event
							</Button>
							<SimpleDrawer
								title="New Event"
								disclosure={newEventDisclosure}
								onSubmit={() => {
									newEventDisclosure.onClose();
									// Simulate async event creation
									setTimeout(() => {}, 2000);
								}}
							>
								<Stack spacing={3}>
									<FormControl>
										<FormLabel id="name-label">Event Name</FormLabel>
										<FilledInput aria-labelledby="name-label" />
									</FormControl>
									<FormControl sx={{ width: "100%" }}>
										<FormLabel id="description-label">Description</FormLabel>
										<Box component={TextareaAutosize} aria-labelledby="description-label" maxLength={450} sx={{ minHeight: 50, borderRadius: 1, border: (theme) => `1px solid ${theme.palette.gray["300"]}`, boxShadow: 1, padding: 1, fontFamily: "Inter", resize: "vertical", "&:focus": { outline: "none", borderColor: "primary.400" } }} />
									</FormControl>
									<FormControl>
										<FormLabel id="date-label">Date</FormLabel>
										{/* DatePicker may need to be replaced with a simple input if not available */}
										<FilledInput aria-labelledby="date-label" placeholder="Select date" />
									</FormControl>
									<FormControl>
										<FormLabel>Image</FormLabel>
										<FileUpload />
									</FormControl>
									<FormControl>
										<FormLabel id="visibility-radio-buttons-label">Visibility</FormLabel>
										<RadioGroup aria-labelledby="visibility-radio-buttons-label" defaultValue="private" sx={{ gap: 1.5, ".MuiFormControlLabel-root": { ".MuiRadio-root": { alignSelf: "flex-start" }, ".MuiTypography-root": { marginTop: 0.75 } } }}>
											<FormControlLabel value="private" control={<Radio />} label={<Stack><Box>Private</Box><Box sx={{ color: "gray.500", fontSize: "sm" }}>Only visible to you</Box></Stack>} />
											<FormControlLabel value="private_to_admin" control={<Radio />} label={<Stack><Box>Private to Admins</Box><Box sx={{ color: "gray.500", fontSize: "sm" }}>Only event admins can view and edit</Box></Stack>} />
											<FormControlLabel value="public" control={<Radio />} label={<Stack><Box>Public</Box><Box sx={{ color: "gray.500", fontSize: "sm" }}>Visible to all users</Box></Stack>} />
										</RadioGroup>
									</FormControl>
								</Stack>
							</SimpleDrawer>
						</>
					}
				/>
				<Stack>
					<Tabs value={tabValue} onChange={handleTabChange}>
						<Tab label="All" {...a11yProps(0)} />
						<Tab label="Live" {...a11yProps(1)} />
						<Tab label="Upcoming" {...a11yProps(2)} />
						<Tab label="Past" {...a11yProps(3)} />
					</Tabs>
					<MuiDivider />
				</Stack>
				<CustomTabPanel value={tabValue} index={0}><EventGrid events={DUMMY_EVENTS} /></CustomTabPanel>
				<CustomTabPanel value={tabValue} index={1}><EventGrid events={liveEvents} /></CustomTabPanel>
				<CustomTabPanel value={tabValue} index={2}><EventGrid events={upcomingEvents} /></CustomTabPanel>
				<CustomTabPanel value={tabValue} index={3}><EventGrid events={pastEvents} /></CustomTabPanel>
			</PageContainer>

			{/* --- Orders Dashboard --- */}
			<Divider sx={{ my: 4 }}>Orders Dashboard</Divider>
			{/* This is the Orders dashboard component, inlined. */}
			<PageContainer>
				<DashboardHeader
					title="Orders"
					actions={<Button variant="contained" color="primary" endIcon={<TbDownload />}>Export</Button>}
				/>
				<Stack spacing={3} sx={{ flex: 1 }}>
					<OrdersTable allowCheckboxSelection />
				</Stack>
			</PageContainer>

			{/* --- Speakers Dashboard --- */}
			<Divider sx={{ my: 4 }}>Speakers Dashboard</Divider>
			{/* This is the Speakers dashboard component, inlined. */}
			<PageContainer>
				<DashboardHeader
					title="Speakers"
					actions={<Button variant="contained" color="primary" startIcon={<TbPlus />}>New Speaker</Button>}
				/>
				<Stack spacing={3} sx={{ flex: 1 }}>
					<SpeakersList />
				</Stack>
			</PageContainer>
		</Box>
	);
}
export { KitDemo };