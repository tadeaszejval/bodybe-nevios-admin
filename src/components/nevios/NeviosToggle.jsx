import { FormControl, FormLabel, Switch, FormHelperText, Box } from "@mui/material";

/**
 * NeviosToggle - A toggle/switch component with consistent Nevios styling
 * 
 * @param {Object} props
 * @param {string} props.label - Label text displayed above the toggle
 * @param {boolean} props.checked - Controlled checked state
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.name - Name attribute for the toggle
 * @param {boolean} props.error - Error state (default: false)
 * @param {string} props.helperText - Helper text displayed below the toggle
 * @param {boolean} props.disabled - Disabled state (default: false)
 * @param {string} props.size - Size variant: "small" | "medium" (default: "medium")
 * @param {React.ReactNode} props.labelRight - Optional label to display on the right side of the toggle
 * @param {Object} props.sx - Additional MUI sx styling for the FormControl
 */
export function NeviosToggle({ 
  label, 
  checked, 
  onChange, 
  name,
  error = false,
  helperText,
  disabled = false,
  size = "small",
  labelRight,
  sx = {},
  ...props 
}) {
  return (
    <FormControl 
      sx={{ 
        width: "100%",
        ...sx 
      }} 
      error={error}
      disabled={disabled}
    >
      {label && (
        <FormLabel 
          sx={{ 
            fontSize: "13px", 
            fontWeight: 400, 
            marginBottom: 0.8,
            color: disabled ? "text.disabled" : "text.primary"
          }}
        >
          {label}
        </FormLabel>
      )}
      
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1.5 
        }}
      >
        <Switch
          checked={checked}
          onChange={onChange}
          name={name}
          disabled={disabled}
          size={size}
          sx={(theme) => ({
            width: size === "small" ? 38 : 42,
            height: size === "small" ? 20 : 24,
            padding: 0,
            '& .MuiSwitch-switchBase': {
              padding: 0,
              margin: size === "small" ? '2px' : '3px',
              transitionDuration: '200ms',
              '&.Mui-checked': {
                transform: size === "small" ? 'translateX(18px)' : 'translateX(18px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: error 
                    ? theme.palette.red[600] 
                    : theme.palette.primary.main,
                  opacity: 1,
                  border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                  opacity: 0.5,
                },
              },
              '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: theme.palette.primary.main,
                border: `6px solid #fff`,
              },
              '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.3,
              },
            },
            '& .MuiSwitch-thumb': {
              boxSizing: 'border-box',
              width: size === "small" ? 16 : 18,
              height: size === "small" ? 16 : 18,
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.2)',
            },
            '& .MuiSwitch-track': {
              borderRadius: size === "small" ? 10 : 12,
              backgroundColor: theme.palette.grey[400],
              opacity: 1,
              transition: theme.transitions.create(['background-color'], {
                duration: 200,
              }),
            },
          })}
          {...props}
        />
        
        {labelRight && (
          <Box 
            component="span" 
            sx={{ 
              fontSize: "14px",
              color: disabled ? "text.disabled" : "text.primary",
              userSelect: "none"
            }}
          >
            {labelRight}
          </Box>
        )}
      </Box>

      {helperText && (
        <FormHelperText 
          sx={{ 
            marginLeft: 0,
            marginTop: 0.5 
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default NeviosToggle;

