import { Button, Box } from '@mui/material';
import { TbChevronDown } from 'react-icons/tb';
export default function NeviosButtonEndIcon({
  buttonText,
  variant = 'contained',
  color = 'primary',
  size = 'small',
  endIcon = <TbChevronDown />,
  ...props
}) {
  return (
    <Button size={size} color={color} variant={variant} {...props} sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      padding: "4px 12px",
    }}>
        {buttonText}
        {endIcon}
    </Button>
  );
}