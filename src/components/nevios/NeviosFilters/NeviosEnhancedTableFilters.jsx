"use client";
import React, { useState } from 'react';
import { Box, Popover, Typography, Chip } from '@mui/material';
import { NeviosSecondaryIconButton, NeviosSecondaryButton, NeviosPrimaryButton } from '../NeviosButtons';
import { TbX } from 'react-icons/tb';

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

  // Handle opening a filter popover
  const handleFilterOpen = (filterId, event) => {
    setAnchorEls(prev => ({
      ...prev,
      [filterId]: event.currentTarget
    }));
  };

  // Handle closing a filter popover
  const handleFilterClose = (filterId) => {
    setAnchorEls(prev => ({
      ...prev,
      [filterId]: null
    }));
  };

  // Handle filter value change
  const handleFilterChange = (filterId, value) => {
    const newFilters = { ...activeFilters };
    
    if (value === null || value === undefined || value === '') {
      delete newFilters[filterId];
    } else {
      newFilters[filterId] = value;
    }
    
    onFiltersChange?.(newFilters);
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
        const isActive = activeFilters.hasOwnProperty(config.id);
        const anchorEl = anchorEls[config.id];
        const isOpen = Boolean(anchorEl);
        
        // Calculate filter count for display
        const filterValue = activeFilters[config.id];
        let filterCount = 0;
        if (isActive) {
          if (Array.isArray(filterValue)) {
            filterCount = filterValue.length;
          } else {
            filterCount = 1;
          }
        }

        return (
          <React.Fragment key={config.id}>
            {/* Filter Button */}
            <NeviosSecondaryButton
              onClick={(event) => handleFilterOpen(config.id, event)}
              disabled={loading}
            >
              {config.label}
              {isActive && (
                <Chip
                  size="small"
                  label={filterCount}
                  sx={{
                    ml: 0.5,
                    height: '16px',
                    fontSize: '10px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'inherit'
                  }}
                />
              )}
            </NeviosSecondaryButton>

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
              sx={{
                mt: 0.5
              }}
            >
              <Box sx={{ p: 1.5, minWidth: 250 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {config.label}
                </Typography>
                
                {/* Render filter component based on type */}
                {config.component && (
                  <config.component
                    value={activeFilters[config.id]}
                    onChange={(value) => handleFilterChange(config.id, value)}
                    options={config.options}
                    {...config.props}
                  />
                )}

                {/* Action buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mt: 2,
                  gap: 1
                }}>
                  <NeviosSecondaryButton
                    onClick={() => {
                      handleFilterChange(config.id, null);
                      handleFilterClose(config.id);
                    }}
                  >
                    Clear
                  </NeviosSecondaryButton>
                  <NeviosPrimaryButton
                    onClick={() => handleFilterClose(config.id)}
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
        <NeviosSecondaryIconButton
          onClick={handleClearAll}
          disabled={loading}
          sx={{ ml: 0.5 }}
        >
          <TbX size={14} />
        </NeviosSecondaryIconButton>
      )}
    </Box>
  );
}
