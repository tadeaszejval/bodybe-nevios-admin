import { Box, Typography } from "@mui/material";
import { TbChevronRight } from "react-icons/tb";

/**
 * NeviosBlock - A flexible horizontal block component for settings/info rows
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon to display on the left
 * @param {string} props.primaryText - Main text to display
 * @param {string} props.secondaryText - Optional secondary/subtitle text
 * @param {React.ReactNode} props.rightContent - Custom content for the right side
 * @param {Function} props.onClick - Optional click handler (makes entire block clickable, adds chevron by default)
 * @param {Object} props.sx - Additional MUI sx styling
 * @param {boolean} props.disabled - Disabled state (default: false)
 * @param {boolean} props.grouped - Internal prop for grouped blocks (automatically set by NeviosBlockGroup)
 */
export function NeviosBlock({ 
  icon, 
  primaryText, 
  secondaryText,
  rightContent,
  onClick,
  sx = {},
  disabled = false,
  grouped = false,
  ...props
}) {
  const isClickable = !!onClick && !disabled;

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        minHeight: "50px",
        py: 1,
        px: 2,
        border: grouped ? "none" : "1px solid",
        borderColor: grouped ? "transparent" : "gray.200",
        borderRadius: grouped ? 0 : "12px",
        cursor: isClickable ? "pointer" : "default",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        "&:hover": isClickable ? {
          backgroundColor: "action.hover",
          ...(grouped ? {} : { borderColor: "gray.300" })
        } : {},
        ...sx
      }}
      onClick={!disabled ? onClick : undefined}
      {...props}
    >
      {/* Left side - Icon and text */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, minWidth: 0 }}>
        {icon && (
          <Box 
            sx={{ 
              color: "text.secondary", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, minWidth: 0, flex: 1 }}>
          <Typography 
            variant="body2x" 
            sx={{ 
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {primaryText}
          </Typography>
          {secondaryText && (
            <Typography 
              variant="body2x" 
              sx={{ 
                color: "gray.500",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {secondaryText}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right side - Custom content or chevron */}
      {(rightContent || isClickable) && (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
            ml: 2
          }}
        >
          {rightContent}
          {isClickable && !rightContent && (
            <TbChevronRight size={18} style={{ color: "rgb(107, 114, 128)" }} />
          )}
        </Box>
      )}
    </Box>
  );
}

