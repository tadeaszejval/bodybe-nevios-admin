"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterContains } from './FilterContains';

/**
 * Customers Filter Configuration
 * Defines available filters for the customers table
 */

// Gender Filter Options (based on GenderBadge.jsx)
const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NOT_FOUND', label: 'Not Found' }
];

// Country Filter Options (common countries)
const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'AU', label: 'Australia' },
  { value: 'JP', label: 'Japan' }
];

// Account Status Filter Options
const ACCOUNT_STATUS_OPTIONS = [
  { value: true, label: 'Enabled' },
  { value: false, label: 'Disabled' }
];

// Subscription Status Filter Options
const SUBSCRIPTION_OPTIONS = [
  { value: true, label: 'Subscribed' },
  { value: false, label: 'Not Subscribed' }
];

/**
 * Customers Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (for select components)
 * - props: additional props for the component
 */
export const CUSTOMERS_FILTER_CONFIG = [
  {
    id: 'email',
    label: 'Email',
    component: FilterContains,
    props: {
      placeholder: 'Enter email address...',
      debounceMs: 500
    }
  },
  {
    id: 'phone',
    label: 'Phone',
    component: FilterContains,
    props: {
      placeholder: 'Enter phone number...',
      debounceMs: 500
    }
  },
  {
    id: 'first_name',
    label: 'First Name',
    component: FilterContains,
    props: {
      placeholder: 'Enter first name...',
      debounceMs: 500
    }
  },
  {
    id: 'last_name',
    label: 'Last Name',
    component: FilterContains,
    props: {
      placeholder: 'Enter last name...',
      debounceMs: 500
    }
  },
  {
    id: 'gender',
    label: 'Gender',
    component: FilterSelect,
    options: GENDER_OPTIONS,
    props: {
      placeholder: 'All genders'
    }
  },
  {
    id: 'country',
    label: 'Country',
    component: FilterSelect,
    options: COUNTRY_OPTIONS,
    props: {
      placeholder: 'All countries'
    }
  },
  {
    id: 'account_enabled',
    label: 'Account Status',
    component: FilterSelect,
    options: ACCOUNT_STATUS_OPTIONS,
    props: {
      placeholder: 'All accounts'
    }
  },
  {
    id: 'subscribed',
    label: 'Newsletter',
    component: FilterSelect,
    options: SUBSCRIPTION_OPTIONS,
    props: {
      placeholder: 'All subscribers'
    }
  }
];

// Export individual filter configs for flexibility
export {
  GENDER_OPTIONS,
  COUNTRY_OPTIONS,
  ACCOUNT_STATUS_OPTIONS,
  SUBSCRIPTION_OPTIONS
}; 