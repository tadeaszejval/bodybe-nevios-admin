"use client";
import React, { useState, useMemo } from 'react';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  Checkbox, 
  ListItemText,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { TbSearch } from 'react-icons/tb';

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
 * @param {boolean} props.showSearch - Whether to show search input (default: false)
 */
export function FilterMultipleSelect({
  value = [],
  onChange,
  options = [],
  placeholder = 'Select...',
  maxDisplayChips = 2,
  showSearch = false
}) {
  const selectedValues = Array.isArray(value) ? value : [];
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query) ||
      (option.value && option.value.toString().toLowerCase().includes(query))
    );
  }, [options, searchQuery, showSearch]);

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
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'gray.100'
          },
          '&:focus': {
            backgroundColor: 'gray.100'
          },
          '&:active': {
            backgroundColor: 'gray.100'
          },
          '&:focus-within': {
            backgroundColor: 'gray.100'
          },
          '&:focus-visible': {
            backgroundColor: 'gray.100'
          },
          '&.Mui-focused': {
            backgroundColor: 'white'
          },
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
          },
          autoFocus: false
        }}
      >
        {/* Search Input */}
        {showSearch && (
          <Box sx={{ px: 2, py: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                e.stopPropagation();
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TbSearch size={16} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem'
                }
              }}
            />
          </Box>
        )}

        {/* Options */}
        {filteredOptions.length === 0 && showSearch ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No results found
            </Typography>
          </MenuItem>
        ) : (
          filteredOptions.map((option) => (
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
          ))
        )}
      </Select>
    </FormControl>
  );
} 