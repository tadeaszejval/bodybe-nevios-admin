"use client";
import React, { useState, useEffect } from 'react';
import { NeviosInput } from '../NeviosInput';

/**
 * FilterContains Component
 * A text input filter for "contains" style filtering
 * 
 * @param {Object} props
 * @param {string} props.value - Current filter value
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.placeholder - Placeholder text for input
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {number} props.debounceMs - Debounce delay in milliseconds (default: 300)
 */
export function FilterContains({ 
  value = '', 
  onChange, 
  placeholder = 'Enter text to search...', 
  disabled = false,
  debounceMs = 300,
  ...props 
}) {
  const [localValue, setLocalValue] = useState(value || '');

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue || null);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value, debounceMs]);

  const handleInputChange = (event) => {
    setLocalValue(event.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange(null);
  };

  const hasValue = localValue && localValue.trim().length > 0;

  return (
    <NeviosInput
      value={localValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  );
} 