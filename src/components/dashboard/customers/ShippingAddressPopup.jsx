import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import NeviosPopupForm from '../../nevios/NeviosPopupForm';
import { NeviosInput } from '../../nevios/NeviosInput';
import { NeviosSelectCountry } from '../../nevios/NeviosSelect';
import NeviosFormPaper from '../../nevios/NeviosFormPaper';
import { NeviosSecondaryButton, NeviosPrimaryButton } from '../../nevios/NeviosButtons';

/**
 * ShippingAddressPopup - Component for adding a shipping address
 * 
 * @param {boolean} open - Controls whether the dialog is open
 * @param {function} onClose - Function called when dialog is closed
 * @param {function} onSave - Function called when Save button is clicked with form data
 * @param {object} initialData - Initial data for the form
 * @param {boolean} loading - Whether the save operation is in progress
 */
export default function ShippingAddressPopup({ open, onClose, onSave, initialData = {}, loading = false }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    address: initialData.address || '',
    country: initialData.country || '',
    postalCode: initialData.postalCode || '',
    city: initialData.city || '',
  });
  
  const [isDirty, setIsDirty] = useState(false);
  
  // Reset form data and dirty state when popup opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        address: initialData.address || '',
        country: initialData.country || '',
        postalCode: initialData.postalCode || '',
        city: initialData.city || '',
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

  const handleSaveAddress = () => {
    onSave?.(formData);
    
    // Only close automatically for create flow (when loading is not managed)
    if (!loading) {
      onClose();
    }
  };

  const AddressFormActions = (
    <>
      <NeviosSecondaryButton size="small" onClick={onClose} disabled={loading}>
        Cancel
      </NeviosSecondaryButton>
      <NeviosPrimaryButton 
        size="small"
        onClick={handleSaveAddress} 
        disabled={!isDirty && loading !== undefined || loading}
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
      title="Default shipping address"
      actions={AddressFormActions}
      loading={loading}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <NeviosSelectCountry
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          disabled={loading}
        />
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
          <NeviosInput 
            label="First Name" 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={loading}
          />
          <NeviosInput 
            label="Last Name" 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={loading}
          />
        </Box>
        <NeviosInput 
          label="Address" 
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={loading}
        />
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
          <NeviosInput 
            label="Postal code" 
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            disabled={loading}
          />
          <NeviosInput 
            label="City" 
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={loading}
          />
        </Box>
      </Box>
    </NeviosPopupForm>
  );
} 