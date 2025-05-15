import { Paper, Typography, IconButton, Box } from "@mui/material";

export function NeviosFormPaper({ children, title, icon, onClick, description, footerDescription, gap = 1.5 }) {
  return (
    <Paper elevation={2} sx={{ display: "flex", flexDirection: "column", height: "fit-content", gap: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 2, paddingLeft: 2, paddingRight: 2 }}>
        {title && (
          <Typography variant="paperTitle">
            {title}
          </Typography>
        )}
        {icon && (
          <IconButton color="secondary" onClick={onClick}>
            {icon}
          </IconButton>
        )}
      </Box>
      {description && (
        <Typography variant="paperDescription" sx={{ paddingLeft: 2, paddingRight: 2 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: gap,
          paddingLeft: 2, 
          paddingRight: 2, 
          paddingBottom: footerDescription ? 0 : 2,
        }}
      >
        {children}
      </Box>
      {footerDescription && (
      <Box sx={{ backgroundColor: "grey.100", width: "100%", padding: 2, borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}>
        <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
          {footerDescription}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

