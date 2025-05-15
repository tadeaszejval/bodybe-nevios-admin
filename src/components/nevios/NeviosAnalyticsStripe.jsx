import React from 'react';
import { Box, Paper, Typography, Divider, Stack } from '@mui/material';

/**
 * Analytics stripe component that displays multiple sections with title and value
 * @param {Object} props
 * @param {Array} props.sections - Array of section objects with title and value
 * @param {string} props.className - Additional CSS classes
 */
const NeviosAnalyticsStripe = ({ sections = [], className = '' }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        display: 'flex', 
        width: '100%', 
        borderRadius: 1,
        overflow: 'hidden'
      }}
      className={className}
    >
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <Box 
            sx={{ 
              flex: 1, 
              p: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="paperSubtitle" fontWeight={500}>
                {section.title}
              </Typography>
              <Typography variant="paperTitle">
                {section.value}
              </Typography>
            </Stack>
          </Box>
          {index < sections.length - 1 && (
            <Divider orientation="vertical" flexItem />
          )}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default NeviosAnalyticsStripe;
