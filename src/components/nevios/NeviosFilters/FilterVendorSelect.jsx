"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  Checkbox, 
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import { supabase } from '../../../utils/supabase';
import { NeviosInput } from '../NeviosInput';

/**
 * Vendor Multiple Select Filter Component
 * Fetches vendors from Supabase and renders a dropdown with checkboxes for multiple selection
 * 
 * @param {Object} props
 * @param {Array} props.value - Current selected vendor values array
 * @param {Function} props.onChange - Callback when values change
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.maxDisplayChips - Maximum chips to display before showing count
 */
export function FilterVendorSelect({
  value = [],
  onChange,
  placeholder = 'Select vendors...',
  maxDisplayChips = 2
}) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedValues = Array.isArray(value) ? value : [];

  // Fetch vendors from Supabase
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('product_vendors')
          .select('value')
          .not('value', 'is', null)
          .order('value', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        // Transform data to include both value and label (using value as label)
        const transformedData = (data || []).map(item => ({
          value: item.value,
          label: item.value
        }));

        setVendors(transformedData);
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Filter vendors based on search term
  const filteredVendors = useMemo(() => {
    if (!searchTerm.trim()) {
      return vendors;
    }
    
    return vendors.filter(vendor =>
      vendor.value?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vendors, searchTerm]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    // Handle the case where MUI returns a string when empty
    const finalValue = typeof newValue === 'string' ? [] : newValue;
    onChange?.(finalValue.length > 0 ? finalValue : null);
  };

  const handleSelectAll = (event) => {
    event.stopPropagation(); // Prevent dropdown from closing
    const allValues = filteredVendors.map(vendor => vendor.value);
    const isAllSelected = allValues.every(val => selectedValues.includes(val));
    
    if (isAllSelected) {
      // If all filtered vendors are selected, remove them from selection
      const remainingValues = selectedValues.filter(val => !allValues.includes(val));
      onChange?.(remainingValues.length > 0 ? remainingValues : null);
    } else {
      // Otherwise, add all filtered vendors to selection
      const newValues = [...new Set([...selectedValues, ...allValues])];
      onChange?.(newValues);
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
          {selected.map((vendorValue) => {
            const vendor = vendors.find(v => v.value === vendorValue);
            return (
              <Chip
                key={vendorValue}
                label={vendor?.label || vendorValue}
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
          label={`${selected.length} vendors selected`}
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

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="error">
          Error loading vendors: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <FormControl fullWidth size="small">
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        displayEmpty
        renderValue={renderValue}
        disabled={loading}
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
              maxHeight: 400,
              '& .MuiList-root': {
                paddingTop: 0
              }
            }
          }
        }}
      >
        {/* Search Box */}
        <Box sx={{ p: 1, position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
          <NeviosInput
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            height={35}
          />
        </Box>

        {/* Select All / Clear All Options */}
        {!loading && filteredVendors.length > 0 && (
          <Box>
            {selectedValues.length > 0 && (
              <MenuItem onClick={handleClearAll} sx={{ fontSize: '12px', fontWeight: 500 }}>
                <Box sx={{ width: '20px', mr: 0.5 }} />
                <ListItemText>
                  <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500, color: 'error.main' }}>
                    Clear All
                  </Typography>
                </ListItemText>
                </MenuItem>
            )}
          </Box>
        )}

        {/* Loading State */}
        {loading ? (
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Loading vendors...</Typography>
            </Box>
          </MenuItem>
        ) : filteredVendors.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? `No vendors found for "${searchTerm}"` : 'No vendors found'}
            </Typography>
          </MenuItem>
        ) : (
          /* Vendor Options */
          filteredVendors.map((vendor) => (
            <MenuItem key={vendor.value} value={vendor.value}>
              <Checkbox 
                checked={selectedValues.includes(vendor.value)}
                size="small"
                sx={{ mr: 0.5, padding: 0 }}
              />
              <ListItemText>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '12px' }}>
                    {vendor.label}
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