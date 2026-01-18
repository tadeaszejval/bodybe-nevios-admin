"use client";
import React, { useState, useEffect } from 'react';
import { Box, Popover, Typography, Chip, IconButton } from '@mui/material';
import { NeviosSecondaryButton, NeviosPrimaryButton, NeviosTextButton, NeviosFilterButton } from '../NeviosButtons';
import { TbX } from 'react-icons/tb';
import { formatDateRangeLabel } from './FilterDateRange';

/**
 * Enhanced Table Filters Component
 * Manages filter buttons and their popovers for table filtering
 * 
 * @param {Object} props
 * @param {Array} props.filterConfigs - Array of filter configurations
 * @param {Object} props.activeFilters - Current active filters
 * @param {Function} props.onFiltersChange - Callback when filters change
 * @param {boolean} props.loading - Loading state
 */
export function NeviosEnhancedTableFilters({
  filterConfigs = [],
  activeFilters = {},
  onFiltersChange,
  loading = false
}) {
  const [anchorEls, setAnchorEls] = useState({});
  const [tempFilters, setTempFilters] = useState({});

  // Sync temp filters with active filters when they change
  useEffect(() => {
    setTempFilters(activeFilters);
  }, [activeFilters]);

  // Handle opening a filter popover
  const handleFilterOpen = (filterId, event) => {
    // Capture the element BEFORE preventing default
    const targetElement = event.currentTarget;
    
    // Initialize temp filter with current value
    // For date range filters, reconstruct the value from _from and _to keys
    let initialValue;
    if (activeFilters[filterId] !== undefined) {
      initialValue = activeFilters[filterId];
    } else {
      // Check if this filter has date range keys
      const dateRangeValue = {};
      let hasDateRange = false;
      Object.keys(activeFilters).forEach(key => {
        if (key.startsWith(filterId + '_')) {
          dateRangeValue[key] = activeFilters[key];
          hasDateRange = true;
        }
      });
      initialValue = hasDateRange ? dateRangeValue : null;
    }
    
    setTempFilters(prev => ({
      ...prev,
      [filterId]: initialValue
    }));
    
    setAnchorEls(prev => ({
      ...prev,
      [filterId]: targetElement
    }));
  };

  // Handle closing a filter popover
  const handleFilterClose = (filterId) => {
    setAnchorEls(prev => ({
      ...prev,
      [filterId]: null
    }));
  };

  // Handle temporary filter value change (not applied yet)
  const handleTempFilterChange = (filterId, value) => {
    setTempFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  // Apply the temporary filter
  const handleApplyFilter = (filterId) => {
    const newFilters = { ...activeFilters };
    const value = tempFilters[filterId];
    
    if (value === null || value === undefined || value === '') {
      // Remove the filter
      delete newFilters[filterId];
      // Also remove any date range keys
      Object.keys(newFilters).forEach(key => {
        if (key.startsWith(filterId + '_')) {
          delete newFilters[key];
        }
      });
    } else {
      // Check if this is a date range filter (has _from and _to keys)
      const isDateRangeFilter = value && typeof value === 'object' && 
        Object.keys(value).some(key => key.endsWith('_from') || key.endsWith('_to'));
      
      if (isDateRangeFilter) {
        // For date range filters, spread the values directly into filters
        // First, remove the filterId key itself if it exists
        delete newFilters[filterId];
        // Remove any existing date range keys for this filter
        Object.keys(newFilters).forEach(key => {
          if (key.startsWith(filterId + '_')) {
            delete newFilters[key];
          }
        });
        // Then add the new date range values
        Object.assign(newFilters, value);
      } else {
        // For other filters, set normally
        newFilters[filterId] = value;
      }
    }
    
    onFiltersChange?.(newFilters);
    handleFilterClose(filterId);
  };

  // Clear a specific filter
  const handleClearFilter = (filterId) => {
    const newFilters = { ...activeFilters };
    
    // Remove the main filter key
    delete newFilters[filterId];
    
    // Also remove any date range keys associated with this filter (e.g., created_at_from, created_at_to)
    Object.keys(newFilters).forEach(key => {
      if (key.startsWith(filterId + '_')) {
        delete newFilters[key];
      }
    });
    
    onFiltersChange?.(newFilters);
    handleFilterClose(filterId);
  };

  // Clear all filters
  const handleClearAll = () => {
    onFiltersChange?.({});
  };

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 0.5,
      flexWrap: 'wrap'
    }}>
      {/* Filter Buttons */}
      {filterConfigs.map((config) => {
        // Check if this filter is active
        // For date range filters, check if _from and _to keys exist
        const hasDateRangeKeys = Object.keys(activeFilters).some(key => 
          key.startsWith(config.id + '_from') || key.startsWith(config.id + '_to')
        );
        const isActive = activeFilters.hasOwnProperty(config.id) || hasDateRangeKeys;
        
        const anchorEl = anchorEls[config.id];
        const isOpen = Boolean(anchorEl);
        
        // Calculate filter count/label for display
        let filterValue = activeFilters[config.id];
        let filterLabel = '';
        
        if (isActive) {
          // For date range filters, reconstruct the value object from _from and _to keys
          if (hasDateRangeKeys) {
            const dateRangeValue = {};
            Object.keys(activeFilters).forEach(key => {
              if (key.startsWith(config.id + '_')) {
                dateRangeValue[key] = activeFilters[key];
              }
            });
            filterValue = dateRangeValue;
          }
          
          if (Array.isArray(filterValue)) {
            filterLabel = filterValue.length;
          } else if (filterValue && (filterValue.from || Object.keys(filterValue).some(k => k.endsWith('_from')))) {
            // Date range filter - use formatted label
            filterLabel = formatDateRangeLabel(filterValue);
          } else {
            filterLabel = 1;
          }
        }

        return (
          <React.Fragment key={config.id}>
            {/* Filter Button */}
            <NeviosFilterButton
              onClick={(event) => handleFilterOpen(config.id, event)}
              disabled={loading}
              height={25}
            >
              {config.label}
              {isActive && filterLabel && (
                <Chip
                  size="small"
                  label={filterLabel}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    ml: 0.5,
                    height: '16px',
                    fontSize: '10px',
                    backgroundColor: 'gray.200',
                    color: 'gray.900',
                    pointerEvents: 'none',
                    '& .MuiChip-label': {
                      px: 0.75
                    }
                  }}
                />
              )}
            </NeviosFilterButton>

            {/* Filter Popover */}
            <Popover
              open={isOpen}
              anchorEl={anchorEl}
              onClose={() => handleFilterClose(config.id)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              disablePortal={false}
              sx={{
                mt: 0.5,
                zIndex: 1300
              }}
            >
              <Box sx={{ p: 1.5, minWidth: 250 }}>
                {/* Header with title and close button */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1.5 
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {config.label}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleFilterClose(config.id)}
                    sx={{ 
                      color: 'gray.500',
                      '&:hover': {
                        color: 'gray.700',
                        backgroundColor: 'gray.100'
                      }
                    }}
                  >
                    <TbX size={16} />
                  </IconButton>
                </Box>
                
                {/* Render filter component based on type */}
                {config.component && (
                  <config.component
                    value={tempFilters[config.id]}
                    onChange={(value) => handleTempFilterChange(config.id, value)}
                    options={config.options}
                    {...config.props}
                  />
                )}

                {/* Action buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 1.5,
                  gap: 1
                }}>
                  <NeviosSecondaryButton
                    onClick={() => handleClearFilter(config.id)}
                    size="small"
                  >
                    Clear
                  </NeviosSecondaryButton>
                  <NeviosPrimaryButton
                    onClick={() => handleApplyFilter(config.id)}
                    size="small"
                  >
                    Apply
                  </NeviosPrimaryButton>
                </Box>
              </Box>
            </Popover>
          </React.Fragment>
        );
      })}

      {/* Clear All Button */}
      {activeFilterCount > 0 && (
        <NeviosTextButton
          onClick={handleClearAll}
          disabled={loading}
          height={25}
          fontSize="12px"
          fontWeight="500"
          sx={{ ml: 0.5 }}
        >
          Clear All
        </NeviosTextButton>
      )}
    </Box>
  );
}
