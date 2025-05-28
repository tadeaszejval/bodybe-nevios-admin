"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterContains } from './FilterContains';

/**
 * Emails Filter Configuration
 * Defines available filters for the emails table
 */

// Email Status Filter Options (based on EmailStatusBadge.jsx)
const EMAIL_STATUS_OPTIONS = [
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'SENT', label: 'Sent' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'DELIVERY_DELAYED', label: 'Delivery Delayed' },
  { value: 'COMPLAINED', label: 'Complained' },
  { value: 'BOUNCED', label: 'Bounced' },
  { value: 'OPENED', label: 'Opened' },
  { value: 'CLICKED', label: 'Clicked' }
];

// Email Domain Filter Options (common domains)
const EMAIL_DOMAIN_OPTIONS = [
  { value: 'seline.cz', label: 'seline.cz' },
  { value: 'gmail.com', label: 'Gmail' },
  { value: 'yahoo.com', label: 'Yahoo' },
  { value: 'outlook.com', label: 'Outlook' },
  { value: 'hotmail.com', label: 'Hotmail' },
  { value: 'icloud.com', label: 'iCloud' }
];

// Sender Name Filter Options (common senders)
const SENDER_NAME_OPTIONS = [
  { value: 'Nevios', label: 'Nevios' },
  { value: 'Support Team', label: 'Support Team' },
  { value: 'Sales Team', label: 'Sales Team' },
  { value: 'Marketing', label: 'Marketing' }
];

/**
 * Emails Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (for select components)
 * - props: additional props for the component
 */
export const EMAILS_FILTER_CONFIG = [
  {
    id: 'status',
    label: 'Email Status',
    component: FilterMultipleSelect,
    options: EMAIL_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
      maxDisplayChips: 2
    }
  },
  {
    id: 'from',
    label: 'From Email',
    component: FilterContains,
    props: {
      placeholder: 'Enter sender email...',
      debounceMs: 500
    }
  },
  {
    id: 'to',
    label: 'To Email',
    component: FilterContains,
    props: {
      placeholder: 'Enter recipient email...',
      debounceMs: 500
    }
  },
  {
    id: 'subject',
    label: 'Subject',
    component: FilterContains,
    props: {
      placeholder: 'Enter subject text...',
      debounceMs: 500
    }
  },
  {
    id: 'domain',
    label: 'Email Domain',
    component: FilterSelect,
    options: EMAIL_DOMAIN_OPTIONS,
    props: {
      placeholder: 'All domains'
    }
  },
  {
    id: 'sender_name',
    label: 'Sender Name',
    component: FilterSelect,
    options: SENDER_NAME_OPTIONS,
    props: {
      placeholder: 'All senders'
    }
  }
];

// Export individual filter configs for flexibility
export {
  EMAIL_STATUS_OPTIONS,
  EMAIL_DOMAIN_OPTIONS,
  SENDER_NAME_OPTIONS
}; 