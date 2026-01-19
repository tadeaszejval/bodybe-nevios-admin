"use client";
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterDateRange } from './FilterDateRange';
import { FilterContains } from './FilterContains';

/**
 * Inventory Operations Filter Configuration
 * Defines available filters for the inventory operations table
 */

// Operation Type Filter Options
const OPERATION_TYPE_OPTIONS = [
  { value: 'INTAKE', label: 'Intake' },
  { value: 'OUTBOUND', label: 'Outbound' }
];

// Operation Status Filter Options
const OPERATION_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

// INTAKE Source Type Options
const INTAKE_SOURCE_TYPE_OPTIONS = [
  { value: 'PURCHASE_ORDER', label: 'Purchase Order' },
  { value: 'TRANSFER_IN', label: 'Transfer In' },
  { value: 'CUSTOMER_RETURN', label: 'Customer Return' },
  { value: 'PRODUCTION', label: 'Production' },
  { value: 'FOUND', label: 'Found' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
  { value: 'OTHER', label: 'Other' }
];

// OUTBOUND Source Type Options
const OUTBOUND_SOURCE_TYPE_OPTIONS = [
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'TRANSFER_OUT', label: 'Transfer Out' },
  { value: 'DISPOSAL', label: 'Disposal' },
  { value: 'THEFT', label: 'Theft' },
  { value: 'QUALITY_ISSUE', label: 'Quality Issue' },
  { value: 'DONATION', label: 'Donation' },
  { value: 'SAMPLE', label: 'Sample' },
  { value: 'PROMOTIONAL', label: 'Promotional' },
  { value: 'LOSS', label: 'Loss' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
  { value: 'OTHER', label: 'Other' }
];

// Combined Source Type Options (for when type filter isn't set)
const ALL_SOURCE_TYPE_OPTIONS = [
  ...INTAKE_SOURCE_TYPE_OPTIONS,
  ...OUTBOUND_SOURCE_TYPE_OPTIONS
].sort((a, b) => a.label.localeCompare(b.label));

/**
 * Inventory Operations Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (if applicable)
 * - props: additional props for the component
 */
export const INVENTORY_OPERATIONS_FILTER_CONFIG = [
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
    id: 'type',
    label: 'Operation Type',
    component: FilterMultipleSelect,
    options: OPERATION_TYPE_OPTIONS,
    props: {
      placeholder: 'All types',
      maxDisplayChips: 2
    }
  },
  {
    id: 'status',
    label: 'Status',
    component: FilterMultipleSelect,
    options: OPERATION_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'source_type',
    label: 'Source Type',
    component: FilterMultipleSelect,
    options: ALL_SOURCE_TYPE_OPTIONS,
    props: {
      placeholder: 'All source types',
      maxDisplayChips: 2
    }
  },
  {
    id: 'created_by',
    label: 'Created By',
    component: FilterContains,
    props: {
      placeholder: 'Enter staff name...',
      debounceMs: 500
    }
  },
  {
    id: 'processed_by',
    label: 'Processed By',
    component: FilterContains,
    props: {
      placeholder: 'Enter staff name...',
      debounceMs: 500
    }
  }
];

// Export individual filter configs for flexibility
export {
  OPERATION_TYPE_OPTIONS,
  OPERATION_STATUS_OPTIONS,
  INTAKE_SOURCE_TYPE_OPTIONS,
  OUTBOUND_SOURCE_TYPE_OPTIONS,
  ALL_SOURCE_TYPE_OPTIONS
};
