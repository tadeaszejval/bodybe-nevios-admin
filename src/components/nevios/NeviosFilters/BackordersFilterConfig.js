"use client";
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterDateRange } from './FilterDateRange';

/**
 * Backorders Filter Configuration
 * Defines available filters for the backorders table
 */

// Backorder Status Filter Options
const BACKORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'NOTIFIED', label: 'Notified' },
  { value: 'FULFILLED', label: 'Fulfilled' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

// Auto-Fulfill Filter Options
const AUTO_FULFILL_OPTIONS = [
  { value: 'true', label: 'Auto-Fulfill Enabled' },
  { value: 'false', label: 'Manual Only' }
];

// Customer Notified Filter Options
const CUSTOMER_NOTIFIED_OPTIONS = [
  { value: 'true', label: 'Notified' },
  { value: 'false', label: 'Not Notified' }
];

/**
 * Backorders Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (if applicable)
 * - props: additional props for the component
 */
export const BACKORDERS_FILTER_CONFIG = [
  {
    id: 'created_at',
    label: 'Created Date',
    component: FilterDateRange,
    props: {
      fromLabel: 'From Date',
      toLabel: 'To Date',
      fieldPrefix: 'created_at'
    }
  },
  {
    id: 'status',
    label: 'Status',
    component: FilterMultipleSelect,
    options: BACKORDER_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'auto_fulfill',
    label: 'Auto-Fulfill',
    component: FilterMultipleSelect,
    options: AUTO_FULFILL_OPTIONS,
    props: {
      placeholder: 'All backorders',
      maxDisplayChips: 1
    }
  },
  {
    id: 'customer_notified',
    label: 'Customer Notified',
    component: FilterMultipleSelect,
    options: CUSTOMER_NOTIFIED_OPTIONS,
    props: {
      placeholder: 'All backorders',
      maxDisplayChips: 1
    }
  }
];

// Export individual filter configs for flexibility
export {
  BACKORDER_STATUS_OPTIONS,
  AUTO_FULFILL_OPTIONS,
  CUSTOMER_NOTIFIED_OPTIONS
};
