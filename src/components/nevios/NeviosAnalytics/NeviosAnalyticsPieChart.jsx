'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';
import NeviosAnalyticsBlock from './NeviosAnalyticsBlock';

const NeviosAnalyticsPieChart = ({ 
  title = "Sessions by device type",
  tooltip,
  data = [],
  height = '100%',
  colors = ['#3B82F6', '#8B5CF6', '#6366F1', '#EC4899'],
  ...props 
}) => {
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatValue = (num) => {
    return num.toLocaleString();
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const totalChange = data.length > 0 ? data.reduce((sum, item) => sum + (item.percentageChange || 0), 0) / data.length : 0;

  const renderChangeIndicator = (percentageChange) => {
    if (percentageChange === null || percentageChange === undefined || percentageChange === 0) {
      return null;
    }

    const isPositive = percentageChange > 0;
    const color = isPositive ? '#4caf50' : '#f44336';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color, ml: 1 }}>
        {isPositive ? (
          <ArrowUpward sx={{ fontSize: 12, mr: 0.2 }} />
        ) : (
          <ArrowDownward sx={{ fontSize: 12, mr: 0.2 }} />
        )}
        <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 600 }}>
          {Math.abs(percentageChange).toFixed(1)}%
        </Typography>
      </Box>
    );
  };

  const renderTotalChangeIndicator = () => {
    if (totalChange === null || totalChange === undefined || totalChange === 0) {
      return null;
    }

    const isPositive = totalChange > 0;
    const color = isPositive ? '#4caf50' : '#f44336';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color, mt: 0.5 }}>
        {isPositive ? (
          <ArrowUpward sx={{ fontSize: 14, mr: 0.3 }} />
        ) : (
          <ArrowDownward sx={{ fontSize: 14, mr: 0.3 }} />
        )}
                 <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 600 }}>
           {Math.abs(totalChange).toFixed(0)}%
         </Typography>
      </Box>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload;
      // Find the index of this data item in our data array
      const dataIndex = data.findIndex(item => item.label === itemData.label);
      const segmentColor = colors[dataIndex >= 0 ? dataIndex : 0];
      
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            minWidth: '160px',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: segmentColor,
                flexShrink: 0,
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            />
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#212121',
                flexShrink: 0,
              }}
                          >
                {itemData.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#212121',
                  ml: 'auto',
                }}
              >
                {formatValue(itemData.value)}
              </Typography>
              {itemData.percentageChange !== null && itemData.percentageChange !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {itemData.percentageChange > 0 ? (
                    <ArrowUpward sx={{ fontSize: 12, mr: 0.2, color: '#4caf50' }} />
                  ) : (
                    <ArrowDownward sx={{ fontSize: 12, mr: 0.2, color: '#f44336' }} />
                  )}
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: itemData.percentageChange > 0 ? '#4caf50' : '#f44336',
                    }}
                  >
                    {Math.abs(itemData.percentageChange).toFixed(1)}%
                  </Typography>
                </Box>
              )}
          </Box>
        </Box>
      );
    }
    return null;
  };

  const renderCenterLabel = () => {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#212121',
            lineHeight: 1,
          }}
        >
          {formatNumber(totalValue)}
        </Typography>
        {renderTotalChangeIndicator()}
      </Box>
    );
  };

  return (
    <NeviosAnalyticsBlock title={title} tooltip={tooltip} height={height} {...props}>
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        mt: -1,
      }}>
        {/* Pie Chart */}
        <Box sx={{ flex: 1, height: '100%', position: 'relative', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="95%"
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />} 
                wrapperStyle={{ zIndex: 9999 }}
                contentStyle={{ zIndex: 9999 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {renderCenterLabel()}
        </Box>

                {/* Legend */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          height: '100%',
          justifyContent: 'center'
        }}>
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: colors[index % colors.length],
                    mr: 1,
                    flexShrink: 0
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexShrink: 0,
                ml: 1
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#212121',
                    textAlign: 'right',
                  }}
                >
                  {formatNumber(item.value)}
                </Typography>
                
                {renderChangeIndicator(item.percentageChange)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </NeviosAnalyticsBlock>
  );
};

export default NeviosAnalyticsPieChart; 