"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { TbMailForward, TbMailCheck, TbMailOpened, TbMailPlus, TbMailX, TbMailCog, TbArrowLoopRight, TbClock } from "react-icons/tb";
import { formatShortDate, formatTime } from "../../../core/formatters";
import { NeviosFormPaper } from "../../nevios/NeviosFormPaper";

// Email event status icon mapping - matches the statuses from email_logs.status_type
const eventIcons = {
  PROCESSING: <TbArrowLoopRight size={18} />,
  SCHEDULED: <TbClock size={18} />,
  SENT: <TbMailForward size={18} />,
  DELIVERED: <TbMailCheck size={18} />,
  DELIVERY_DELAYED: <TbClock size={18} />,
  COMPLAINED: <TbMailCog size={18} />,
  BOUNCED: <TbMailX size={18} />,
  OPENED: <TbMailOpened size={18} />,
  CLICKED: <TbMailPlus size={18} />
};

/**
 * Component for displaying email event activity in a horizontal timeline
 * 
 * @param {Object} props 
 * @param {Array} props.events - Array of email event objects with status and timestamp
 */
export function EmailActivityBar({ events = [] }) {
  // If no events, show a placeholder
  if (!events || events.length === 0) {
    return (
      <NeviosFormPaper title="Email Events">
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No email events recorded</Typography>
        </Box>
      </NeviosFormPaper>
    );
  }

  // Get event icon based on status type
  const getEventIcon = (status) => {
    return eventIcons[status] || eventIcons.SENT;
  };

  // Format the status for display
  const formatStatus = (status) => {
    if (!status) return "Unknown";
    
    // Convert SENT to Sent, DELIVERED to Delivered, etc.
    return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ');
  };

  return (
    <NeviosFormPaper title="Activity Logs">
      <Box sx={{ 
        display: "flex", 
        flexDirection: "row",
        alignItems: "center",
        overflowX: "auto",
        py: 2,
        px: 3,
        width: "100%",
        backgroundImage: 'radial-gradient(circle, #E0E0E0 1px, transparent 1px)',
        backgroundSize: '10px 10px',
        backgroundColor: 'white',
        borderRadius: 1,
        justifyContent: "flex-start",
        position: "relative" // Added for the absolute positioning of the line
      }}>
        {/* Horizontal line that runs through all icons */}
        {events.length > 1 && (
          <Box 
            sx={{
              position: "absolute",
              height: "1px",
              backgroundColor: "grey.600",
              top: "38px", // Exact pixel value to align with middle of icons
              left: "60px", // Start from middle of first icon
              width: `calc(120px * ${events.length - 1})`, // Width based on number of events (with proper template literal)
              zIndex: 0
            }}
          />
        )}
        
        {/* Create a simpler timeline with clean JSX structure */}
        {events.map((event, index) => (
          <React.Fragment key={index}>
            {/* Event node */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: 80, // Fixed width for each event node
              marginRight: index < events.length - 1 ? "40px" : 0 // Add spacing between events
            }}>
              {/* Icon */}
              <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 45,
                height: 45,
                borderRadius: "50%",
                backgroundColor: "grey.200",
                flexShrink: 0,
                marginBottom: 1,
                position: "relative",
                zIndex: 1, // Make icons appear above the line
                boxShadow: "0px 0px 3px 1px rgb(177, 177, 177) inset"
              }}>
                {getEventIcon(event.status)}
              </Box>
              
              {/* Status text */}
              <Typography variant="body2x" fontSize={"14px"} paddingBottom={0.5}>
                {formatStatus(event.status)}
              </Typography>
              
              {/* Date */}
              <Typography variant="body2" fontSize={"12px"} color="text.secondary">
                {formatShortDate(event.timestamp)}
              </Typography>
              
              {/* Time */}
              <Typography variant="body2" fontSize={"12px"} color="text.secondary">
                {formatTime(event.timestamp)}
              </Typography>
            </Box>
            
            {/* Remove individual connecting lines between events */}
          </React.Fragment>
        ))}
      </Box>
    </NeviosFormPaper>
  );
}
