import * as React from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';
import { TbChevronDown } from "react-icons/tb";
import { NeviosShadowButton } from './NeviosButtons';

export default function NeviosGroupButton({
  buttonText = 'Group',
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
            <NeviosShadowButton
                id='basic-button' 
                aria-controls={open ? 'basic-menu' : undefined} 
                aria-haspopup='true' 
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size="small"
                iconAfter={iconComponent}
                sx={{
                    ...(open && {
                        boxShadow: "0rem -.0625rem .1rem .002rem hsl(0, 0.00%, 65.00%) inset, 0rem 0rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset, 0rem .09rem .08rem .0625rem hsl(0, 0.00%, 65.00%) inset",
                        "& .nevios-button-content": {
                            transform: "translateY(1px)"
                        }
                    }),
                    ...buttonSx
                }}
            >
                {buttonText}
            </NeviosShadowButton>
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