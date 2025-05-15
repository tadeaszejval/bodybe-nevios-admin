import { Box, Typography, IconButton } from "@mui/material";

export function NeviosFormPaperBlock({ children, title, icon, onClick }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {title && (
          <Typography variant="paperSubtitle">{title}</Typography>
        )}
        {icon && (
          <IconButton color="secondary" onClick={onClick}>
            {icon}
          </IconButton>
        )}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {children}
      </Box>
    </Box>
  );
}

