"use client";
import { Box } from "@mui/material";
import { TbBuildingCommunity } from "react-icons/tb";

export function CompanyBadge({ company, customSx = {} }) {
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        gap: 0.5,
        padding: 0,
        backgroundColor: `blue.50`,
        color: `blue.800`,
        fontWeight: 500,
        borderRadius: 1,
        borderColor: `blue.200`,
        borderWidth: 1,
        borderStyle: "solid",
        px: 0.75,
        py: 0.25,
        fontSize: "xs",
        ...customSx,
      }}
    >
      <TbBuildingCommunity />
      {company}
    </Box>
  );
} 