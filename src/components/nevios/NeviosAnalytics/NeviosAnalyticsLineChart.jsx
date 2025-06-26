'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, CartesianGrid } from 'recharts';
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
  height = 300,
  valueLabel = 'CZK', // Dynamic currency/unit label
  ...props
}) => {
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
          
          {payload.map((entry, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: index === payload.length - 1 ? 0 : 0.5
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
                  {formatXAxis ? formatXAxis(label) : label}
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
          ))}
        </Box>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }) => {
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
        {payload?.map((entry, index) => (
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
        ))}
      </Box>
    );
  };

  return (
    <NeviosAnalyticsBlock
      title={title}
      tooltip={tooltip}
      value={value}
      {...props}
    >
      <Box sx={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 20
            }}
          >
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
            
            {/* Secondary line (dotted) */}
            {showSecondary && (
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
              wrapperStyle={{ paddingTop: '5px', paddingBottom: '0px' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </NeviosAnalyticsBlock>
  );
};

export default NeviosAnalyticsLineChart; 