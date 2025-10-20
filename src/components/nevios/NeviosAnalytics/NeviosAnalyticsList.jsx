'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';
import NeviosAnalyticsBlock from './NeviosAnalyticsBlock';

const NeviosAnalyticsList = ({ 
  title = "Sessions by landing page",
  tooltip,
  data = [],
  height = '100%',
  symbol = null,
  showTrends = true,
  ...props 
}) => {
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const renderChangeIndicator = (percentageChange) => {
    if (percentageChange === null || percentageChange === undefined || percentageChange === 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#9e9e9e', ml: 1 }}>
          <Remove sx={{ fontSize: 14, mr: 0.3 }} />
        </Box>
      );
    }

    const isPositive = percentageChange > 0;
    const color = isPositive ? '#4caf50' : '#f44336';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color, ml: 1 }}>
        {isPositive ? (
          <ArrowUpward sx={{ fontSize: 14, mr: 0.3 }} />
        ) : (
          <ArrowDownward sx={{ fontSize: 14, mr: 0.3 }} />
        )}
        <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 600 }}>
          {Math.abs(percentageChange).toFixed(1)}%
        </Typography>
      </Box>
    );
  };

  return (
    <NeviosAnalyticsBlock title={title} tooltip={tooltip} height={height} {...props}>
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        mt: -1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        },
      }}>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1,
              px: 1.5,
              marginBottom: 1,
              borderRadius: '8px',
              backgroundColor: 'background.defaultLight',
              '&:hover': {
                backgroundColor: '#fafafa',
              },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.4,
                }}
              >
                {item.label}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexShrink: 0 
            }}>

              {symbol && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#212121',
                    textAlign: 'right',
                    mr: '4px',
                  }}
                >
                  {symbol}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#212121',
                  textAlign: 'right',
                }}
              >
                {formatNumber(item.value)}
              </Typography>
              
              {showTrends && renderChangeIndicator(item.percentageChange)}
            </Box>
          </Box>
        ))}
      </Box>
    </NeviosAnalyticsBlock>
  );
};

export default NeviosAnalyticsList; 