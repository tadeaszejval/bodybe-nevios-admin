'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { ComposedChart, Line, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, CartesianGrid, Area } from 'recharts';
import NeviosAnalyticsBlock from './NeviosAnalyticsBlock';

const NeviosAnalyticsLineChart = ({
  title,
  tooltip,
  value,
  data = [],
  primaryDataKey = 'primary',
  secondaryDataKey = 'secondary',
  primaryLabel = 'Current',
  secondaryLabel = 'Previous',
  xAxisDataKey = 'date',
  formatValue = (value) => value,
  formatXAxis = (value) => value,
  formatYAxis = (value) => value,
  primaryColor = '#3B82F6',
  secondaryColor = '#D1D5DB',
  showSecondary = true,
  height = '100%', // Default to 100% height
  chartHeight = 300, // Chart area height (when height is not provided)
  valueLabel = 'CZK', // Dynamic currency/unit label
  ...props
}) => {
  // Calculate the chart area height if total height is provided
  const getActualChartHeight = () => {
    if (height !== '100%' && height) {
      // Subtract space for title block (~80px), legend (~50px), and padding (~20px)
      return height - 150;
    }
    return chartHeight;
  };

  const actualChartHeight = getActualChartHeight();

  // Calculate dynamic Y-axis width based on content
  const calculateYAxisWidth = () => {
    if (!data.length) return 65;
    
    // Find the maximum value to determine longest label
    const allValues = data.flatMap(d => [d[primaryDataKey], d[secondaryDataKey]].filter(Boolean));
    const maxValue = Math.max(...allValues);
    
    // Format the max value to see how long it would be
    let maxLabel = '';
    if (maxValue >= 1000000) {
      maxLabel = `${valueLabel} ${Math.round(maxValue / 1000000)}M`;
    } else if (maxValue >= 1000) {
      maxLabel = `${valueLabel} ${Math.round(maxValue / 1000)}K`;
    } else {
      maxLabel = `${valueLabel} ${maxValue}`;
    }
    
    // Calculate width based on label length (roughly 8px per character + padding)
    const estimatedWidth = Math.max(maxLabel.length * 7 + 15, 50);
    return Math.min(estimatedWidth, 85); // Cap at 85px max
  };

  // Custom tick formatter for Y-axis
  const formatYAxisTick = (value) => {
    if (value === 0) {
      return valueLabel ? `${valueLabel} 0` : '0';
    }
    if (value >= 1000000) {
      return valueLabel ? `${valueLabel} ${Math.round(value / 1000000)}M` : `${Math.round(value / 1000000)}M`;
    } else if (value >= 1000) {
      return valueLabel ? `${valueLabel} ${Math.round(value / 1000)}K` : `${Math.round(value / 1000)}K`;
    }
    return valueLabel ? `${valueLabel} ${value}` : `${value}`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter to only show entries with stroke (Line entries, not Area entries which have fill but no stroke)
      const lineEntries = payload.filter(entry => entry.stroke && entry.stroke !== 'none');
      
      // Get the data point to access comparison date and check if comparison exists
      const dataPoint = lineEntries[0]?.payload;
      const hasComparison = dataPoint?.hasComparison;
      
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            p: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '200px'
          }}
        >
          <Typography 
            sx={{ 
              fontSize: '14px',
              fontWeight: 600,
              color: 'text.primary',
              mb: 1
            }}
          >
            Total sales
          </Typography>
          
          {lineEntries.map((entry, index) => {
            // Only show secondary data if we have comparison enabled (regardless of value)
            if (entry.dataKey === secondaryDataKey && !hasComparison) {
              return null;
            }
            
            // Determine the correct date to show
            const displayDate = entry.dataKey === primaryDataKey 
              ? label 
              : dataPoint?.secondaryDate || label;
            
            return (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: index === lineEntries.length - 1 ? 0 : 0.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 2,
                      backgroundColor: entry.color,
                      borderRadius: entry.strokeDasharray ? 0 : 1,
                      ...(entry.strokeDasharray && {
                        backgroundImage: `repeating-linear-gradient(to right, ${entry.color} 0px, ${entry.color} 2px, transparent 2px, transparent 4px)`,
                        backgroundColor: 'transparent'
                      })
                    }}
                  />
                  <Typography 
                    sx={{ 
                      fontSize: '12px',
                      color: 'text.secondary',
                      fontWeight: 400
                    }}
                  >
                    {formatXAxis ? formatXAxis(displayDate) : displayDate}
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'text.primary'
                  }}
                >
                  {valueLabel} {entry.value ? entry.value.toLocaleString() : '0'}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }) => {
    // Get unique entries by dataKey (take the last occurrence which should be the Line, not Area)
    const uniqueEntries = [];
    const seen = new Set();
    
    // Reverse the payload and take first occurrence of each dataKey (which is the last in original order)
    payload?.slice().reverse().forEach(entry => {
      if ((entry.dataKey === primaryDataKey || entry.dataKey === secondaryDataKey) && !seen.has(entry.dataKey)) {
        uniqueEntries.unshift(entry); // Add to beginning to maintain original order
        seen.add(entry.dataKey);
      }
    });
    
    const lineEntries = uniqueEntries;
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          justifyContent: 'center',
          mt: 0,
          mb: 0,
          fontSize: '12px'
        }}
      >
        {lineEntries.map((entry, index) => {
          // Don't show secondary legend if no comparison data
          if (entry.dataKey === secondaryDataKey && !secondaryLabel) {
            return null;
          }
          
          return (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 2,
                  backgroundColor: entry.color,
                  borderRadius: entry.strokeDasharray ? 0 : 1,
                  ...(entry.strokeDasharray && {
                    backgroundImage: `repeating-linear-gradient(to right, ${entry.color} 0px, ${entry.color} 3px, transparent 3px, transparent 6px)`,
                    backgroundColor: 'transparent'
                  })
                }}
              />
              <Typography 
                sx={{ 
                  fontSize: '12px',
                  color: 'text.secondary',
                  fontWeight: 400
                }}
              >
                {entry.dataKey === primaryDataKey ? primaryLabel : secondaryLabel}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Determine if we should show secondary line based on data and props
  const shouldShowSecondary = showSecondary && secondaryLabel && data.some(d => d.hasComparison);

  return (
    <NeviosAnalyticsBlock
      title={title}
      tooltip={tooltip}
      value={value}
      height={height}
      {...props}
    >
        <Box sx={{ 
          width: '100%', 
          height: actualChartHeight
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5
              }}
            >
              <defs>
                {/* Primary gradient */}
                <linearGradient id={`primaryGradient-${primaryColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
                
                {/* Secondary gradient */}
                {shouldShowSecondary && (
                  <linearGradient id={`secondaryGradient-${secondaryColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={secondaryColor} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={secondaryColor} stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              
              <CartesianGrid 
                strokeDasharray="none" 
                stroke="#E5E7EB" 
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey={xAxisDataKey}
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#6B7280',
                  dy: 10
                }}
                tickFormatter={formatXAxis}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#6B7280',
                  textAnchor: 'end'
                }}
                tickFormatter={formatYAxisTick}
                domain={[0, 'dataMax']}
                width={calculateYAxisWidth()}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Primary area fill (shadow effect) */}
              <Area
                type="monotone"
                dataKey={primaryDataKey}
                stroke="none"
                fill={`url(#primaryGradient-${primaryColor.replace('#', '')})`}
              />
              
              {/* Secondary area fill (shadow effect) - only show if we have comparison data */}
              {shouldShowSecondary && (
                <Area
                  type="monotone"
                  dataKey={secondaryDataKey}
                  stroke="none"
                  fill={`url(#secondaryGradient-${secondaryColor.replace('#', '')})`}
                />
              )}
              
              {/* Primary line (solid) */}
              <Line
                type="monotone"
                dataKey={primaryDataKey}
                stroke={primaryColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: primaryColor,
                  strokeWidth: 0
                }}
              />
              
              {/* Secondary line (dotted) - only show if we have comparison data */}
              {shouldShowSecondary && (
                <Line
                  type="monotone"
                  dataKey={secondaryDataKey}
                  stroke={secondaryColor}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    fill: secondaryColor,
                    strokeWidth: 0
                  }}
                />
              )}
              
              <Legend 
                content={<CustomLegend />}
                wrapperStyle={{ paddingTop: '30px', paddingBottom: '0px' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </NeviosAnalyticsBlock>
  );
};

export default NeviosAnalyticsLineChart; 