# URL Filter Persistence

## Overview

Filters in module tables are now automatically synced with URL parameters, allowing filter state to persist across page refreshes and enabling shareable filtered views.

## How It Works

### 1. URL Parameters

When filters are applied, they are encoded in the URL as a query parameter:

```
/dashboard/orders?filters=%7B%22payment_status%22%3A%5B%22PAID%22%5D%2C%22created_at%22%3A%7B%22from%22%3A%222026-01-14%22%2C%22to%22%3A%222026-01-14%22%7D%7D
```

The `filters` parameter contains a JSON-encoded object with all active filters.

### 2. Automatic Persistence

- **Page Refresh**: Filters are restored from the URL
- **Browser Back/Forward**: Filter state is preserved in history
- **Shareable Links**: Copy the URL to share a filtered view with others

## Implementation

### For Module Tables

To enable URL filter persistence in a module table:

```javascript
import { useUrlFilters } from "../../../hooks/useUrlFilters";
import { useModuleQuery } from "../../../hooks/useModuleQuery";

export function YourModuleTable({ initialFilters = {} }) {
  // 1. Use URL filters hook
  const { 
    filters: urlFilters, 
    updateFilters: updateUrlFilters, 
    isInitialized 
  } = useUrlFilters(initialFilters);

  // 2. Pass to useModuleQuery
  const {
    data,
    loading,
    // ... other returns
  } = useModuleQuery('your_module', {
    externalFilters: isInitialized ? urlFilters : initialFilters,
    onFiltersChange: updateUrlFilters,
    autoFetch: isInitialized, // Wait for URL to be parsed
    // ... other options
  });

  // Rest of your component...
}
```

### Key Components

#### `useUrlFilters` Hook

Located in: `src/hooks/useUrlFilters.js`

**Purpose**: Manages filter state synchronized with URL parameters

**Returns**:
- `filters` - Current filter state (parsed from URL)
- `updateFilters(newFilters)` - Update filters and sync to URL
- `clearFilters()` - Clear all filters
- `isInitialized` - Whether URL has been parsed (prevents double-fetch)

**Features**:
- Uses `router.replace()` to avoid cluttering browser history
- Handles JSON encoding/decoding automatically
- Gracefully handles malformed URL parameters

#### `useModuleQuery` Hook Updates

Located in: `src/hooks/useModuleQuery.js`

**New Options**:
- `externalFilters` - External filter state (from URL)
- `onFiltersChange` - External filter change handler (for URL sync)

**Behavior**:
- If `externalFilters` is provided, uses it instead of internal state
- If `onFiltersChange` is provided, calls it instead of internal setState
- Maintains backward compatibility - works without these options

## Filter Format in URL

Filters are stored as JSON with the following structure:

```json
{
  "payment_status": ["PAID", "UNPAID"],
  "created_at": {
    "from": "2026-01-01",
    "to": "2026-01-31",
    "created_at_from": "2026-01-01",
    "created_at_to": "2026-01-31"
  },
  "local_currency": ["USD", "EUR"],
  "products": [123, 456]
}
```

### Filter Types

1. **Array Filters** (multiple select):
   ```json
   "payment_status": ["PAID", "UNPAID"]
   ```

2. **Date Range Filters**:
   ```json
   "created_at": {
     "from": "2026-01-01",
     "to": "2026-01-31",
     "created_at_from": "2026-01-01",
     "created_at_to": "2026-01-31"
   }
   ```

3. **Single Value Filters**:
   ```json
   "product_variant": "SKU-123"
   ```

## Currently Enabled Tables

- ✅ **Orders Table** (`OrdersTable.jsx`)

## To Enable in Other Tables

Follow the implementation pattern in `OrdersTable.jsx`:

1. Import `useUrlFilters` hook
2. Call it with `initialFilters`
3. Pass `urlFilters` and `updateUrlFilters` to `useModuleQuery`
4. Use `isInitialized` to prevent double-fetch

## Benefits

1. **User Experience**:
   - Filters survive page refreshes
   - Browser back/forward works as expected
   - Can bookmark filtered views

2. **Collaboration**:
   - Share filtered views via URL
   - Consistent state across team members

3. **Debugging**:
   - Easy to see active filters in URL
   - Can reproduce user's exact view

## Technical Notes

- Uses Next.js `useSearchParams`, `useRouter`, and `usePathname` hooks
- URL updates use `router.replace()` with `scroll: false` for smooth UX
- Filters are URL-encoded to handle special characters
- Initialization check prevents race conditions with data fetching
