"use client";
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterDateRange } from './FilterDateRange';

/**
 * Stock Movements Filter Configuration
 * Defines available filters for the stock movements table
 */

// Movement Type Filter Options
const MOVEMENT_TYPE_OPTIONS = [
  { value: 'SALE', label: 'Sale' },
  { value: 'RETURN', label: 'Return' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
  { value: 'TRANSFER', label: 'Transfer' },
  { value: 'RESTOCK', label: 'Restock' },
  { value: 'DAMAGE', label: 'Damage' },
  { value: 'LOSS', label: 'Loss' }
];

/**
 * Stock Movements Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (if applicable)
 * - props: additional props for the component
 */
export const STOCK_MOVEMENTS_FILTER_CONFIG = [
  {
    id: 'created_at',
    label: 'Movement Date',
    component: FilterDateRange,
    props: {
      fromLabel: 'From Date',
      toLabel: 'To Date',
      fieldPrefix: 'created_at'
    }
  },
  {
    id: 'movement_type',
    label: 'Movement Type',
    component: FilterMultipleSelect,
    options: MOVEMENT_TYPE_OPTIONS,
    props: {
      placeholder: 'All movement types',
      maxDisplayChips: 2
    }
  }
];

// Export individual filter configs for flexibility
export { MOVEMENT_TYPE_OPTIONS };
