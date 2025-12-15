"use client";
import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  Box, 
  Typography,
  CircularProgress
} from '@mui/material';

const API_BASE_URL = "https://vasky-nevios-express-production.up.railway.app/api";

/**
 * Location Select Filter Component
 * Fetches and displays locations from the API
 * 
 * @param {Object} props
 * @param {string|null} props.value - Current selected location UUID
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.placeholder - Placeholder text
 */
export function FilterLocationSelect({
  value = '',
  onChange,
  placeholder = 'All locations'
}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch locations from API
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/server/location/query?page=1&limit=100`);
        const result = await response.json();
        
        if (result.success) {
          // Handle different response structures
          const records = result.data?.data || result.data?.records || result.data || [];
          setLocations(records);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

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
        disabled={loading}
        sx={{
          fontSize: '14px',
          '& .MuiSelect-select': {
            py: 1
          }
        }}
      >
        <MenuItem value="">
          <Typography variant="body2" color="text.secondary">
            {loading ? 'Loading...' : placeholder}
          </Typography>
        </MenuItem>
        {loading ? (
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Loading locations...</Typography>
            </Box>
          </MenuItem>
        ) : (
          locations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">
                  {location.name}
                </Typography>
                {location.type && (
                  <Typography variant="caption" color="text.secondary">
                    {location.type}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

