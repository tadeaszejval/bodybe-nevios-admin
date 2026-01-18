"use client";
import { Box } from "@mui/material";
import { match } from "ts-pattern";

/**
 * Universal Badge Component
 * 
 * Usage:
 * <NeviosBadge value="MALE" configKey="gender" />
 * <NeviosBadge value="ACTIVE" configKey="productStatus" />
 * <NeviosBadge label="Custom" color="blue" icon={<Icon />} />
 */
export function NeviosBadge({ 
  value,              // The value to match against config
  configKey,          // Key to lookup in BADGE_CONFIGS
  config,             // Or pass config object directly
  label,              // Optional: Override label
  color,              // Optional: Override color
  icon,               // Optional: Override icon
  variant = 'default', // Styling variant: 'default', 'solid', 'outlined', 'compact'
  customSx = {},      // Additional custom styles
  showIcon = true,    // Whether to show icon
  showDot = false     // Whether to show color dot instead of icon
}) {
  // If label and color provided directly, use them
  if (label && color) {
    return (
      <BadgeDisplay 
        label={label} 
        color={color} 
        icon={showIcon ? icon : null}
        showDot={showDot}
        variant={variant} 
        customSx={customSx} 
      />
    );
  }

  // Get config from BADGE_CONFIGS or use provided config
  let badgeConfig = config;
  if (!badgeConfig && configKey) {
    // Import configs dynamically
    const { BADGE_CONFIGS } = require('../../config/badges');
    badgeConfig = BADGE_CONFIGS[configKey];
  }

  if (!badgeConfig) {
    console.warn(`NeviosBadge: No config found for configKey "${configKey}"`);
    return (
      <BadgeDisplay 
        label={value || 'Unknown'} 
        color="gray" 
        variant={variant}
        customSx={customSx}
      />
    );
  }

  // Match value against config
  const matched = matchValue(value, badgeConfig);

  return (
    <BadgeDisplay 
      label={label || matched.label} 
      color={color || matched.color} 
      icon={showIcon ? (icon || matched.icon) : null}
      showDot={showDot}
      variant={variant}
      customSx={customSx}
    />
  );
}

/**
 * Match value against config object
 */
function matchValue(value, config) {
  // Normalize value for matching
  const normalizedValue = typeof value === 'string' 
    ? value.toUpperCase() 
    : value;

  // Try direct match first
  if (config[normalizedValue]) {
    return config[normalizedValue];
  }

  // Try case-insensitive match
  const matchedKey = Object.keys(config).find(
    key => key.toUpperCase() === String(normalizedValue).toUpperCase()
  );

  if (matchedKey) {
    return config[matchedKey];
  }

  // Fallback to UNKNOWN or first item with "UNKNOWN" in key
  const unknownKey = Object.keys(config).find(
    key => key.toUpperCase().includes('UNKNOWN') || 
           key.toUpperCase().includes('DEFAULT') ||
           key.toUpperCase().includes('NOT_SPECIFIED')
  );

  if (unknownKey) {
    return config[unknownKey];
  }

  // Last resort fallback
  return {
    label: value || 'Unknown',
    color: 'gray',
    icon: null
  };
}

/**
 * Badge Display Component
 */
function BadgeDisplay({ label, color, icon, showDot, variant, customSx }) {
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
      {icon && !showDot && icon}
      {label}
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
