"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';

/**
 * Payments Filter Configuration
 * Defines available filters for the payments table
 */

// Payment Status Filter Options
const PAYMENT_STATUS_OPTIONS = [
  { value: 'PAID', label: 'Paid' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'REFUNDED', label: 'Refunded' }
];

// Payment Type Filter Options
const PAYMENT_TYPE_OPTIONS = [
  { value: 'GATEWAY', label: 'Gateway' },
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'MANUAL', label: 'Manual' }
];

// Currency Filter Options
const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'CZK', label: 'CZK' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CAD', label: 'CAD' },
  { value: 'AUD', label: 'AUD' }
];

/**
 * Payments Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component
 * - props: additional props for the component
 */
export const PAYMENTS_FILTER_CONFIG = [
  {
    id: 'status',
    label: 'Payment Status',
    component: FilterMultipleSelect,
    options: PAYMENT_STATUS_OPTIONS,
    props: {
      placeholder: 'All payment statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'type',
    label: 'Payment Type',
    component: FilterMultipleSelect,
    options: PAYMENT_TYPE_OPTIONS,
    props: {
      placeholder: 'All payment types',
      maxDisplayChips: 2
    }
  },
  {
    id: 'currency',
    label: 'Currency',
    component: FilterSelect,
    options: CURRENCY_OPTIONS,
    props: {
      placeholder: 'All currencies'
    }
  }
];

// Export individual filter configs for flexibility
export {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  CURRENCY_OPTIONS
}; 