# Analytics URL Persistence

## Overview

The Analytics dashboard now persists date range and comparison settings in URL parameters, allowing users to refresh the page or share links while maintaining their selected view.

## Implementation

### New Hook: `useAnalyticsUrlParams`

**Location:** `src/hooks/useAnalyticsUrlParams.js`

This custom hook manages analytics-specific URL parameters:
- Main date range (`date_from`, `date_to`)
- Comparison date range (`compare_date_from`, `compare_date_to`)
- Comparison state (`compare` flag)

### Default Settings

**Main Date Range:** Last 7 days
- From: 7 days ago
- To: Today

**Comparison:** Previous period (enabled by default)
- From: 15 days ago
- To: 8 days ago

### URL Parameter Format

When you select date ranges, the URL updates automatically:

```
/dashboard/analytics?date_from=2026-01-11&date_to=2026-01-18&compare_date_from=2026-01-04&compare_date_to=2026-01-11
```

**To disable comparison:**
```
/dashboard/analytics?date_from=2026-01-11&date_to=2026-01-18&compare=false
```

## Features

### 1. Automatic Persistence
- **Page Refresh**: Date ranges are restored from URL
- **Browser Back/Forward**: Settings preserved in history
- **Shareable Links**: Copy URL to share filtered analytics view

### 2. Smart Initialization
- Waits for URL parameters to be parsed before fetching data
- Prevents double-fetching on page load
- Falls back to defaults if URL params are invalid

### 3. Hourly Breakdown Support
The system automatically detects single-day queries and displays hourly data:
- Multi-day range: Shows daily breakdown with dates (e.g., "Jan 17", "Jan 18")
- Single-day range: Shows hourly breakdown with times (e.g., "8 AM", "2 PM", "11 PM")

## Usage

The analytics page automatically manages URL params. Users can:

1. **Change Date Range**: Select new dates in the date picker
   - URL updates immediately
   - Data refreshes automatically
   
2. **Enable/Disable Comparison**: Use the comparison date picker
   - Set dates to enable comparison
   - Clear dates to disable comparison
   
3. **Share View**: Copy the URL from browser
   - Anyone opening the link sees the same date ranges
   - Perfect for sharing specific time period analyses

## Technical Details

### Hook Returns
```javascript
const {
  dateRange,              // [dayjs, dayjs] - Current date range
  compareDateRange,       // [dayjs, dayjs] | null - Comparison range
  updateDateRange,        // (newRange) => void
  updateCompareDateRange, // (newRange) => void
  isInitialized          // boolean - Ready to fetch
} = useAnalyticsUrlParams();
```

### Integration with Analytics Component
```javascript
// 1. Import the hook
import { useAnalyticsUrlParams } from "../../../hooks/useAnalyticsUrlParams";

// 2. Use in component
const {
  dateRange,
  compareDateRange,
  updateDateRange,
  updateCompareDateRange,
  isInitialized
} = useAnalyticsUrlParams();

// 3. Wait for initialization before fetching
useEffect(() => {
  if (!isInitialized) return;
  
  // Fetch analytics data...
}, [dateRange, compareDateRange, isInitialized]);

// 4. Pass to date pickers
<NeviosDatePicker
  value={dateRange}
  onChange={updateDateRange}
/>
<NeviosCompareDatePicker
  value={compareDateRange}
  onChange={updateCompareDateRange}
  baseDateRange={dateRange}
/>
```

## Benefits

1. **Better UX**: Users can bookmark specific analytics views
2. **Collaboration**: Share exact time periods with team members
3. **Debugging**: Easier to reproduce and share specific data views
4. **Consistency**: Same pattern as module table filters

## Files Modified

- **Created:** `src/hooks/useAnalyticsUrlParams.js` - URL params hook
- **Modified:** `src/routes/Dashboard/Analytics/main.jsx` - Integration
  - Added hook usage
  - Changed from local state to URL-backed state
  - Added initialization check to prevent double-fetch
  - Added hourly breakdown support for single-day queries

---

**Last Updated:** January 18, 2026  
**Version:** 1.0
