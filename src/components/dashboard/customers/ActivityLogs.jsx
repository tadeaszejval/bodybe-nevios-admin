import React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';

// Format date nicely
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Customer activity logs component with timeline style
 * @param {Object} props
 * @param {Array} props.activities - Array of activity objects
 */
const ActivityLogs = ({ activities = [] }) => {
  // If no activities, show message
  if (!activities || activities.length === 0) {
    activities = [
      {
        type: 'viewed',
        description: 'Viewed the website',
        timestamp: new Date().toISOString(),
        details: 'Home page'
      }
    ];
  }

  return (
    <Box sx={{ paddingTop: 1 }}>
      <Box sx={{ position: 'relative', pl: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {activities.map((activity, index) => (
          <Box 
            key={index}
            sx={{ 
              position: 'relative', 
              backgroundColor: 'gray.50',
              borderRadius: "12px",
              px: 2,
              py: 1,
              pl: 3,
              boxShadow: "0px 0px 5px 0px rgb(236, 236, 236) inset"
            }}
          >
            {/* Timeline dot */}
            <Box
              sx={{
                position: 'absolute',
                left: '-8px', // Center the dot on the line
                top: '50%', // Center vertically
                transform: 'translateY(-50%)', // Perfect vertical centering
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                bgcolor: 'primary.main',
                border: '2px solid white',
                zIndex: 2
              }}
            />
            
            {/* Activity content */}
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                {activity.description}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                {activity.details}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(activity.timestamp)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ActivityLogs;
