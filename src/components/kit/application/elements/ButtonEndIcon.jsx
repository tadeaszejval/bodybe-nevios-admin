import * as React from 'react';
import { Box, Button } from '@mui/material';
import { TbArrowRight } from 'react-icons/tb';
// end icon buttons
export default function ButtonEndIcon({
  buttonText,
  variant = 'contained',
  color = 'primary',
  size = 'small',
  endIcon = <TbArrowRight />,
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Button color={color} variant={variant} size={size} endIcon={endIcon} {...props}>
        {buttonText}
      </Button>
    </Box>
  );
}
