"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterDateRange } from './FilterDateRange';

// Return status options
export const RETURN_STATUS_OPTIONS = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'INSPECTED', label: 'Inspected' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

// Return type options
export const RETURN_TYPE_OPTIONS = [
  { value: 'RETURN', label: 'Return' },
  { value: 'EXCHANGE', label: 'Exchange' }
];

// Return reason options
export const RETURN_REASON_OPTIONS = [
  { value: 'DEFECTIVE', label: 'Defective' },
  { value: 'SIZE_FIT', label: 'Size/Fit Issue' },
  { value: 'WRONG_ITEM', label: 'Wrong Item' },
  { value: 'NOT_AS_DESCRIBED', label: 'Not As Described' },
  { value: 'CHANGED_MIND', label: 'Changed Mind' },
  { value: 'OTHER', label: 'Other' }
];

// Return resolution options
export const RETURN_RESOLUTION_OPTIONS = [
  { value: 'REFUND', label: 'Refund' },
  { value: 'EXCHANGE', label: 'Exchange' },
  { value: 'STORE_CREDIT', label: 'Store Credit' }
];

// Refund processed options
export const REFUND_PROCESSED_OPTIONS = [
  { value: 'true', label: 'Processed' },
  { value: 'false', label: 'Pending' }
];

// Returns filter configuration
export const RETURNS_FILTER_CONFIG = [
  {
    id: 'created_at',
    label: 'Request Date',
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
    options: RETURN_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'type',
    label: 'Type',
    component: FilterSelect,
    options: RETURN_TYPE_OPTIONS,
    props: {
      placeholder: 'All types'
    }
  },
  {
    id: 'reason',
    label: 'Reason',
    component: FilterMultipleSelect,
    options: RETURN_REASON_OPTIONS,
    props: {
      placeholder: 'All reasons',
      maxDisplayChips: 2
    }
  },
  {
    id: 'resolution',
    label: 'Resolution',
    component: FilterMultipleSelect,
    options: RETURN_RESOLUTION_OPTIONS,
    props: {
      placeholder: 'All resolutions',
      maxDisplayChips: 2
    }
  },
  {
    id: 'refund_processed',
    label: 'Refund Status',
    component: FilterSelect,
    options: REFUND_PROCESSED_OPTIONS,
    props: {
      placeholder: 'All'
    }
  }
];
