"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterContains } from './FilterContains';
import { FilterProductTypeSelect } from './FilterProductTypeSelect';
import { FilterVendorSelect } from './FilterVendorSelect';

/**
 * Products Filter Configuration
 * Defines available filters for the products table based on query-products API
 */

// Product Status Filter Options
const PRODUCT_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' }
];

// Product Type Filter Options - Now fetched dynamically from database
// const PRODUCT_TYPE_OPTIONS = [
//   { value: 'physical', label: 'Physical' },
//   { value: 'digital', label: 'Digital' },
//   { value: 'service', label: 'Service' },
//   { value: 'gift_card', label: 'Gift Card' }
// ];

// Product Category Filter Options
const PRODUCT_CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'toys', label: 'Toys & Games' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'food', label: 'Food & Beverages' }
];

// Vendor Options - Now fetched dynamically from database
// const VENDOR_OPTIONS = [
//   { value: 'Botas', label: 'Botas' },
//   { value: 'Vasky', label: 'Vasky' }
// ];

/**
 * Products Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (for select components)
 * - props: additional props for the component
 */
export const PRODUCTS_FILTER_CONFIG = [
  {
    id: 'status',
    label: 'Status',
    component: FilterMultipleSelect,
    options: PRODUCT_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'type',
    label: 'Type',
    component: FilterProductTypeSelect,
    props: {
      placeholder: 'All types',
      maxDisplayChips: 2
    }
  },
  {
    id: 'vendor',
    label: 'Vendor',
    component: FilterVendorSelect,
    props: {
      placeholder: 'All vendors'
    }
  },
  {
    id: 'title',
    label: 'Title',
    component: FilterContains,
    props: {
      placeholder: 'Enter product title...',
      debounceMs: 500
    }
  },
  {
    id: 'handle',
    label: 'Handle',
    component: FilterContains,
    props: {
      placeholder: 'Enter product handle...',
      debounceMs: 500
    }
  },
  {
    id: 'tags',
    label: 'Tags',
    component: FilterContains,
    props: {
      placeholder: 'Enter tags...',
      debounceMs: 500
    }
  }
];

// Export individual filter configs for flexibility
export {
  PRODUCT_STATUS_OPTIONS,
  // PRODUCT_TYPE_OPTIONS, // Now dynamic - fetched from database
  PRODUCT_CATEGORY_OPTIONS,
  // VENDOR_OPTIONS // Now dynamic - fetched from database
}; 