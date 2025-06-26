import React from 'react';
import { Paper, Typography, Box, Tooltip, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

const NeviosAnalyticsBlock = ({ 
  title, 
  tooltip, 
  value, 
  children,
  sx = {},
  ...props 
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: '16px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        ...sx
      }}
      {...props}
    >
      {/* Header with title and optional tooltip */}
      <Box sx={{ mb: value ? 1 : 2 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '14px'
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

      {/* Optional value display */}
      {value && (
        <Box sx={{ mb: 1, mt: 1 }}>
          <Typography 
            component="div"
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '20px',
              lineHeight: 1.2
            }}
          >
            {value}
          </Typography>
        </Box>
      )}

      {/* Content area for charts or other components */}
      {children && (
        <Box sx={{ minHeight: '200px', mt: 1 }}>
          {children}
        </Box>
      )}
    </Paper>
  );
};

export default NeviosAnalyticsBlock;
