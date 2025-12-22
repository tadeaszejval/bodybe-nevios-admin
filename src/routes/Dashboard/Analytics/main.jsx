"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { TbChartBar } from "react-icons/tb";
import { DashboardHeader } from "../../../components/DashboardHeader";
import NeviosAnalyticsMetricCard from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsMetricCard";
import NeviosAnalyticsLineChart from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsLineChart";
import NeviosAnalyticsList from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsList";
import { NeviosDatePicker, NeviosCompareDatePicker, formatDateRange } from "../../../components/nevios/NeviosDatePicker";
import { postRequest, getRequest } from "../../../utils/neviosExpress";
import dayjs from "dayjs";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";

const MARKET = "vasky/czechia";

// Helper function to format currency
const formatCurrency = (value) => {
  if (!value) return "CZK 0";
  return `CZK ${value.toLocaleString()}`;
};

// Helper function to format numbers
const formatNumber = (value) => {
  if (!value) return "0";
  return value.toLocaleString();
};

// Helper function to format percentage
const formatPercentage = (value) => {
  if (!value) return "0%";
  return `${value.toFixed(1)}%`;
};

// Helper function to format date range for display
const formatDateRangeForDisplay = (dateRange) => {
  if (!dateRange || !dateRange[0] || !dateRange[1]) return "";
  const start = dateRange[0].format('MMM D');
  const end = dateRange[1].format('MMM D, YYYY');
  return `${start} - ${end}`;
};

export default function DashboardAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [compareDateRange, setCompareDateRange] = useState(null);
  const [data, setData] = useState({
    revenueGross: null,
    ordersTotal: null,
    sessions: null,
    conversionRate: null
  });
  const [timeseriesData, setTimeseriesData] = useState({
    revenueGross: null,
    sessions: null,
    ordersAvgValue: null,
    ordersConversionRate: null
  });
  const [listData, setListData] = useState(null);

  // Helper function to get metric display name
  const getMetricDisplayName = (key) => {
    const metricLabels = {
      'revenue_total_gross': 'Total Sales',
      'revenue_total_net': 'Net Sales',
      'revenue_total_vat': 'Taxes',
      'revenue_subtotal_gross': 'Product Revenue',
      'revenue_subtotal_net': 'Product Revenue w/o Taxes',
      'revenue_shipping_gross': 'Shipping Charges',
      'revenue_tip_gross': 'Tips',
      'revenue_discount_gross': 'Discounts'
    };
    return metricLabels[key] || key;
  };

  // Transform metrics data for the list component
  const transformMetricsData = (metricsResponse) => {
    if (!metricsResponse?.data) return [];
    
    return metricsResponse.data.map(metric => ({
      label: getMetricDisplayName(metric.key),
      value: Math.round(metric.value || 0)
    }));
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const formattedDateRange = formatDateRange(dateRange);
        const formattedCompareDateRange = compareDateRange ? formatDateRange(compareDateRange) : null;
        
        // Base API parameters
        const baseParams = {
          market: MARKET,
          ...formattedDateRange,
        };

        // Add comparison parameters only if comparison is enabled
        const apiParams = formattedCompareDateRange ? {
          ...baseParams,
          compare: 'custom',
          compare_date_from: formattedCompareDateRange.date_from,
          compare_date_to: formattedCompareDateRange.date_to
        } : baseParams;
        
        // Fetch metric cards data using single-metric component endpoint
        const [
          revenueGrossResponse,
          ordersTotalResponse,
          sessionsResponse,
          conversionRateResponse
        ] = await Promise.all([
          // Revenue Total Gross
          postRequest('/server/analytics/components/single-metric/revenue_total_gross', apiParams),

          // Orders Total
          postRequest('/server/analytics/components/single-metric/orders_total', apiParams),

          // Sessions Total
          postRequest('/server/analytics/components/single-metric/sessions_total', apiParams),

          // Orders Conversion Rate
          postRequest('/server/analytics/components/single-metric/orders_conversion_rate', apiParams)
        ]);

        // Fetch timeseries data using timeseries component endpoint
        const [
          revenueGrossTimeseriesResponse,
          sessionsTimeseriesResponse,
          ordersAvgValueTimeseriesResponse,
          ordersConversionRateTimeseriesResponse
        ] = await Promise.all([
          // Revenue Total Gross Timeseries
          postRequest('/server/analytics/components/timeseries/revenue_total_gross', apiParams),

          // Sessions Total Timeseries
          postRequest('/server/analytics/components/timeseries/sessions_total', apiParams),

          // Orders Average Value Timeseries
          postRequest('/server/analytics/components/timeseries/orders_avg_value', apiParams),

          // Orders Conversion Rate Timeseries
          postRequest('/server/analytics/components/timeseries/orders_conversion_rate', apiParams)
        ]);

        // Fetch metrics data for the list component
        const metricsParams = {
          market: MARKET,
          ...formattedDateRange,
          'select[]': [
            'revenue_subtotal_gross',
            'revenue_subtotal_net',
            'revenue_discount_gross',
            'revenue_shipping_gross',
            'revenue_tip_gross',
            'revenue_total_net',
            'revenue_total_vat',
            'revenue_total_gross'
          ]
        };

        // Add comparison parameters for metrics if comparison is enabled
        if (formattedCompareDateRange) {
          metricsParams.compare = 'custom';
          metricsParams.compare_date_from = formattedCompareDateRange.date_from;
          metricsParams.compare_date_to = formattedCompareDateRange.date_to;
        }

        const revenueListMetricsResponse = await getRequest('/server/analytics/data/metrics', metricsParams);

        setData({
          revenueGross: revenueGrossResponse,
          ordersTotal: ordersTotalResponse,
          sessions: sessionsResponse,
          conversionRate: conversionRateResponse
        });

        setTimeseriesData({
          revenueGross: revenueGrossTimeseriesResponse,
          sessions: sessionsTimeseriesResponse,
          ordersAvgValue: ordersAvgValueTimeseriesResponse,
          ordersConversionRate: ordersConversionRateTimeseriesResponse
        });

        setListData(revenueListMetricsResponse);
        
      } catch (err) {
        console.error('Analytics data fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange, compareDateRange]);

  if (loading) {
    return <ContentLoadingScreen />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <DashboardHeader
          title="Analytics"
          icon={<TbChartBar size={24} />}
        />
      </Box>
    );
  }

  // Extract metric value from single-metric API response
  const getMetricValue = (responseData) => {
    return responseData?.data?.value || 0;
  };

  // Transform timeseries data for sparklines from single-metric API response
  const getSparklineData = (responseData) => {
    if (!responseData?.data?.timeseries) return [];
    
    return responseData.data.timeseries.map(point => ({
      value: point.value || 0
    }));
  };

  // Transform timeseries data for line charts from timeseries API response
  const getLineChartData = (responseData) => {
    if (!responseData?.data?.timeseries) return [];
    
    const currentData = responseData.data.timeseries || [];
    const compareData = responseData.data.compare_timeseries || [];
    
    
    // If no comparison data is available, return data without secondary values
    if (!compareDateRange || compareData.length === 0) {
      return currentData.map(point => ({
        date: point.formatted_date || point.date,
        primary: point.value || 0,
        secondary: 0, // No comparison data
        hasComparison: false
      }));
    }
    
    // Transform current data and map comparison values by INDEX position (not date)
    const transformedData = currentData.map((point, index) => {
      const comparePoint = compareData[index]; // Map by position, not date
      return {
        date: point.formatted_date || point.date,
        primary: point.value || 0,
        secondary: comparePoint?.value || 0,
        secondaryDate: comparePoint?.formatted_date || comparePoint?.date || null,
        hasComparison: true
      };
    });
    
    return transformedData;
  };

  return (
    <Box sx={{ p: 4 }}>
      <DashboardHeader
        title="Analytics"
        icon={<TbChartBar size={24} />}
      />
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', }}>
        {/* Date Pickers Section */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <NeviosDatePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select period"
          />
          <NeviosCompareDatePicker
            value={compareDateRange}
            onChange={setCompareDateRange}
            baseDateRange={dateRange}
          />
        </Box>

        {/* Metric Cards Section */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Revenue Total Gross */}
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <NeviosAnalyticsMetricCard
              title="Sales Total"
              tooltip="Total gross revenue before taxes and fees"
              value={formatCurrency(getMetricValue(data.revenueGross))}
              data={getSparklineData(data.revenueGross)}
              color="#3B82F6"
            />
          </Box>

          {/* Orders Total */}
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <NeviosAnalyticsMetricCard
              title="Orders Total"
              tooltip="Total number of orders placed"
              value={formatNumber(getMetricValue(data.ordersTotal))}
              data={getSparklineData(data.ordersTotal)}
              color="#10B981"
            />
          </Box>

          {/* Sessions Total */}
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <NeviosAnalyticsMetricCard
              title="Sessions Total"
              tooltip="Total number of website sessions"
              value={formatNumber(getMetricValue(data.sessions))}
              data={getSparklineData(data.sessions)}
              color="#F59E0B"
            />
          </Box>

          {/* Orders Conversion Rate */}
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <NeviosAnalyticsMetricCard
              title="Orders Conversion Rate"
              tooltip="Percentage of sessions that resulted in orders"
              value={formatPercentage(getMetricValue(data.conversionRate))}
              data={getSparklineData(data.conversionRate)}
              color="#EF4444"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 2 }}>
            <NeviosAnalyticsLineChart
              title="Revenue Total Gross"
              tooltip="Daily revenue trends with comparison period"
              value={formatCurrency(timeseriesData.revenueGross?.data?.total_value || 0)}
              data={getLineChartData(timeseriesData.revenueGross)}
              primaryLabel={formatDateRangeForDisplay(dateRange)}
              secondaryLabel={compareDateRange ? formatDateRangeForDisplay(compareDateRange) : null}
              valueLabel="CZK"
              primaryColor="#3B82F6"
              secondaryColor="#A8C9FF"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <NeviosAnalyticsList
              title="Revenue Breakdown"
              symbol="CZK"
              tooltip="Detailed breakdown of revenue components with comparison"
              data={transformMetricsData(listData)}
              showTrends={false}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1 }}>
            <NeviosAnalyticsLineChart
              title="Sessions Total"
              tooltip="Daily session trends with comparison period"
              value={formatNumber(timeseriesData.sessions?.data?.total_value || 0)}
              data={getLineChartData(timeseriesData.sessions)}
              primaryLabel={formatDateRangeForDisplay(dateRange)}
              secondaryLabel={compareDateRange ? formatDateRangeForDisplay(compareDateRange) : null}
              valueLabel=""
              primaryColor="#F59E0B"
              secondaryColor="#D1D5DB"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <NeviosAnalyticsLineChart
              title="Orders Average Value"
              tooltip="Daily average order value trends with comparison period"
              value={formatCurrency(timeseriesData.ordersAvgValue?.data?.total_value || 0)}
              data={getLineChartData(timeseriesData.ordersAvgValue)}
              primaryLabel={formatDateRangeForDisplay(dateRange)}
              secondaryLabel={compareDateRange ? formatDateRangeForDisplay(compareDateRange) : null}
              valueLabel="CZK"
              primaryColor="#3B82F6"
              secondaryColor="#A8C9FF"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1 }}>
            <NeviosAnalyticsLineChart
              title="Orders Conversion Rate"
              tooltip="Daily conversion rate trends with comparison period"
              value={formatPercentage(timeseriesData.ordersConversionRate?.data?.total_value || 0)}
              data={getLineChartData(timeseriesData.ordersConversionRate)}
              primaryLabel={formatDateRangeForDisplay(dateRange)}
              secondaryLabel={compareDateRange ? formatDateRangeForDisplay(compareDateRange) : null}
              valueLabel="%"
              primaryColor="#EF4444"
              secondaryColor="#D1D5DB"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export const Analytics = DashboardAnalytics;
