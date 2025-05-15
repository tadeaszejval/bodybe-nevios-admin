import React, { useState, useRef, useEffect } from 'react';
import { 
  TextField, 
  InputAdornment, 
  Paper, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  ClickAwayListener,
  Popper,
  Grow,
  IconButton,
  Button,
  Divider
} from '@mui/material';
import { TbSearch, TbPlus } from 'react-icons/tb';

/**
 * NeviosSimpleSearch - A reusable search input with expandable results
 * 
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {Array} props.results - Array of search results to display
 * @param {function} props.onSearch - Callback function when search query changes
 * @param {function} props.onResultSelect - Callback function when a result is selected
 * @param {Object} props.actionButton - Optional action button configuration
 * @param {string} props.actionButton.label - Label for the action button
 * @param {function} props.actionButton.onClick - Callback for the action button
 * @param {function} props.renderItem - Optional custom renderer for result items
 * @param {function} props.getOptionLabel - Function to get the display label from a result item
 */
export default function NeviosSimpleSearch({
  placeholder = "Search or create a customer",
  results = [],
  onSearch,
  onResultSelect,
  actionButton,
  renderItem,
  getOptionLabel = (item) => item?.toString() || "",
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const anchorRef = useRef(null);
  
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    
    if (onSearch) {
      onSearch(value);
    }
    
    // Open the dropdown if there's input or results
    if (value || results.length > 0) {
      setOpen(true);
    }
  };
  
  const handleInputFocus = () => {
    setOpen(true);
  };
  
  const handleClickAway = () => {
    setOpen(false);
  };
  
  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setOpen(false);
  };
  
  const handleActionButtonClick = (event) => {
    if (actionButton?.onClick) {
      actionButton.onClick(event);
    }
    setOpen(false);
  };
  
  // Default item renderer
  const defaultRenderItem = (item) => (
    <ListItem 
      button 
      onClick={() => handleResultClick(item)} 
      sx={{ 
        py: 1, 
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <ListItemText 
        primary={getOptionLabel(item)} 
        primaryTypographyProps={{ 
          fontSize: '13px' 
        }}
      />
    </ListItem>
  );
  
  // Use custom renderer if provided, otherwise use default
  const renderResultItem = renderItem || defaultRenderItem;
  
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ width: '100%', position: 'relative' }}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          variant="outlined"
          ref={anchorRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TbSearch color="gray" />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: "12px",
              border: "none",
              fontSize: "13px"
              
            }
          }}
          {...props}
        />
        
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          placement="bottom-start"
          style={{ 
            width: anchorRef.current ? anchorRef.current.clientWidth : undefined,
            zIndex: 1300,
          }}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'top center' }}
            >
              <Paper 
                elevation={3}
                sx={{ 
                  mt: 0.5, 
                  maxHeight: 400, 
                  overflow: 'auto',
                  borderRadius: "12px"
                }}
              >
                {actionButton && (
                  <Box sx={{ p: 1 }}>
                    <Button
                      fullWidth
                      size="small"
                      variant="text"
                      color="inherit"
                      onClick={handleActionButtonClick}
                      startIcon={<TbPlus />}
                      sx={{ 
                        justifyContent: 'flex-start', 
                        fontSize: "13px",
                        fontWeight: "400",
                        px: 1.5, 
                        py: 1,
                        borderRadius: 1,
                        bgcolor: 'grey.50',
                        '&:hover': {
                          bgcolor: 'grey.100'
                        }
                      }}
                    >
                      {actionButton.label || "Create a new customer"}
                    </Button>
                  </Box>
                )}
                
                {actionButton && results.length > 0 && <Divider />}
                
                <List sx={{ p: 0 }}>
                  {results.length > 0 ? (
                    results.map((result, index) => (
                      <React.Fragment key={index}>
                        {renderResultItem(result)}
                      </React.Fragment>
                    ))
                  ) : (
                    !actionButton && (
                      <ListItem sx={{ py: 2 }}>
                        <ListItemText 
                          primary="No results found" 
                          primaryTypographyProps={{ 
                            fontSize: '13px' 
                          }}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
