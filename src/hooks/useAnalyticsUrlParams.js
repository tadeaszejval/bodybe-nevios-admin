"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dayjs from 'dayjs';

/**
 * Custom hook to sync analytics date ranges with URL parameters
 * Persists date range and comparison state across page refreshes
 * 
 * @returns {Object} { dateRange, compareDateRange, updateDateRange, updateCompareDateRange, isInitialized }
 */
export function useAnalyticsUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Default values: Last 7 days with previous period comparison
  const defaultDateRange = [dayjs().subtract(7, 'day'), dayjs()];
  const defaultCompareDateRange = [dayjs().subtract(15, 'day'), dayjs().subtract(8, 'day')];
  
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const [compareDateRange, setCompareDateRange] = useState(defaultCompareDateRange);
  const [compareLabel, setCompareLabel] = useState('Previous period');
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to calculate comparison dates based on preset label
  const calculateComparisonDates = (baseRange, label) => {
    if (!baseRange || !baseRange[0] || !baseRange[1] || !label) return null;
    
    const baseStart = baseRange[0];
    const baseEnd = baseRange[1];
    const daysDiff = baseEnd.diff(baseStart, 'day') + 1;

    switch (label) {
      case 'No comparison':
        return null;
      case 'Previous period':
        return [baseStart.subtract(daysDiff, 'day'), baseStart.subtract(1, 'day')];
      case 'Same period last week':
        return [baseStart.subtract(7, 'day'), baseEnd.subtract(7, 'day')];
      case 'Same period last month':
        return [baseStart.subtract(1, 'month'), baseEnd.subtract(1, 'month')];
      case 'Same period last quarter':
        return [baseStart.subtract(3, 'month'), baseEnd.subtract(3, 'month')];
      case 'Same period last year':
        return [baseStart.subtract(1, 'year'), baseEnd.subtract(1, 'year')];
      default:
        return null;
    }
  };

  // Helper function to check if comparison dates match the label
  const datesMatchLabel = (baseRange, compareRange, label) => {
    if (!label || label === 'No comparison') return true;
    if (!compareRange || !compareRange[0] || !compareRange[1]) return false;
    
    const expectedDates = calculateComparisonDates(baseRange, label);
    if (!expectedDates) return false;
    
    return compareRange[0].isSame(expectedDates[0], 'day') && 
           compareRange[1].isSame(expectedDates[1], 'day');
  };

  // Parse date ranges from URL on mount
  useEffect(() => {
    if (isInitialized) return;

    const dateFromParam = searchParams.get('date_from');
    const dateToParam = searchParams.get('date_to');
    const compareDateFromParam = searchParams.get('compare_date_from');
    const compareDateToParam = searchParams.get('compare_date_to');
    const compareEnabledParam = searchParams.get('compare');
    const compareLabelParam = searchParams.get('compare_label');

    let parsedDateRange = defaultDateRange;
    let parsedCompareRange = null;
    let parsedLabel = null;

    // Parse main date range
    if (dateFromParam && dateToParam) {
      try {
        const from = dayjs(dateFromParam);
        const to = dayjs(dateToParam);
        if (from.isValid() && to.isValid()) {
          parsedDateRange = [from, to];
        }
      } catch (error) {
        console.error('Failed to parse date range from URL:', error);
      }
    }

    // Parse comparison date range
    if (compareEnabledParam === 'false' || compareEnabledParam === '0') {
      parsedCompareRange = null;
      parsedLabel = 'No comparison';
    } else if (compareDateFromParam && compareDateToParam) {
      try {
        const from = dayjs(compareDateFromParam);
        const to = dayjs(compareDateToParam);
        if (from.isValid() && to.isValid()) {
          parsedCompareRange = [from, to];
        }
      } catch (error) {
        console.error('Failed to parse comparison date range from URL:', error);
      }
    }

    // Parse and validate comparison label
    if (compareLabelParam && parsedCompareRange) {
      const decodedLabel = decodeURIComponent(compareLabelParam);
      // Check if the stored dates match what the label would calculate
      if (datesMatchLabel(parsedDateRange, parsedCompareRange, decodedLabel)) {
        parsedLabel = decodedLabel;
      } else {
        // Dates don't match the label, clear the label so dates show
        parsedLabel = null;
      }
    } else if (!parsedCompareRange && !compareDateFromParam) {
      // No comparison params, use default
      parsedCompareRange = defaultCompareDateRange;
      parsedLabel = 'Previous period';
    }

    setDateRange(parsedDateRange);
    setCompareDateRange(parsedCompareRange);
    setCompareLabel(parsedLabel);
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // Update URL when date ranges change
  const updateUrlParams = useCallback((newDateRange, newCompareDateRange, newCompareLabel) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update main date range
    if (newDateRange && newDateRange[0] && newDateRange[1]) {
      params.set('date_from', newDateRange[0].format('YYYY-MM-DD'));
      params.set('date_to', newDateRange[1].format('YYYY-MM-DD'));
    }

    // Update comparison label
    if (newCompareLabel && newCompareLabel !== 'No comparison') {
      params.set('compare_label', encodeURIComponent(newCompareLabel));
    } else {
      params.delete('compare_label');
    }

    // Update comparison date range
    if (newCompareDateRange === null) {
      // Comparison disabled
      params.set('compare', 'false');
      params.delete('compare_date_from');
      params.delete('compare_date_to');
      params.delete('compare_label');
    } else if (newCompareDateRange && newCompareDateRange[0] && newCompareDateRange[1]) {
      // Comparison enabled with dates
      params.delete('compare'); // Remove the 'false' flag if it exists
      params.set('compare_date_from', newCompareDateRange[0].format('YYYY-MM-DD'));
      params.set('compare_date_to', newCompareDateRange[1].format('YYYY-MM-DD'));
    }

    // Use replace to avoid adding to browser history for every change
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Update date range and sync with URL
  const updateDateRange = useCallback((newDateRange) => {
    setDateRange(newDateRange);
    updateUrlParams(newDateRange, compareDateRange, compareLabel);
  }, [compareDateRange, compareLabel, updateUrlParams]);

  // Update comparison date range and sync with URL
  const updateCompareDateRange = useCallback((newCompareDateRange) => {
    setCompareDateRange(newCompareDateRange);
    updateUrlParams(dateRange, newCompareDateRange, compareLabel);
  }, [dateRange, compareLabel, updateUrlParams]);

  // Update comparison label and sync with URL
  const updateCompareLabel = useCallback((newCompareLabel) => {
    setCompareLabel(newCompareLabel);
    updateUrlParams(dateRange, compareDateRange, newCompareLabel);
  }, [dateRange, compareDateRange, updateUrlParams]);

  return {
    dateRange,
    compareDateRange,
    compareLabel,
    updateDateRange,
    updateCompareDateRange,
    updateCompareLabel,
    isInitialized
  };
}
