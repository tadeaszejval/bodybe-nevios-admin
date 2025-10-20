import React from 'react';
import { Paper, Typography, Box, Tooltip, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

const NeviosAnalyticsBlock = ({ 
  title, 
  tooltip, 
  value, 
  children,
  height = '100%',
  sx = {},
  ...props 
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: '16px',
        height: height,
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
      {...props}
    >
      {/* Header with title and optional tooltip */}
      <Box sx={{ mb: value ? 1 : 2, flexShrink: 0 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '13px'
              }}
            >
              {title}
            </Typography>
            {tooltip && (
              <Tooltip title={tooltip} arrow placement="top">
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: 'transparent'
                    },
                    py: 0,
                    px: 0.5
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

      {/* Optional value display */}
      {value && (
        <Box sx={{ mb: 2, mt: 1, flexShrink: 0 }}>
          <Typography 
            component="div"
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '18px',
              lineHeight: 1.2
            }}
          >
            {value}
          </Typography>
        </Box>
      )}

      {/* Content area for charts or other components */}
      {children && (
        <Box sx={{ 
          flex: 1,
          minHeight: 0,
          mt: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </Box>
      )}
    </Paper>
  );
};

export default NeviosAnalyticsBlock;
