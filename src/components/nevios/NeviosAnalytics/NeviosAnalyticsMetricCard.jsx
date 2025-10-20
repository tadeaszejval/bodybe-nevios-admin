'use client';

import React from 'react';
import { Box, Typography, Paper, Tooltip, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { ComposedChart, Line, Area, ResponsiveContainer } from 'recharts';

const NeviosAnalyticsMetricCard = ({ 
  title = "Returning customer rate",
  tooltip,
  value = "9.83%",
  data = [],
  color = "#3B82F6",
  height = '100%',
  ...props 
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        py: 1.5,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        height: height,
        display: 'flex',
        flexDirection: 'column',
        ...props.sx
      }}
    >
      {/* Header with title and dotted line */}
      <Box sx={{ mb: 1 }}>
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
                      color: 'text.primary'
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

      {/* Content area with value and chart */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Value */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#212121',
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>

        {/* Small sparkline chart */}
        {data && data.length > 0 && (
          <Box sx={{ width: 80, height: 30, ml: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <defs>
                  <linearGradient id={`sparklineGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                {/* Area fill for shadow effect */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="none"
                  fill={`url(#sparklineGradient-${color.replace('#', '')})`}
                />
                
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default NeviosAnalyticsMetricCard; 