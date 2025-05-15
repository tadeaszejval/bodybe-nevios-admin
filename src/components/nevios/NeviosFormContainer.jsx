import { Box } from "@mui/material";

export function NeviosOneColumnFormContainer({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {children}
    </Box>
  );
}

export function NeviosTwoColumnFormContainer({ mainContent, sideContent, mainWidth = "65%", sideWidth = "35%", footerContent }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        gap: 1.5
      }}
    >
      <Box  
        sx={{ 
          width: { xs: "100%", sm: mainWidth }, 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column", 
          gap: 1.5,
        }}
      >
        {mainContent}
      </Box>
      <Box 
        sx={{ 
          width: { xs: "100%", sm: sideWidth }, 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column", 
          gap: 1.5,
        }}
      >
        {sideContent}
      </Box>
    </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", flexDirection: "row", gap: 1.5 }}>
                {footerContent}
            </Box>
        </Box>
    </Box>
  );
}

