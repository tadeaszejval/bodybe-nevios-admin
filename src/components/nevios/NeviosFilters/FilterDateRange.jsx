"use client";
import React, { useState, useEffect } from 'react';
import { Box, Popover, Grid, IconButton, Typography } from '@mui/material';
import { TbCalendar, TbChevronLeft, TbChevronRight, TbX } from 'react-icons/tb';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { NeviosPrimaryButton, NeviosSecondaryButton } from '../NeviosButtons';
import { NeviosTextButton } from '../NeviosButtons';
dayjs.extend(isBetween);

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
      <Grid container spacing={0.25}>
        {days.map((day, index) => {
          const isInRange = isDayInRange(day);
          const isRangeStart = isDayRangeStart(day);
          const isRangeEnd = isDayRangeEnd(day);
          const isInCurrentMonth = isDayInCurrentMonth(day);

          return (
            <Grid item xs={12/7} key={index}>
              <Box
                onClick={() => handleDayClick(day)}
                sx={{
                  height: 36,
                  width: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: !isInCurrentMonth ? 'gray.400' : 
                         (isRangeStart || isRangeEnd) ? 'white' : 
                         isInRange ? 'gray.900' : 'gray.700',
                  backgroundColor: 
                    (isRangeStart || isRangeEnd) ? 'primary.main' :
                    isInRange ? 'primary.100' : 'transparent',
                  borderRadius: '8px',
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
 * Helper function to format date range for display (used by filter bubble)
 * @param {Object} value - Value object with date fields (e.g., {created_at_from: 'YYYY-MM-DD', created_at_to: 'YYYY-MM-DD'})
 * @returns {string} Formatted date range string
 */
export function formatDateRangeLabel(value) {
  if (!value) return '';
  
  // Find the _from and _to fields dynamically (e.g., created_at_from, updated_at_from, etc.)
  const fromKey = Object.keys(value).find(key => key.endsWith('_from'));
  const toKey = Object.keys(value).find(key => key.endsWith('_to'));
  
  if (!fromKey || !toKey || !value[fromKey] || !value[toKey]) {
    return '';
  }

  const startDate = dayjs(value[fromKey]);
  const endDate = dayjs(value[toKey]);
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
  const daysDiff = endDate.diff(startDate, 'day') + 1;
  
  const isEndingToday = endDate.isSame(today, 'day');
  const isEndingYesterday = endDate.isSame(yesterday, 'day');
  
  if (isEndingToday || isEndingYesterday) {
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

  // Check for last week
  const lastWeekStart = today.subtract(1, 'week').startOf('week').add(1, 'day');
  const lastWeekEnd = today.subtract(1, 'week').endOf('week').add(1, 'day');
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

  // Check for last 12 months
  if (daysDiff >= 360 && daysDiff <= 370) {
    return "Last 12 months";
  }

  // Check if both dates are in the same year
  if (startDate.isSame(endDate, 'year')) {
    if (startDate.isSame(endDate, 'month')) {
      return `${startDate.format("D")} - ${endDate.format("D MMM YYYY")}`;
    } else {
      return `${startDate.format("D MMM")} - ${endDate.format("D MMM YYYY")}`;
    }
  }

  // Default format for different years
  return `${startDate.format("MMM D, YYYY")} — ${endDate.format("MMM D, YYYY")}`;
}

/**
 * FilterDateRange - Date range filter component with calendar picker
 * Styled to match NeviosDatePicker for table filters
 * 
 * @param {Object} props
 * @param {Object} props.value - Current value object {from: 'YYYY-MM-DD', to: 'YYYY-MM-DD'}
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.fromLabel - Label for "from" field (default: 'From Date')
 * @param {string} props.toLabel - Label for "to" field (default: 'To Date')
 * @param {string} props.fieldPrefix - API field prefix (e.g., 'created_at', 'updated_at')
 */
export function FilterDateRange({
  value = null,
  onChange,
  fromLabel = 'From Date',
  toLabel = 'To Date',
  fieldPrefix = 'created_at'
}) {
  const dateDisclosure = useDisclosure({ provideAnchorEl: true });
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [tempValue, setTempValue] = useState(null);

  // Convert value to dayjs objects for calendar
  useEffect(() => {
    // Check for the API field names (e.g., created_at_from, created_at_to)
    const fromValue = value?.[`${fieldPrefix}_from`];
    const toValue = value?.[`${fieldPrefix}_to`];
    
    if (fromValue && toValue) {
      setTempValue([dayjs(fromValue), dayjs(toValue)]);
    } else {
      setTempValue(null);
    }
  }, [value, fieldPrefix]);

  const handleCalendarChange = (newValue) => {
    setTempValue(newValue);
  };

  const handleClear = () => {
    setTempValue(null);
    onChange?.(null);
    dateDisclosure.onClose();
  };

  const handleApply = () => {
    if (tempValue && tempValue[0] && tempValue[1]) {
      // Only send the API field names (e.g., created_at_from, created_at_to)
      onChange?.({
        [`${fieldPrefix}_from`]: tempValue[0].format('YYYY-MM-DD'),
        [`${fieldPrefix}_to`]: tempValue[1].format('YYYY-MM-DD')
      });
    } else {
      onChange?.(null);
    }
    dateDisclosure.onClose();
  };

  const formatDateRange = () => {
    // Check for the API field names (e.g., created_at_from, created_at_to)
    const fromValue = value?.[`${fieldPrefix}_from`];
    const toValue = value?.[`${fieldPrefix}_to`];
    
    if (!fromValue || !toValue) {
      return 'Select date range';
    }

    const startDate = dayjs(fromValue);
    const endDate = dayjs(toValue);
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
      <Box
        onClick={dateDisclosure.onOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '35px',
          border: '1px solid',
          borderColor: 'gray.300',
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '13px',
          backgroundColor: 'transparent',
          transition: 'all 0.1s ease-in-out',
          '&:hover': {
            borderColor: 'gray.400',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <TbCalendar size={14} style={{ color: '#6B7280' }} />
          <Typography sx={{ fontSize: '13px', color: value?.from ? 'gray.900' : 'gray.500' }}>
            {formatDateRange()}
          </Typography>
        </Box>
        {value?.from && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            sx={{ 
              padding: 0,
              width: 16,
              height: 16,
              color: 'gray.500',
              '&:hover': {
                color: 'gray.700',
                backgroundColor: 'transparent'
              }
            }}
          >
            <TbX size={14} />
          </IconButton>
        )}
      </Box>

      <Popover
        open={dateDisclosure.isOpen}
        anchorEl={dateDisclosure.anchorEl}
        onClose={dateDisclosure.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          mt: 0.5,
          '.MuiPaper-root': {
            boxShadow: 2,
            borderRadius: '12px',
            overflow: 'hidden',
          },
        }}
      >
        <CustomCalendar
          value={tempValue}
          onChange={handleCalendarChange}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        {/* Action Buttons */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: 1, 
            p: 1.5, 
            borderTop: (theme) => `1px solid ${theme.palette.gray["200"]}`,
            backgroundColor: 'white',
          }}
        >
          <NeviosTextButton
            onClick={handleClear}
            size="small"
            sx={{
              fontSize: '12px',
              fontWeight: 400,
              height: '32px',
            }}
          >
            Clear
          </NeviosTextButton>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <NeviosSecondaryButton
              onClick={dateDisclosure.onClose}
              size="small"
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                height: '32px',
              }}
            >
              Cancel
            </NeviosSecondaryButton>
            <NeviosPrimaryButton
              onClick={handleApply}
              size="small"
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                height: '32px',
              }}
            >
              Apply
            </NeviosPrimaryButton>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
