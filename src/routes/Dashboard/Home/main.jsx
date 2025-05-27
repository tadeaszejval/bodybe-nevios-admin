import React from "react";
import { Box } from "@mui/material";
import { TbHome, TbPlus, TbEdit, TbTrash, TbArrowRight, TbDownload, TbUpload } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { NeviosPrimaryButton, NeviosSecondaryButton, NeviosShadowButton, NeviosDangerButton } from "../../../components/nevios/NeviosButtons";
export default function DashboardHome() {
  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Home"
        icon={<TbHome size={24} />}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 200 }}>
        <NeviosPrimaryButton iconBefore={<TbPlus size={16} />}>Add Item</NeviosPrimaryButton>
        <NeviosPrimaryButton 
          iconAfter={<TbArrowRight size={16} />}
          activeSx={{ 
            backgroundColor: "purple.500",
            transform: "scale(0.95) rotate(2deg)",
            boxShadow: "0 0 20px rgba(128, 0, 128, 0.5)"
          }}
        >
          Continue
        </NeviosPrimaryButton>
        <NeviosPrimaryButton loading={true}>Loading...</NeviosPrimaryButton>
        <NeviosSecondaryButton iconBefore={<TbEdit size={16} />}>Edit</NeviosSecondaryButton>
        <NeviosSecondaryButton 
          iconBefore={<TbDownload size={16} />}
          iconAfter={<TbArrowRight size={16} />}
          activeSx={{
            backgroundColor: "yellow.200",
            color: "black",
            borderRadius: "20px"
          }}
        >
          Download
        </NeviosSecondaryButton>
        <NeviosSecondaryButton disabled={true}>Disabled</NeviosSecondaryButton>
        <NeviosShadowButton>Processing</NeviosShadowButton>
        <NeviosDangerButton iconBefore={<TbTrash size={16} />}>Delete</NeviosDangerButton>
        <NeviosDangerButton 
          iconAfter={<TbArrowRight size={16} />}
          activeSx={{
            backgroundColor: "green.500",
            transform: "scale(1.05)",
            boxShadow: "0 0 15px rgba(0, 255, 0, 0.7)"
          }}
        >
          Proceed
        </NeviosDangerButton>
        <NeviosDangerButton disabled={true}>Disabled Danger</NeviosDangerButton>
      </Box>
    </Box>
  );
}

export const Home = DashboardHome;

