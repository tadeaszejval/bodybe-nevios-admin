"use client";
import { Box, Popover, Stack, Typography, IconButton, Grid, Button } from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import { TbCalendar, TbChevronDown, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useDisclosure } from "../../hooks/useDisclosure";
import { NeviosPrimaryButton, NeviosSecondaryButton } from "./NeviosButtons";

// Helper function to convert date range to API format
export const formatDateRange = (dateRange) => {
  return {
    date_from: dateRange[0].format('YYYY-MM-DD'),
    date_to: dateRange[1].format('YYYY-MM-DD')
  };
};

// Custom Calendar Component
function CustomCalendar({ value, onChange, currentMonth, onMonthChange }) {
	const startOfMonth = currentMonth.startOf('month');
	const endOfMonth = currentMonth.endOf('month');
	const startOfWeek = startOfMonth.startOf('week');
	const endOfWeek = endOfMonth.endOf('week');
	
	const days = [];
	let day = startOfWeek;
	
	while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
		days.push(day);
		day = day.add(1, 'day');
	}

	const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

	const handleDayClick = (clickedDay) => {
		if (!value || !value[0] || !value[1]) {
			// No selection yet, start new selection
			onChange([clickedDay, clickedDay]);
		} else if (value[0] && value[1] && (value[0].isSame(value[1], 'day'))) {
			// Single date selected, extend to range
			if (clickedDay.isBefore(value[0])) {
				onChange([clickedDay, value[0]]);
			} else {
				onChange([value[0], clickedDay]);
			}
		} else {
			// Range already selected, start new selection
			onChange([clickedDay, clickedDay]);
		}
	};

	const isDayInRange = (day) => {
		if (!value || !value[0] || !value[1]) return false;
		return day.isBetween(value[0], value[1], 'day', '[]');
	};

	const isDayRangeStart = (day) => {
		return value && value[0] && day.isSame(value[0], 'day');
	};

	const isDayRangeEnd = (day) => {
		return value && value[1] && day.isSame(value[1], 'day');
	};

	const isDayInCurrentMonth = (day) => {
		return day.isSame(currentMonth, 'month');
	};

	return (
		<Box sx={{ width: 280, p: 2 }}>
			{/* Calendar Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
				<IconButton 
					size="small" 
					onClick={() => onMonthChange(currentMonth.subtract(1, 'month'))}
					sx={{ color: 'gray.600' }}
				>
					<TbChevronLeft size={16} />
				</IconButton>
				<Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '14px' }}>
					{currentMonth.format('MMMM YYYY')}
				</Typography>
				<IconButton 
					size="small" 
					onClick={() => onMonthChange(currentMonth.add(1, 'month'))}
					sx={{ color: 'gray.600' }}
				>
					<TbChevronRight size={16} />
				</IconButton>
			</Box>

			{/* Week Days Header */}
			<Grid container spacing={0} sx={{ mb: 1 }}>
				{weekDays.map((weekDay) => (
					<Grid item xs={12/7} key={weekDay}>
						<Box sx={{ 
							textAlign: 'center', 
							py: 0.5,
							fontSize: '12px',
							fontWeight: 500,
							color: 'gray.600'
						}}>
							{weekDay}
						</Box>
					</Grid>
				))}
			</Grid>

			{/* Calendar Days */}
			<Grid container spacing={0}>
				{days.map((day, index) => {
					const isInRange = isDayInRange(day);
					const isRangeStart = isDayRangeStart(day);
					const isRangeEnd = isDayRangeEnd(day);
					const isInCurrentMonth = isDayInCurrentMonth(day);
					const isToday = day.isSame(dayjs(), 'day');

					return (
						<Grid item xs={12/7} key={index}>
							<Box
								onClick={() => handleDayClick(day)}
								sx={{
									height: 38,
									width: 38,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									fontSize: '13px',
									fontWeight: isToday ? 600 : 400,
									color: !isInCurrentMonth ? 'gray.400' : 
										   (isRangeStart || isRangeEnd) ? 'white' : 
										   isInRange ? 'gray.900' : 'gray.700',
									backgroundColor: 
										(isRangeStart || isRangeEnd) ? 'primary.main' :
										isInRange ? 'primary.50' : 'transparent',
									borderRadius: (isRangeStart || isRangeEnd) ? '8px' : '8px',
									border: isToday && !isInRange ? '1px solid' : 'none',
									borderColor: isToday && !isInRange ? 'primary.200' : 'transparent',
									'&:hover': {
										backgroundColor: 
											(isRangeStart || isRangeEnd) ? 'primary.dark' :
											isInRange ? 'primary.100' : 'gray.100',
									},
								}}
							>
								{day.format('D')}
							</Box>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
}

/**
 * NeviosDatePicker - A date range picker component with preset options
 * @param {Object} props - Component props
 * @param {Array} props.value - Current date range [startDate, endDate]
 * @param {Function} props.onChange - Callback when date range changes
 * @param {string} props.placeholder - Placeholder text when no dates selected
 * @param {boolean} props.disabled - Whether the picker is disabled
 * @param {Array} props.presets - Custom preset options
 * @param {string} props.label - Optional label to show instead of calendar icon
 */
export function NeviosDatePicker({
	value = [dayjs().subtract(30, "day"), dayjs()],
	onChange,
	placeholder = "Select date range",
	disabled = false,
	presets = null,
	label = null,
	...props
}) {
	const dateDisclosure = useDisclosure({
		provideAnchorEl: true,
	});

	const [currentMonth, setCurrentMonth] = React.useState(dayjs());
	const [tempValue, setTempValue] = React.useState(value);

	// Default preset options
	const defaultPresets = [
		{
			label: "Today",
			getValue: () => [dayjs(), dayjs()],
		},
		{
			label: "Yesterday",
			getValue: () => [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")],
		},
		{
			label: "Last 7 days",
			getValue: () => [dayjs().subtract(7, "day"), dayjs()],
		},
		{
			label: "Last 30 days",
			getValue: () => [dayjs().subtract(30, "day"), dayjs()],
		},
		{
			label: "Last 90 days",
			getValue: () => [dayjs().subtract(90, "day"), dayjs()],
		},
		{
			label: "Last 365 days",
			getValue: () => [dayjs().subtract(365, "day"), dayjs()],
		},
		{
			label: "Last month",
			getValue: () => [
				dayjs().subtract(1, "month").startOf("month"),
				dayjs().subtract(1, "month").endOf("month"),
			],
		},
		{
			label: "Last 12 months",
			getValue: () => [dayjs().subtract(12, "month"), dayjs()],
		},
		{
			label: "Last year",
			getValue: () => [
				dayjs().subtract(1, "year").startOf("year"),
				dayjs().subtract(1, "year").endOf("year"),
			],
		},
	];

	const presetOptions = presets || defaultPresets;

	const handlePresetClick = (preset) => {
		const newValue = preset.getValue();
		setTempValue(newValue);
	};

	const handleCalendarChange = (newValue) => {
		setTempValue(newValue);
	};

	const handleApply = () => {
		onChange?.(tempValue);
		dateDisclosure.onClose();
	};

	const handleCancel = () => {
		setTempValue(value);
		dateDisclosure.onClose();
	};

	// Update tempValue when value prop changes
	React.useEffect(() => {
		setTempValue(value);
	}, [value]);

	const formatDateRange = () => {
		if (!value || !value[0] || !value[1]) {
			return placeholder;
		}

		const startDate = value[0];
		const endDate = value[1];
		const today = dayjs();
		const yesterday = dayjs().subtract(1, 'day');

		// Check for special cases
		if (startDate.isSame(endDate, 'day')) {
			if (startDate.isSame(today, 'day')) {
				return "Today";
			} else if (startDate.isSame(yesterday, 'day')) {
				return "Yesterday";
			} else {
				return startDate.format("MMM D, YYYY");
			}
		}

		// Check for common preset periods
		const daysDiff = endDate.diff(startDate, 'day') + 1; // +1 to include both start and end days
		
		// Check if endDate is today or yesterday
		const isEndingToday = endDate.isSame(today, 'day');
		const isEndingYesterday = endDate.isSame(yesterday, 'day');
		
		if (isEndingToday || isEndingYesterday) {
			// Common day ranges ending today or yesterday
			if (daysDiff === 7) return "Last 7 days";
			if (daysDiff === 14) return "Last 14 days";
			if (daysDiff === 30) return "Last 30 days";
			if (daysDiff === 90) return "Last 90 days";
			if (daysDiff === 365) return "Last 365 days";
		}

		// Check for last month
		const lastMonthStart = today.subtract(1, 'month').startOf('month');
		const lastMonthEnd = today.subtract(1, 'month').endOf('month');
		if (startDate.isSame(lastMonthStart, 'day') && endDate.isSame(lastMonthEnd, 'day')) {
			return "Last month";
		}

		// Check for last week (Monday to Sunday)
		const lastWeekStart = today.subtract(1, 'week').startOf('week').add(1, 'day'); // Monday
		const lastWeekEnd = today.subtract(1, 'week').endOf('week').add(1, 'day'); // Sunday
		if (startDate.isSame(lastWeekStart, 'day') && endDate.isSame(lastWeekEnd, 'day')) {
			return "Last week";
		}

		// Check for last quarter
		const lastQuarterStart = today.subtract(1, 'quarter').startOf('quarter');
		const lastQuarterEnd = today.subtract(1, 'quarter').endOf('quarter');
		if (startDate.isSame(lastQuarterStart, 'day') && endDate.isSame(lastQuarterEnd, 'day')) {
			return "Last quarter";
		}

		// Check for last year
		const lastYearStart = today.subtract(1, 'year').startOf('year');
		const lastYearEnd = today.subtract(1, 'year').endOf('year');
		if (startDate.isSame(lastYearStart, 'day') && endDate.isSame(lastYearEnd, 'day')) {
			return "Last year";
		}

		// Check for last 12 months (approximately)
		if (daysDiff >= 360 && daysDiff <= 370) {
			return "Last 12 months";
		}

		// Check if both dates are in the same year
		if (startDate.isSame(endDate, 'year')) {
			// Check if both dates are in the same month
			if (startDate.isSame(endDate, 'month')) {
				return `${startDate.format("D")} - ${endDate.format("D MMM YYYY")}`;
			} else {
				return `${startDate.format("D MMM")} - ${endDate.format("D MMM YYYY")}`;
			}
		}

		// Default format for different years
		return `${startDate.format("MMM D, YYYY")} — ${endDate.format("MMM D, YYYY")}`;
	};

	return (
		<>
			<NeviosSecondaryButton
				iconBefore={label ? null : <TbCalendar size={16} />}
				iconAfter={
					<TbChevronDown
						size={14}
						style={{
							transform: dateDisclosure.isOpen
								? "rotate(180deg)"
								: "rotate(0deg)",
							transition: "transform 0.2s ease-in-out",
						}}
					/>
				}
				onClick={dateDisclosure.onOpen}
				disabled={disabled}
				{...props}
			>
				{label && (
					<Box component="span" sx={{ mr: '2px', fontWeight: 500 }}>
						{label}
					</Box>
				)}
				{formatDateRange()}
			</NeviosSecondaryButton>

			<Popover
				open={dateDisclosure.isOpen}
				anchorEl={dateDisclosure.anchorEl}
				onClose={dateDisclosure.onClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				sx={{
					mt: 0.5,
					".MuiPaper-root": {
						boxShadow: 2,
						display: "flex",
						flexDirection: "column",
						borderRadius: "12px",
						overflow: "hidden",
					},
				}}
			>
				{/* Top Section: Calendar and Presets Side by Side */}
				<Box sx={{ display: "flex", flexDirection: "row" }}>
					{/* Calendar Section */}
					<CustomCalendar
						value={tempValue}
						onChange={handleCalendarChange}
						currentMonth={currentMonth}
						onMonthChange={setCurrentMonth}
					/>

					{/* Preset Options Section */}
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 1,
							px: 0.5,
							py: 1,
							borderLeft: (theme) => `1px solid ${theme.palette.gray["200"]}`,
							minWidth: 200,
							backgroundColor: "white",
						}}
					>
						<Stack spacing={1}>
							{presetOptions.map((preset) => (
								<Button
									key={preset.label}
									onClick={() => handlePresetClick(preset)}
									variant="text"
									size="small"
									sx={{
										justifyContent: "flex-start",
										fontSize: "13px",
										fontWeight: 400,
										height: "28px",
										textTransform: "none",
										color: "gray.700",
										backgroundColor: "transparent",
										minWidth: "auto",
										padding: "4px 12px",
										borderRadius: "6px",
										"&:hover": {
											backgroundColor: "gray.200",
											color: "gray.900",
										},
									}}
								>
									{preset.label}
								</Button>
							))}
						</Stack>
					</Box>
				</Box>

				{/* Action Buttons Section - Full Width Bottom */}
				<Box 
					sx={{ 
						display: "flex", 
						justifyContent: "flex-end",
						gap: 0.5, 
						p: 1.5, 
						borderTop: (theme) => `1px solid ${theme.palette.gray["200"]}`,
						backgroundColor: "white",
						width: "100%"
					}}
				>
					<NeviosSecondaryButton
						onClick={handleCancel}
						size="small"
						sx={{
							flex: 1,
							fontSize: "12px",
							fontWeight: 400,
							height: "36px",
							backgroundColor: "transparent",
							border: (theme) => `1px solid ${theme.palette.gray["300"]}`,
							"&:hover": {
								backgroundColor: "gray.50",
							},
						}}
					>
						Cancel
					</NeviosSecondaryButton>
					<NeviosPrimaryButton
						onClick={handleApply}
						size="small"
						sx={{
							flex: 1,
							fontSize: "12px",
							fontWeight: 600,
							height: "36px",
							backgroundColor: "primary.main",
							color: "white",
							"&:hover": {
								backgroundColor: "primary.dark",
							},
						}}
					>
						Apply
					</NeviosPrimaryButton>
				</Box>
			</Popover>
		</>
	);
}

/**
 * NeviosCompareDatePicker - A specialized date picker for comparison periods
 * @param {Object} props - Component props
 * @param {Array} props.value - Current date range [startDate, endDate] or null for no comparison
 * @param {Function} props.onChange - Callback when comparison changes
 * @param {Array} props.baseDateRange - The primary date range to compare against
 * @param {boolean} props.disabled - Whether the picker is disabled
 */
export function NeviosCompareDatePicker({
	value = null,
	onChange,
	baseDateRange = [dayjs().subtract(7, 'day'), dayjs()],
	disabled = false,
	...props
}) {
	const dateDisclosure = useDisclosure({
		provideAnchorEl: true,
	});

	const [currentMonth, setCurrentMonth] = React.useState(dayjs());
	const [tempValue, setTempValue] = React.useState(value);

	// Generate comparison presets based on the base date range
	const getComparisonPresets = () => {
		if (!baseDateRange || !baseDateRange[0] || !baseDateRange[1]) {
			return [];
		}

		const baseStart = baseDateRange[0];
		const baseEnd = baseDateRange[1];
		const daysDiff = baseEnd.diff(baseStart, 'day') + 1;

		return [
			{
				label: "No comparison",
				getValue: () => null,
			},
			{
				label: "Previous period",
				getValue: () => [
					baseStart.subtract(daysDiff, 'day'),
					baseStart.subtract(1, 'day')
				],
			},
			{
				label: "Same period last week",
				getValue: () => [
					baseStart.subtract(7, 'day'),
					baseEnd.subtract(7, 'day')
				],
			},
			{
				label: "Same period last month",
				getValue: () => [
					baseStart.subtract(1, 'month'),
					baseEnd.subtract(1, 'month')
				],
			},
			{
				label: "Same period last quarter",
				getValue: () => [
					baseStart.subtract(3, 'month'),
					baseEnd.subtract(3, 'month')
				],
			},
			{
				label: "Same period last year",
				getValue: () => [
					baseStart.subtract(1, 'year'),
					baseEnd.subtract(1, 'year')
				],
			},
		];
	};

	const presetOptions = getComparisonPresets();

	const handlePresetClick = (preset) => {
		const newValue = preset.getValue();
		setTempValue(newValue);
	};

	const handleCalendarChange = (newValue) => {
		setTempValue(newValue);
	};

	const handleApply = () => {
		onChange?.(tempValue);
		dateDisclosure.onClose();
	};

	const handleCancel = () => {
		setTempValue(value);
		dateDisclosure.onClose();
	};

	// Update tempValue when value prop changes
	React.useEffect(() => {
		setTempValue(value);
	}, [value]);

	const formatComparisonRange = () => {
		if (!value || !value[0] || !value[1]) {
			return "No comparison";
		}

		const startDate = value[0];
		const endDate = value[1];

		// Check if both dates are in the same year
		if (startDate.isSame(endDate, 'year')) {
			// Check if both dates are in the same month
			if (startDate.isSame(endDate, 'month')) {
				return `${startDate.format("D")} - ${endDate.format("D MMM YYYY")}`;
			} else {
				return `${startDate.format("D MMM")} - ${endDate.format("D MMM YYYY")}`;
			}
		}

		// Default format for different years
		return `${startDate.format("MMM D, YYYY")} — ${endDate.format("MMM D, YYYY")}`;
	};

	return (
		<>
			<NeviosSecondaryButton
				iconBefore={<TbCalendar size={16} />}
				iconAfter={
					<TbChevronDown
						size={14}
						style={{
							transform: dateDisclosure.isOpen
								? "rotate(180deg)"
								: "rotate(0deg)",
							transition: "transform 0.2s ease-in-out",
						}}
					/>
				}
				onClick={dateDisclosure.onOpen}
				disabled={disabled}
				{...props}
			>
				<Box component="span" sx={{ mr: '2px', fontWeight: 500 }}>
					Compare to:
				</Box>
				{formatComparisonRange()}
			</NeviosSecondaryButton>

			<Popover
				open={dateDisclosure.isOpen}
				anchorEl={dateDisclosure.anchorEl}
				onClose={dateDisclosure.onClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				sx={{
					mt: 0.5,
					".MuiPaper-root": {
						boxShadow: 2,
						display: "flex",
						flexDirection: "column",
						borderRadius: "12px",
						overflow: "hidden",
					},
				}}
			>
				{/* Top Section: Calendar and Presets Side by Side */}
				<Box sx={{ display: "flex", flexDirection: "row" }}>
					{/* Calendar Section - only show if not "No comparison" */}
					{tempValue && (
						<CustomCalendar
							value={tempValue}
							onChange={handleCalendarChange}
							currentMonth={currentMonth}
							onMonthChange={setCurrentMonth}
						/>
					)}

					{/* Preset Options Section */}
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 1,
							px: 0.5,
							py: 1,
							borderLeft: tempValue ? (theme) => `1px solid ${theme.palette.gray["200"]}` : 'none',
							minWidth: 200,
							backgroundColor: "white",
						}}
					>
						<Stack spacing={1}>
							{presetOptions.map((preset) => (
								<Button
									key={preset.label}
									onClick={() => handlePresetClick(preset)}
									variant="text"
									size="small"
									sx={{
										justifyContent: "flex-start",
										fontSize: "13px",
										fontWeight: 400,
										height: "28px",
										textTransform: "none",
										color: "gray.700",
										backgroundColor: "transparent",
										minWidth: "auto",
										padding: "4px 12px",
										borderRadius: "6px",
										"&:hover": {
											backgroundColor: "gray.200",
											color: "gray.900",
										},
									}}
								>
									{preset.label}
								</Button>
							))}
						</Stack>
					</Box>
				</Box>

				{/* Action Buttons Section - Full Width Bottom */}
				<Box 
					sx={{ 
						display: "flex", 
						justifyContent: "flex-end",
						gap: 0.5, 
						p: 1.5, 
						borderTop: (theme) => `1px solid ${theme.palette.gray["200"]}`,
						backgroundColor: "white",
						width: "100%"
					}}
				>
					<NeviosSecondaryButton
						onClick={handleCancel}
						size="small"
						sx={{
							flex: 1,
							fontSize: "12px",
							fontWeight: 400,
							height: "36px",
							backgroundColor: "transparent",
							border: (theme) => `1px solid ${theme.palette.gray["300"]}`,
							"&:hover": {
								backgroundColor: "gray.50",
							},
						}}
					>
						Cancel
					</NeviosSecondaryButton>
					<NeviosPrimaryButton
						onClick={handleApply}
						size="small"
						sx={{
							flex: 1,
							fontSize: "12px",
							fontWeight: 600,
							height: "36px",
							backgroundColor: "primary.main",
							color: "white",
							"&:hover": {
								backgroundColor: "primary.dark",
							},
						}}
					>
						Apply
					</NeviosPrimaryButton>
				</Box>
			</Popover>
		</>
	);
}