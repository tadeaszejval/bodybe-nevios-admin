"use client";
import { Box } from "@mui/material";

/**
 * Simple Custom Badge Component
 * 
 * Usage:
 * <NeviosCustomBadge value="My Label" color="blue" />
 * <NeviosCustomBadge value="With Icon" color="green" icon={<Icon />} />
 */
export function NeviosCustomBadge({ 
  value,              // The text to display
  color = "gray",     // Color theme (e.g., 'blue', 'green', 'red', 'gray')
  icon,               // Optional icon component
  variant = 'default', // Styling variant: 'default', 'solid', 'outlined', 'compact'
  customSx = {},      // Additional custom styles
  showIcon = true,    // Whether to show icon
  showDot = false     // Whether to show color dot instead of icon
}) {
  const variantStyles = getVariantStyles(variant, color);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        gap: 0.5,
        padding: 0,
        ...variantStyles,
        ...customSx,
      }}
    >
      {showDot && <ColorDot color={color} />}
      {icon && !showDot && showIcon && icon}
      {value}
    </Box>
  );
}

/**
 * Color Dot Component
 */
function ColorDot({ color }) {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: `${color}.500`,
      }}
    />
  );
}

/**
 * Get styles based on variant
 */
function getVariantStyles(variant, color) {
  const baseStyles = {
    fontWeight: 500,
    borderRadius: 1,
    px: 0.75,
    py: 0.25,
    fontSize: "xs",
  };

  switch (variant) {
    case 'solid':
      return {
        ...baseStyles,
        backgroundColor: `${color}.500`,
        color: 'white',
        borderWidth: 0,
      };

    case 'outlined':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: `${color}.700`,
        borderColor: `${color}.300`,
        borderWidth: 1,
        borderStyle: "solid",
      };

    case 'compact':
      return {
        ...baseStyles,
        backgroundColor: `${color}.50`,
        color: `${color}.800`,
        px: 0.5,
        py: 0.15,
        fontSize: "10px",
        borderWidth: 0,
      };

    case 'default':
    default:
      return {
        ...baseStyles,
        backgroundColor: `${color}.50`,
        color: `${color}.800`,
        borderColor: `${color}.200`,
        borderWidth: 1,
        borderStyle: "solid",
      };
  }
}
