"use client";
import React from 'react';
import { FormControl, Select, MenuItem, Box, Typography } from '@mui/material';

/**
 * Select Filter Component
 * Renders a dropdown select for filtering
 * 
 * @param {Object} props
 * @param {string|null} props.value - Current selected value
 * @param {Function} props.onChange - Callback when value changes
 * @param {Array} props.options - Array of {value, label} options
 * @param {string} props.placeholder - Placeholder text
 */
export function FilterSelect({
  value = '',
  onChange,
  options = [],
  placeholder = 'Select...'
}) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    onChange?.(newValue === '' ? null : newValue);
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        value={value || ''}
        onChange={handleChange}
        displayEmpty
        sx={{
          fontSize: '14px',
          '& .MuiSelect-select': {
            py: 1
          }
        }}
      >
        <MenuItem value="">
          <Typography variant="body2" color="text.secondary">
            {placeholder}
          </Typography>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon && <option.icon size={16} />}
              <Typography variant="body2">
                {option.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
} 