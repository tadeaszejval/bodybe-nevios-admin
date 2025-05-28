"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterContains } from './FilterContains';

/**
 * Fulfillments Filter Configuration
 * Defines available filters for the fulfillments table
 */

// Fulfillment Status Filter Options
const FULFILLMENT_STATUS_OPTIONS = [
  { value: 'UNFULFILLED', label: 'Unfulfilled' },
  { value: 'FULFILLED', label: 'Fulfilled' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'PENDING', label: 'Pending' }
];

// Fulfillment Type Filter Options
const FULFILLMENT_TYPE_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
  { value: 'pickup', label: 'Pickup' }
];

// Carrier Name Filter Options
const CARRIER_OPTIONS = [
  { value: 'UPS', label: 'UPS' },
  { value: 'FedEx', label: 'FedEx' },
  { value: 'DHL', label: 'DHL' },
  { value: 'USPS', label: 'USPS' },
  { value: 'Canada Post', label: 'Canada Post' },
  { value: 'Royal Mail', label: 'Royal Mail' }
];

// Delivery Status Filter Options
const DELIVERY_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'RETURNED', label: 'Returned' }
];

// Shipping Type Filter Options
const SHIPPING_TYPE_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
  { value: 'same_day', label: 'Same Day' },
  { value: 'pickup', label: 'Pickup' }
];

/**
 * Fulfillments Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (for select components)
 * - props: additional props for the component
 */
export const FULFILLMENTS_FILTER_CONFIG = [
  {
    id: 'status',
    label: 'Status',
    component: FilterMultipleSelect,
    options: FULFILLMENT_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'type',
    label: 'Type',
    component: FilterSelect,
    options: FULFILLMENT_TYPE_OPTIONS,
    props: {
      placeholder: 'All types'
    }
  },
  {
    id: 'carrier_name',
    label: 'Carrier',
    component: FilterSelect,
    options: CARRIER_OPTIONS,
    props: {
      placeholder: 'All carriers'
    }
  },
  {
    id: 'delivery_status',
    label: 'Delivery Status',
    component: FilterSelect,
    options: DELIVERY_STATUS_OPTIONS,
    props: {
      placeholder: 'All delivery statuses'
    }
  },
  {
    id: 'shipping_type',
    label: 'Shipping Type',
    component: FilterSelect,
    options: SHIPPING_TYPE_OPTIONS,
    props: {
      placeholder: 'All shipping types'
    }
  },
  {
    id: 'tracking',
    label: 'Tracking Number',
    component: FilterContains,
    props: {
      placeholder: 'Enter tracking number...',
      debounceMs: 500
    }
  },
  {
    id: 'name',
    label: 'Fulfillment Name',
    component: FilterContains,
    props: {
      placeholder: 'Enter fulfillment name...',
      debounceMs: 500
    }
  }
];

// Export individual filter configs for flexibility
export {
  FULFILLMENT_STATUS_OPTIONS,
  FULFILLMENT_TYPE_OPTIONS,
  CARRIER_OPTIONS,
  DELIVERY_STATUS_OPTIONS,
  SHIPPING_TYPE_OPTIONS
}; 