'use client';

import React from 'react';
import { Box, Typography, Paper, Tooltip, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

const NeviosAnalyticsGroupMetricCard = ({ 
  data = [],
  height = '100%',
  ...props 
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        height: height,
        ...props.sx
      }}
    >
      {data.map((metric, index) => (
        <React.Fragment key={index}>
          {/* Metric Section */}
          <Box 
            sx={{ 
              flex: 1,
              px: 2,
              pb: 1.5,
              pt: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header with title and dotted line */}
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '13px'
                    }}
                  >
                    {metric.label}
                  </Typography>
                  {metric.tooltip && (
                    <Tooltip title={metric.tooltip} arrow placement="top">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'text.primary'
                          }
                        }}
                      >
                        <InfoOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                {/* Dotted line under title - only width of title */}
                <Box 
                  sx={{
                    width: '100%',
                    height: '2px',
                    backgroundImage: 'radial-gradient(circle, rgba(204, 204, 204, 1) 1px, transparent 1px)',
                    backgroundSize: '4px 2px',
                    backgroundRepeat: 'repeat-x',
                    opacity: 1
                  }}
                />
              </Box>
            </Box>

            {/* Value */}
            <Typography
              sx={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#212121',
                lineHeight: 1,
              }}
            >
              {metric.value}
            </Typography>
          </Box>

          {/* Divider between sections (except for last item) */}
          {index < data.length - 1 && (
            <Box
              sx={{
                width: '1px',
                backgroundColor: 'divider',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default NeviosAnalyticsGroupMetricCard; 