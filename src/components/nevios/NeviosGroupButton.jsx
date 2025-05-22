import * as React from 'react';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { TbChevronDown } from "react-icons/tb";
import NeviosButtonEndIcon from './NeviosButtonEndIcon';

export default function NeviosGroupButton({
  buttonText = 'Group',
  variant = 'outlined',
  color = 'secondary',
  menuItems = [
    { label: 'Archive', onClick: () => {}, color: 'secondary' },
    { label: 'Edit', onClick: () => {}, color: 'secondary' },
    { label: 'Delete', onClick: () => {}, color: 'error' }
  ],
  buttonSx = {},
  menuSx = {},
  iconComponent = <TbChevronDown />
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleItemClick = (onClick) => {
      handleClose();
      if (onClick) onClick();
    };

    return (
        <>
            <NeviosButtonEndIcon
                id='basic-button' 
                aria-controls={open ? 'basic-menu' : undefined} 
                aria-haspopup='true' 
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant={variant} 
                buttonText={buttonText}
                size="small"
                color={color}
                sx={{
                    ...buttonSx
                }}
            />
            <Menu   
                id='basic-menu' 
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleClose}
                autoFocus={false}
                MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }} 
                disablePortal={true}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: "12px !important",
                    },
                    ...menuSx
                }}
            >
                {menuItems.map((item, index) => (
                  <MenuItem 
                    key={index} 
                    onClick={() => handleItemClick(item.onClick)}
                    >
                        <Typography variant="body2" color={item.color}>{item.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}