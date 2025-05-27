import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import NeviosPopupForm from '../../nevios/NeviosPopupForm';
import { NeviosInput } from '../../nevios/NeviosInput';
import { NeviosSecondaryButton, NeviosPrimaryButton } from '../../nevios/NeviosButtons';

/**
 * ContactPopup - Component for editing customer contact information
 * 
 * @param {boolean} open - Controls whether the dialog is open
 * @param {function} onClose - Function called when dialog is closed
 * @param {function} onSave - Function called when Save button is clicked with form data
 * @param {object} initialData - Initial data for the form
 * @param {boolean} loading - Whether the save operation is in progress
 */
export default function ContactPopup({ open, onClose, onSave, initialData = {}, loading = false }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
  });
  
  const [isDirty, setIsDirty] = useState(false);
  
  // Reset form data and dirty state when popup opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
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

  const handleSaveContact = () => {
    onSave?.(formData);
    
    // Only close automatically for create flow (when loading is not managed)
    if (!loading) {
      onClose();
    }
  };

  const ContactFormActions = (
    <>
      <NeviosSecondaryButton size="small" onClick={onClose} disabled={loading}>
        Cancel
      </NeviosSecondaryButton>
      <NeviosPrimaryButton 
        size="small"
        onClick={handleSaveContact} 
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
      title="Contact information"
      actions={ContactFormActions}
      loading={loading}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        <NeviosInput 
          label="Phone" 
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
        />
      </Box>
    </NeviosPopupForm>
  );
} 