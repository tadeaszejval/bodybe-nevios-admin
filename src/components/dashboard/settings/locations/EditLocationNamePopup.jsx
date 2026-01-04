import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import NeviosPopupForm from '../../../nevios/NeviosPopupForm';
import { NeviosInput } from '../../../nevios/NeviosInput';
import { NeviosSecondaryButton, NeviosPrimaryButton } from '../../../nevios/NeviosButtons';

/**
 * EditLocationNamePopup - Component for editing a location's name
 * 
 * @param {boolean} open - Controls whether the dialog is open
 * @param {function} onClose - Function called when dialog is closed
 * @param {function} onSave - Function called when Save button is clicked with new name
 * @param {string} initialName - Initial location name
 * @param {boolean} loading - Whether the save operation is in progress
 */
export default function EditLocationNamePopup({ 
  open, 
  onClose, 
  onSave, 
  initialName = '', 
  loading = false 
}) {
  const [name, setName] = useState(initialName);
  const [isDirty, setIsDirty] = useState(false);
  
  // Reset form data and dirty state when popup opens/closes or initialName changes
  useEffect(() => {
    if (open) {
      setName(initialName);
      setIsDirty(false);
    }
  }, [open, initialName]);

  const handleChange = (e) => {
    setName(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave?.(name.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && name.trim() && isDirty) {
      handleSave();
    }
  };

  const FormActions = (
    <>
      <NeviosSecondaryButton size="small" onClick={onClose} disabled={loading}>
        Cancel
      </NeviosSecondaryButton>
      <NeviosPrimaryButton 
        size="small"
        onClick={handleSave} 
        disabled={!isDirty || !name.trim() || loading}
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
      title="Edit location name"
      actions={FormActions}
      loading={loading}
      maxWidth="xs"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NeviosInput
          label="Location name"
          name="name"
          value={name}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter location name"
          autoFocus
          required
        />
      </Box>
    </NeviosPopupForm>
  );
}

