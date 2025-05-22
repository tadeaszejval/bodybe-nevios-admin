"use client";
import { Box } from "@mui/material";
import { TbBuildingCommunity } from "react-icons/tb";

export function NeviosBadge({ badgeVariant = "gray", children, icon, customSx = {} }) {

    const badgeVariants = {
        blue: {
            backgroundColor: `blue.50`,
            color: `blue.800`,
            borderColor: `blue.200`,
        },
        green: {
            backgroundColor: `green.50`,
            color: `green.800`,
            borderColor: `green.200`,
        },
        red: {
            backgroundColor: `red.50`,
            color: `red.800`,
            borderColor: `red.200`,
        },
        yellow: {
            backgroundColor: `yellow.50`,
            color: `yellow.800`,
            borderColor: `yellow.200`,
        },
        orange: {
            backgroundColor: `orange.50`,
            color: `orange.800`,
            borderColor: `orange.200`,
        },
        gray: {
            backgroundColor: `gray.50`,
            color: `gray.800`,
            borderColor: `gray.200`,
        }
    }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        lineHeight: 1,
        gap: 0.5,
        padding: 0,
        backgroundColor: badgeVariants[badgeVariant].backgroundColor,
        color: badgeVariants[badgeVariant].color,
        fontWeight: 500,
        borderRadius: 1,
        borderColor: badgeVariants[badgeVariant].borderColor,
        borderWidth: 1,
        borderStyle: "solid",
        px: 0.75,
        py: 0.25,
        fontSize: "xs",
        ...customSx,
      }}
    >
      {icon}
      {children}
    </Box>
  );
} 