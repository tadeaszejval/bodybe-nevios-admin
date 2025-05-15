import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Button, 
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import { TbX } from 'react-icons/tb';

/**
 * NeviosConfirmDialog - A reusable confirmation dialog component
 * 
 * @param {boolean} open - Controls whether the dialog is open
 * @param {function} onClose - Function called when dialog is closed or canceled
 * @param {function} onConfirm - Function called when the confirm button is clicked
 * @param {string} title - Dialog title
 * @param {string} message - Main content/message of the dialog
 * @param {string} confirmText - Text for the confirm button (default: "Confirm")
 * @param {string} cancelText - Text for the cancel button (default: "Cancel")
 * @param {string} confirmColor - Color for the confirm button (default: "primary")
 * @param {boolean} loading - Whether the confirm action is loading
 * @param {boolean} dangerous - When true, styles the confirm button as dangerous action (red)
 */
export default function NeviosConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  loading = false,
  dangerous = false
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  // Apply dangerous styling if needed
  const buttonColor = dangerous ? "error" : confirmColor;
  
  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 2, 
        px: 2 
      }}>
        <Typography variant="paperTitle" component="div" fontWeight={600}>
          {title}
        </Typography>
        {!loading && (
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose} 
            aria-label="close"
            size="small"
          >
            <TbX />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ py: 2, px: 2 }}>
        <Typography variant="body2">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ py: 2, px: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button 
            size="small"
            variant="outlined" 
            onClick={onClose} 
            color="secondary"
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button 
            size="small"
            variant="contained" 
            onClick={handleConfirm} 
            color={buttonColor}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
