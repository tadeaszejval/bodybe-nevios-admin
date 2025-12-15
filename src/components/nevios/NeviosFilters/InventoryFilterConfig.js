"use client";
import { FilterLocationSelect } from './FilterLocationSelect';
import { FilterNumericOperator } from './FilterNumericOperator';

/**
 * Inventory Filter Configuration
 * Defines available filters for the inventory table
 */

/**
 * Inventory Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key prefix)
 * - label: display name
 * - component: React component to render
 * - props: additional props for the component
 * 
 * Note: For numeric operators, the actual filter key is constructed dynamically
 * based on the operator (e.g., 'available_gt', 'available_lt', 'available_eq')
 */
export const INVENTORY_FILTER_CONFIG = [
  {
    id: 'location',
    label: 'Location',
    component: FilterLocationSelect,
    props: {
      placeholder: 'All locations'
    }
  },
  {
    id: 'available',
    label: 'Available Quantity',
    component: FilterNumericOperator,
    props: {
      placeholder: 'Enter quantity...',
      fieldPrefix: 'available'
    }
  },
  {
    id: 'reserved',
    label: 'Reserved Quantity',
    component: FilterNumericOperator,
    props: {
      placeholder: 'Enter quantity...',
      fieldPrefix: 'reserved'
    }
  },
  {
    id: 'quantity',
    label: 'Total Quantity',
    component: FilterNumericOperator,
    props: {
      placeholder: 'Enter quantity...',
      fieldPrefix: 'quantity'
    }
  }
];

