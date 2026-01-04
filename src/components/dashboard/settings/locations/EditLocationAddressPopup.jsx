import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import NeviosPopupForm from '../../../nevios/NeviosPopupForm';
import { NeviosInput } from '../../../nevios/NeviosInput';
import { NeviosSelectCountry } from '../../../nevios/NeviosSelect';
import { NeviosSecondaryButton, NeviosPrimaryButton } from '../../../nevios/NeviosButtons';

/**
 * EditLocationAddressPopup - Component for editing a location's address
 * 
 * @param {boolean} open - Controls whether the dialog is open
 * @param {function} onClose - Function called when dialog is closed
 * @param {function} onSave - Function called when Save button is clicked with address data
 * @param {object} initialData - Initial address data
 * @param {boolean} loading - Whether the save operation is in progress
 */
export default function EditLocationAddressPopup({ 
  open, 
  onClose, 
  onSave, 
  initialData = {}, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || '',
    postal_code: initialData.postal_code || ''
  });
  const [isDirty, setIsDirty] = useState(false);
  
  // Reset form data and dirty state when popup opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        address: initialData.address || '',
        city: initialData.city || '',
        country: initialData.country || '',
        postal_code: initialData.postal_code || ''
      });
      setIsDirty(false);
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const FormActions = (
    <>
      <NeviosSecondaryButton size="small" onClick={onClose} disabled={loading}>
        Cancel
      </NeviosSecondaryButton>
      <NeviosPrimaryButton 
        size="small"
        onClick={handleSave} 
        disabled={!isDirty || loading}
        loading={loading}
      >
        Save
      </NeviosPrimaryButton>
    </>
  );

  return (
    <NeviosPopupForm
      open={open}
      onClose={onClose}
      title="Edit location address"
      actions={FormActions}
      loading={loading}
      maxWidth="sm"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NeviosInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address"
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <NeviosInput
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          
          <NeviosInput
            label="Postal code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="Postal code"
          />
        </Box>
        
        <NeviosSelectCountry
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </Box>
    </NeviosPopupForm>
  );
}

