import { Paper, Box, useTheme } from "@mui/material";

/**
 * NeviosPaper - A simple paper component wrapper
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display inside the paper
 * @param {number} props.elevation - Elevation level (default: 2)
 * @param {Object} props.sx - Additional MUI sx styling
 * @param {number|string} props.padding - Padding around content (default: 2)
 * @param {number|string} props.gap - Gap between children if flex (default: 1.5)
 */
export function NeviosPaper({
  children,
  elevation = 2,
  sx = {},
  ...props
}) {
  const theme = useTheme();
  return (
    <Paper 
      elevation={elevation} 
      sx={{ 
        borderWidth: "1px",
        borderColor: theme.palette.gray[200],
        borderStyle: "solid",
        ...sx
      }}
      {...props}
    >
        {children}
    </Paper>
  );
}

