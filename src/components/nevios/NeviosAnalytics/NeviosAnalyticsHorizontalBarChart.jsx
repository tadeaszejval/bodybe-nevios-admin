'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import NeviosAnalyticsBlock from './NeviosAnalyticsBlock';

const NeviosAnalyticsHorizontalBarChart = ({
  title,
  tooltip,
  data = [],
  valueLabel = '',
  barColor = 'primary.500',
  comparisonBarColor = '#E5E7EB',
  showPercentageChange = true,
  maxBarWidth = 70, // percentage of container width for bar area
  height = 'auto', // height of the component
  ...props
}) => {
  // Find the maximum value to calculate bar widths
  const maxValue = Math.max(...data.map(item => item.value || 0));

  // Format large numbers - show whole numbers with commas
  const formatValue = (value) => {
    return value.toLocaleString();
  };

  // Format percentage change
  const formatPercentageChange = (change) => {
    if (!change && change !== 0) return null;
    const isPositive = change >= 0;
    return (
      <Typography
        component="span"
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: isPositive ? '#10B981' : '#EF4444',
          ml: 1
        }}
      >
        {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
      </Typography>
    );
  };

  return (
    <NeviosAnalyticsBlock
      title={title}
      tooltip={tooltip}
      {...props}
    >
      <Box sx={{ width: '100%', height: height === 'auto' ? 'auto' : height, overflow: 'auto', overflowX: 'auto' }}>
                {data.map((item, index) => {
          const barWidth = maxValue > 0 ? (item.value / maxValue) * maxBarWidth : 0;
          const comparisonBarWidth = maxValue > 0 && item.previousValue ? (item.previousValue / maxValue) * maxBarWidth : 0;
          
          return (
            <Box 
              key={index}
              sx={{ 
                mb: index === data.length - 1 ? 0 : 2,
                position: 'relative',
                minWidth: '100%'
              }}
            >
              {/* Location/Label */}
              <Typography
                sx={{
                  fontSize: '14px',
                  color: 'text.secondary',
                  fontWeight: 400,
                  mb: 1,
                  lineHeight: 1.3
                }}
              >
                {item.label}
              </Typography>

              {/* Current value bar with value positioned at bar end */}
              <Box sx={{ position: 'relative', mb: 1 }}>
                {/* Current bar area */}
                <Box sx={{ width: '100%', position: 'relative' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '15px',
                      borderRadius: '4px',
                      position: 'relative',
                      overflow: 'visible'
                    }}
                  >
                    {/* Current value bar */}
                    <Box
                      sx={{
                        width: `${barWidth}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>

                {/* Current value positioned at bar end */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    left: `${barWidth}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    ml: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    {valueLabel}{valueLabel && ' '}{formatValue(item.value)}
                  </Typography>
                  {showPercentageChange && formatPercentageChange(item.percentageChange)}
                </Box>
              </Box>

                            {/* Comparison bar (previous value) below */}
              {item.previousValue !== undefined && (
                <Box sx={{ position: 'relative' }}>
                  {/* Comparison bar area */}
                  <Box sx={{ width: '100%', position: 'relative' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '15px',
                        borderRadius: '4px',
                        position: 'relative',
                        overflow: 'visible'
                      }}
                    >
                      {/* Comparison bar */}
                      <Box
                        sx={{
                          width: `${comparisonBarWidth}%`,
                          height: '100%',
                          backgroundColor: comparisonBarColor,
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Previous value positioned at bar end */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      left: `${comparisonBarWidth}%`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      ml: 1
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#6B7280',
                        fontWeight: 400,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatValue(item.previousValue)}
                    </Typography>
                  </Box>
                </Box>
              )}


            </Box>
          );
        })}
      </Box>
    </NeviosAnalyticsBlock>
  );
};

export default NeviosAnalyticsHorizontalBarChart; 