"use client";
import { FilterSelect } from './FilterSelect';
import { FilterMultipleSelect } from './FilterMultipleSelect';
import { FilterContains } from './FilterContains';

/**
 * Documents Filter Configuration
 * Defines available filters for the documents table based on query-documents API
 */

// Document Type Filter Options
const DOCUMENT_TYPE_OPTIONS = [
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'DEPOSIT_INVOICE', label: 'Deposit Invoice' }
];

// Document Status Filter Options
const DOCUMENT_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ISSUED', label: 'Issued' },
  { value: 'PAID', label: 'Paid' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
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
 * Documents Filter Configuration
 * Each filter has:
 * - id: unique identifier (matches API filter key)
 * - label: display name
 * - component: React component to render
 * - options: data for the component (for select components)
 * - props: additional props for the component
 */
export const DOCUMENTS_FILTER_CONFIG = [
  {
    id: 'doc_type',
    label: 'Document Type',
    component: FilterMultipleSelect,
    options: DOCUMENT_TYPE_OPTIONS,
    props: {
      placeholder: 'All document types',
      maxDisplayChips: 2
    }
  },
  {
    id: 'status',
    label: 'Status',
    component: FilterMultipleSelect,
    options: DOCUMENT_STATUS_OPTIONS,
    props: {
      placeholder: 'All statuses',
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
  },
  {
    id: 'name',
    label: 'Document Name',
    component: FilterContains,
    props: {
      placeholder: 'Enter document name...',
      debounceMs: 500
    }
  },
  {
    id: 'note',
    label: 'Note',
    component: FilterContains,
    props: {
      placeholder: 'Enter note text...',
      debounceMs: 500
    }
  },
  {
    id: 'internal_note',
    label: 'Internal Note',
    component: FilterContains,
    props: {
      placeholder: 'Enter internal note...',
      debounceMs: 500
    }
  }
];

// Export individual filter configs for flexibility
export {
  DOCUMENT_TYPE_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
  CURRENCY_OPTIONS
}; 