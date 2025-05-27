"use client";
import React from 'react';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  Checkbox, 
  ListItemText,
  Chip
} from '@mui/material';

/**
 * Multiple Select Filter Component
 * Renders a dropdown with checkboxes for multiple selection filtering
 * 
 * @param {Object} props
 * @param {Array} props.value - Current selected values array
 * @param {Function} props.onChange - Callback when values change
 * @param {Array} props.options - Array of {value, label} options
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.maxDisplayChips - Maximum chips to display before showing count
 */
export function FilterMultipleSelect({
  value = [],
  onChange,
  options = [],
  placeholder = 'Select...',
  maxDisplayChips = 2
}) {
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (event) => {
    const newValue = event.target.value;
    // Handle the case where MUI returns a string when empty
    const finalValue = typeof newValue === 'string' ? [] : newValue;
    onChange?.(finalValue.length > 0 ? finalValue : null);
  };

  const handleSelectAll = (event) => {
    event.stopPropagation(); // Prevent dropdown from closing
    const allValues = options.map(option => option.value);
    const isAllSelected = allValues.every(val => selectedValues.includes(val));
    
    if (isAllSelected) {
      // If all are selected, clear all
      onChange?.(null);
    } else {
      // Otherwise, select all
      onChange?.(allValues);
    }
  };

  const handleClearAll = (event) => {
    event.stopPropagation(); // Prevent dropdown from closing
    onChange?.(null);
  };

  // Render selected values as text
  const renderValue = (selected) => {
    if (!selected || selected.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          {placeholder}
        </Typography>
      );
    }

    if (selected.length <= maxDisplayChips) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((val) => {
            const option = options.find(opt => opt.value === val);
            return (
              <Chip
                key={val}
                label={option?.label || val}
                size="small"
                sx={{ 
                  height: '20px', 
                  fontSize: '11px',
                  backgroundColor: 'primary.50',
                  color: 'primary.700'
                }}
              />
            );
          })}
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          label={`${selected.length} selected`}
          size="small"
          sx={{ 
            height: '20px', 
            fontSize: '11px',
            backgroundColor: 'primary.50',
            color: 'primary.700'
          }}
        />
      </Box>
    );
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        displayEmpty
        renderValue={renderValue}
        sx={{
          fontSize: '12px',
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiSelect-select': {
            py: 1,
            minHeight: 'auto'
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300
            }
          }
        }}
      >

        {/* Options */}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox 
              checked={selectedValues.includes(option.value)}
              size="small"
              sx={{ mr: 0.5, padding: 0 }}
            />
            <ListItemText>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {option.icon && <option.icon size={16} />}
                <Typography variant="body2">
                  {option.label}
                </Typography>
              </Box>
            </ListItemText>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
} 