"use client";
import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  TextField,
  Typography 
} from '@mui/material';

/**
 * Numeric Operator Filter Component
 * Allows filtering with operators (>, <, =) on numeric fields
 * 
 * @param {Object} props
 * @param {Object} props.value - Current value object {operator: 'gt'|'lt'|'eq', number: 123}
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.placeholder - Placeholder text for number input
 * @param {string} props.fieldPrefix - API field prefix (e.g., 'available', 'reserved', 'quantity')
 */
export function FilterNumericOperator({
  value = null,
  onChange,
  placeholder = 'Enter value...',
  fieldPrefix = ''
}) {
  const [operator, setOperator] = useState(value?.operator || 'gt');
  const [number, setNumber] = useState(value?.number?.toString() || '');

  const handleOperatorChange = (event) => {
    const newOperator = event.target.value;
    setOperator(newOperator);
    
    // Update parent with new operator
    if (number !== '' && !isNaN(number)) {
      onChange?.({
        operator: newOperator,
        number: parseFloat(number),
        filterKey: `${fieldPrefix}_${newOperator}`
      });
    }
  };

  const handleNumberChange = (event) => {
    const newNumber = event.target.value;
    setNumber(newNumber);
    
    // Update parent with new number
    if (newNumber !== '' && !isNaN(newNumber)) {
      onChange?.({
        operator,
        number: parseFloat(newNumber),
        filterKey: `${fieldPrefix}_${operator}`
      });
    } else {
      onChange?.(null);
    }
  };

  const operatorOptions = [
    { value: 'gt', label: '>', fullLabel: 'Greater than' },
    { value: 'lt', label: '<', fullLabel: 'Less than' },
    { value: 'eq', label: '=', fullLabel: 'Equal to' }
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <Select
          value={operator}
          onChange={handleOperatorChange}
          sx={{
            fontSize: '14px',
            '& .MuiSelect-select': {
              py: 1
            }
          }}
        >
          {operatorOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {option.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.fullLabel}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        size="small"
        type="number"
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder}
        sx={{
          flex: 1,
          '& .MuiInputBase-input': {
            py: 1,
            fontSize: '14px'
          }
        }}
      />
    </Box>
  );
}

