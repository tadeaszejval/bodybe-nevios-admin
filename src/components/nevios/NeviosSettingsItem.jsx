import { Box, Paper, Typography } from "@mui/material";
import { TbCirclePlus } from "react-icons/tb";

export function NeviosSettingsItem({ icon = <TbCirclePlus size={20} />, label, onClick }) {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        height: "44px",
        padding: "0.75rem",
        border: "0.5px solid rgb(146, 146, 146)",
        borderRadius: "8px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "action.hover"
        }
      }}
      onClick={onClick}
      elevation={0}
      variant="outlined"
    >
      <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 1 }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: "13px", fontWeight: 400 }}>
        {label}
      </Typography>
      <Box sx={{ ml: "auto" }}>
        <Typography sx={{ fontSize: "20px", color: "text.secondary" }}>
          &rsaquo;
        </Typography>
      </Box>
    </Box>
  );
} 

