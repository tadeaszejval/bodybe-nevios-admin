"use client";
import { Box, Popover, Stack, Typography, IconButton, Grid } from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import { TbCalendar, TbChevronDown, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { useDisclosure } from "../../hooks/useDisclosure";
import { NeviosSecondaryButton } from "./NeviosButtons";

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
							fontSize: '11px',
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
									height: 32,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									cursor: 'pointer',
									fontSize: '12px',
									fontWeight: isToday ? 600 : 400,
									color: !isInCurrentMonth ? 'gray.400' : 
										   (isRangeStart || isRangeEnd) ? 'white' : 
										   isInRange ? 'gray.900' : 'gray.700',
									backgroundColor: 
										(isRangeStart || isRangeEnd) ? 'primary.main' :
										isInRange ? 'primary.50' : 'transparent',
									borderRadius: (isRangeStart || isRangeEnd) ? '6px' : '0px',
									border: isToday && !isInRange ? '1px solid' : 'none',
									borderColor: isToday && !isInRange ? 'primary.main' : 'transparent',
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
 */
export function NeviosDatePicker({
	value = [dayjs().subtract(30, "day"), dayjs()],
	onChange,
	placeholder = "Select date range",
	disabled = false,
	presets = null,
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
		return `${value[0].format("MMM D, YYYY")} — ${value[1].format("MMM D, YYYY")}`;
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
						flexDirection: "row",
						borderRadius: "12px",
						overflow: "hidden",
					},
				}}
			>
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
						gap: 0.5,
						padding: 1.5,
						borderLeft: (theme) => `1px solid ${theme.palette.gray["200"]}`,
						minWidth: 160,
						backgroundColor: "gray.50",
					}}
				>
					<Typography 
						variant="subtitle2" 
						sx={{ 
							fontWeight: 600, 
							mb: 0.5,
							fontSize: "12px",
							color: "gray.700",
							textTransform: "uppercase",
							letterSpacing: "0.5px"
						}}
					>
						Quick Select
					</Typography>
					<Stack spacing={0.25}>
						{presetOptions.map((preset) => (
							<NeviosSecondaryButton
								key={preset.label}
								onClick={() => handlePresetClick(preset)}
								size="small"
								sx={{
									justifyContent: "flex-start",
									fontSize: "12px",
									fontWeight: 400,
									height: "28px",
									backgroundColor: "transparent",
									"&:hover": {
										backgroundColor: "white",
									},
								}}
							>
								{preset.label}
							</NeviosSecondaryButton>
						))}
					</Stack>

					{/* Action Buttons */}
					<Box sx={{ mt: 2, pt: 1.5, borderTop: (theme) => `1px solid ${theme.palette.gray["200"]}` }}>
						<Stack spacing={0.5}>
							<NeviosSecondaryButton
								onClick={handleCancel}
								size="small"
								sx={{
									fontSize: "12px",
									fontWeight: 400,
									height: "32px",
									backgroundColor: "transparent",
									"&:hover": {
										backgroundColor: "white",
									},
								}}
							>
								Cancel
							</NeviosSecondaryButton>
							<NeviosSecondaryButton
								onClick={handleApply}
								size="small"
								sx={{
									fontSize: "12px",
									fontWeight: 600,
									height: "32px",
									backgroundColor: "primary.main",
									color: "white",
									"&:hover": {
										backgroundColor: "primary.dark",
									},
								}}
							>
								Apply
							</NeviosSecondaryButton>
						</Stack>
					</Box>
				</Box>
			</Popover>
		</>
	);
}