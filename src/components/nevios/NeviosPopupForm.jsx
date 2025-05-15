import * as React from 'react';
import { 
  Box, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Typography 
} from '@mui/material';
import { HiX } from 'react-icons/hi';

/**
 * NeviosPopupForm - A reusable popup component with header, content area, and customizable footer
 * 
 * @param {boolean} open - Controls whether the dialog is open
 * @param {function} onClose - Function called when dialog is closed
 * @param {string} title - Title displayed in the header
 * @param {React.ReactNode} children - Content to be displayed in the dialog body
 * @param {React.ReactNode} actions - Custom actions for the footer
 * @param {boolean} fullWidth - Whether the dialog should take up the full width of its container
 * @param {string} maxWidth - Maximum width of the dialog (xs, sm, md, lg, xl)
 * @param {boolean} hideFooter - Option to hide the footer completely if no actions are needed
 * @param {boolean} loading - Whether the form is in a loading state
 * @param {boolean} disableClose - Whether to disable the close button and backdrop click (useful during loading)
 */
export default function NeviosPopupForm({
  open,
  onClose,
  title,
  children,
  actions,
  fullWidth = true,
  maxWidth = "sm",
  hideFooter = false,
  loading = false,
  disableClose = false
}) {
  // Use loading state to determine if dialog can be closed
  const handleClose = (event, reason) => {
    // Prevent closing if disableClose is true or loading is true
    if (disableClose || loading) return;
    
    // Otherwise proceed with normal close
    if (onClose) onClose(event, reason);
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="popup-dialog-title"
    >
      <DialogTitle
        id="popup-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'gray.100',
          borderBottom: '1px solid',
          borderColor: 'divider',
          padding: 1.5,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "14px", }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          edge="end"
          disabled={loading || disableClose}
        >
          <HiX size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ paddingTop: 2 }}>
          {children}
        </Box>
      </DialogContent>
      
      {!hideFooter && (
        <DialogActions
          sx={{
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderTopColor: 'divider',
            justifyContent: 'flex-end',
            backgroundColor: 'gray.100',
            gap: 0.5,
            padding: 1.5
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
