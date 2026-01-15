"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterContains } from './FilterContains';

/**
 * Discounts Filter Configuration
 * Defines available filters for the discounts table
 */

// Discount Type Filter Options
const DISCOUNT_TYPE_OPTIONS = [
  { value: 'PERCENTAGE', label: 'Percentage' },
  { value: 'FIXED', label: 'Fixed Amount' },
  { value: 'FREE_SHIPPING', label: 'Free Shipping' },
  { value: 'VOUCHER', label: 'Gift Card' }
];

// Discount Status Filter Options
const DISCOUNT_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'USED', label: 'Used' }
];

// Market Currency Filter Options
const MARKET_CURRENCY_OPTIONS = [
  { value: 'USD_US', label: 'USD (US)' },
  { value: 'EUR_DE', label: 'EUR (Germany)' },
  { value: 'EUR_FR', label: 'EUR (France)' },
  { value: 'GBP_UK', label: 'GBP (UK)' },
  { value: 'CZK_CZ', label: 'CZK (Czech)' },
  { value: 'CAD_CA', label: 'CAD (Canada)' }
];

// Availability Filter Options
const AVAILABILITY_OPTIONS = [
  { value: true, label: 'Available' },
  { value: false, label: 'Unavailable' }
];

// Is Voucher Filter Options
const IS_VOUCHER_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' }
];

/**
 * Discounts Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (for select components)
 * - props: additional props for the component
 */
export const DISCOUNTS_FILTER_CONFIG = [
  {
    id: 'discount_type',
    label: 'Type',
    component: FilterMultipleSelect,
    options: DISCOUNT_TYPE_OPTIONS,
    props: {
      placeholder: 'All types',
      maxDisplayChips: 2
    }
  },
  {
    id: 'status',
    label: 'Status',
    component: FilterMultipleSelect,
    options: DISCOUNT_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'market_currency',
    label: 'Market Currency',
    component: FilterSelect,
    options: MARKET_CURRENCY_OPTIONS,
    props: {
      placeholder: 'All markets'
    }
  },
  {
    id: 'available',
    label: 'Availability',
    component: FilterSelect,
    options: AVAILABILITY_OPTIONS,
    props: {
      placeholder: 'All'
    }
  },
  {
    id: 'is_voucher',
    label: 'Is Gift Card',
    component: FilterSelect,
    options: IS_VOUCHER_OPTIONS,
    props: {
      placeholder: 'All'
    }
  },
  {
    id: 'code',
    label: 'Code',
    component: FilterContains,
    props: {
      placeholder: 'Enter discount code...',
      debounceMs: 500
    }
  }
];

// Export individual filter configs for flexibility
export {
  DISCOUNT_TYPE_OPTIONS,
  DISCOUNT_STATUS_OPTIONS,
  MARKET_CURRENCY_OPTIONS,
  AVAILABILITY_OPTIONS,
  IS_VOUCHER_OPTIONS
};

