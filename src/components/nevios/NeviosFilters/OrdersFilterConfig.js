"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterProductSelect } from './FilterProductSelect';
import { FilterContains } from './FilterContains';

/**
 * Orders Filter Configuration
 * Defines available filters for the orders table
 */

// Payment Status Filter Options
const PAYMENT_STATUS_OPTIONS = [
  { value: 'PAID', label: 'Paid' },
  { value: 'UNPAID', label: 'Unpaid' }
];

// Fulfillment Status Filter Options
const FULFILLMENT_STATUS_OPTIONS = [
  { value: 'FULFILLED', label: 'Fulfilled' },
  { value: 'UNFULFILLED', label: 'Unfulfilled' },
  { value: 'PARTIALLY_FULFILLED', label: 'Partially Fulfilled' }
];

// Currency Filter Options
const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'CZK', label: 'CZK' }
];

/**
 * Orders Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component
 * - props: additional props for the component
 */
export const ORDERS_FILTER_CONFIG = [
  {
    id: 'local_currency',
    label: 'Currency',
    component: FilterSelect,
    options: CURRENCY_OPTIONS,
    props: {
      placeholder: 'All currencies'
    }
  },
  {
    id: 'payment_status',
    label: 'Payment Status',
    component: FilterMultipleSelect,
    options: PAYMENT_STATUS_OPTIONS,
    props: {
      placeholder: 'All payment statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'fulfillment_status',
    label: 'Fulfillment Status',
    component: FilterMultipleSelect,
    options: FULFILLMENT_STATUS_OPTIONS,
    props: {
      placeholder: 'All fulfillment statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'products',
    label: 'Products',
    component: FilterProductSelect,
    props: {
      placeholder: 'All products',
      maxDisplayChips: 2
    }
  },
  {
    id: 'product_variant',
    label: 'Product Variant',
    component: FilterContains,
    props: {
      placeholder: 'Enter variant name...',
      debounceMs: 500
    }
  }
];

// Export individual filter configs for flexibility
export {
  PAYMENT_STATUS_OPTIONS,
  FULFILLMENT_STATUS_OPTIONS,
  CURRENCY_OPTIONS
}; 