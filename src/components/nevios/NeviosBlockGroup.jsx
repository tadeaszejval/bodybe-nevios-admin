import React from "react";
import { Box } from "@mui/material";

/**
 * NeviosBlockGroup - Groups multiple NeviosBlock components together with shared borders
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - NeviosBlock components to group
 * @param {Object} props.sx - Additional MUI sx styling
 */
export function NeviosBlockGroup({ children, sx = {}, ...props }) {
  const childArray = Array.isArray(children) ? children : [children];
  const validChildren = childArray.filter(child => child);

  return (
    <Box 
      sx={{ 
        border: "1px solid",
        borderColor: "gray.200",
        borderRadius: "12px",
        overflow: "hidden",
        ...sx
      }}
      {...props}
    >
      {validChildren.map((child, index) => (
        <React.Fragment key={index}>
          {/* Clone the child and pass grouped=true prop to remove its border */}
          {React.cloneElement(child, { grouped: true })}
          
          {/* Add divider between items (not after last item) */}
          {index < validChildren.length - 1 && (
            <Box 
              sx={{ 
                height: "1px", 
                backgroundColor: "gray.200",
              }} 
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}

