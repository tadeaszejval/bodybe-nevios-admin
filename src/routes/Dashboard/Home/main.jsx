'use client';
import React from "react";
import { Box } from "@mui/material";
import { PageContainer } from "../../../components/PageContainer";
import NeviosAnalyticsLineChart from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsLineChart";
import NeviosAnalyticsHorizontalBarChart from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsHorizontalBarChart";
import NeviosAnalyticsPieChart from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsPieChart";
import NeviosAnalyticsMetricCard from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsMetricCard";
import NeviosAnalyticsGroupMetricCard from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsGroupMetricCard";
import NeviosAnalyticsList from "../../../components/nevios/NeviosAnalytics/NeviosAnalyticsList";
export default function DashboardHome() {
  const salesData = [
    { date: 'Jun 2024', primary: 0, secondary: 0 },
    { date: 'Jul 2024', primary: 0, secondary: 0 },
    { date: 'Aug 2024', primary: 0, secondary: 0 },
    { date: 'Sep 2024', primary: 0, secondary: 0 },
    { date: 'Oct 2024', primary: 0, secondary: 0 },
    { date: 'Nov 2024', primary: 0, secondary: 0 },
    { date: 'Dec 2024', primary: 0, secondary: 0 },
    { date: 'Jan 2025', primary: 0, secondary: 0 },
    { date: 'Feb 2025', primary: 0, secondary: 0 },
    { date: 'Mar 2025', primary: 0, secondary: 0 }
  ];

  const ordersData = [
    { date: 'Jun 2024', primary: 0, secondary: 0 },
    { date: 'Jul 2024', primary: 0, secondary: 0 },
    { date: 'Aug 2024', primary: 0, secondary: 0 },
    { date: 'Sep 2024', primary: 0, secondary: 0 },
    { date: 'Oct 2024', primary: 0, secondary: 0 },
    { date: 'Nov 2024', primary: 0, secondary: 0 },
    { date: 'Dec 2024', primary: 0, secondary: 0 },
    { date: 'Jan 2025', primary: 0, secondary: 0 },
    { date: 'Feb 2025', primary: 0, secondary: 0 },
    { date: 'Mar 2025', primary: 0, secondary: 0 }
  ];

  const conversionData = [
    { date: 'Jun 2024', primary: 0, secondary: 0 },
    { date: 'Jul 2024', primary: 0, secondary: 0 },
    { date: 'Aug 2024', primary: 0, secondary: 0 },
    { date: 'Sep 2024', primary: 0, secondary: 0 },
    { date: 'Oct 2024', primary: 0, secondary: 0 },
    { date: 'Nov 2024', primary: 0, secondary: 0 },
    { date: 'Dec 2024', primary: 0, secondary: 0 },
    { date: 'Jan 2025', primary: 0, secondary: 0 },
    { date: 'Feb 2025', primary: 0, secondary: 0 },
    { date: 'Mar 2025', primary: 0, secondary: 0 }
  ];

  const sessionsByLandingPageData = [
    {
      label: "No data",
      value: 0,
      percentageChange: null,
      previousValue: null
    }
  ];

  const sessionsByLocationData = [
    { 
      label: 'No data', 
      value: 0, 
      percentageChange: null,
      previousValue: null
    }
  ];

  const deviceTypeData = [
    {
      label: "Mobile",
      value: 0,
      percentageChange: null
    },
    {
      label: "Desktop",
      value: 0,
      percentageChange: null
    },
    {
      label: "Other",
      value: 0,
      percentageChange: null
    },
    {
      label: "Tablet",
      value: 0,
      percentageChange: null
    }
  ];

  const returningCustomerData = [
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 }
  ];

  const customerMetrics = [
    { label: "Amount spent", value: "Kč 0.00" },
    { label: "Orders", value: "0" },
    { label: "Customer since", value: "4 days" },
    { label: "RFM group", value: "Prospects" }
  ];
  return (
    <PageContainer
      customSx={{
        maxWidth: "850px"
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsMetricCard
            title="Returning customer rate"
            value="0%"
            data={returningCustomerData}
            color="#3B82F6"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsMetricCard
            title="Average order value"
            value="$0.00"
            data={returningCustomerData}
            color="#10B981"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsMetricCard
            title="Customer satisfaction"
            value="0/5"
            data={returningCustomerData}
            color="#F59E0B"
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
        {/* Sales Chart with CZK */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsLineChart
            title="Total sales over time"
            value="CZK 0.00"
            data={salesData}
            height={250}
            valueLabel="CZK"
          />
        </Box>


        {/* Orders Chart with unit label */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsLineChart
            title="Orders over time"
            value="0 orders"
            data={ordersData}
            height={250}
            primaryColor="#10B981"
            secondaryColor="#D1FAE5"
          />
        </Box>
      </Box>

      {/* Conversion Rate Chart with percentage */}
      <NeviosAnalyticsLineChart
        title="Conversion rate over time"
        value="0% average"
        data={conversionData}
        valueLabel="%"
        primaryColor="#F59E0B"
        secondaryColor="#FEF3C7"
        height={250}
      />

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsHorizontalBarChart
            title="Sessions by location"
            data={sessionsByLocationData}
            showPercentageChange={true}
            height={250}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsHorizontalBarChart
            title="Sessions by location"
            data={sessionsByLocationData}
            tooltip="Most visited pages and their performance changes"
            showPercentageChange={true}
            height={250}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsList
            title="Sessions by landing page"
            data={sessionsByLandingPageData}
            height={250}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsList
            title="Sessions by landing page"
            data={sessionsByLandingPageData}
            height={250}
          />
        </Box>
      </Box>
        <Box sx={{ width: '100%' }}>
          <NeviosAnalyticsPieChart
            title="Sessions by device type"
            data={deviceTypeData}
            height={300}
          />
        </Box>
    </PageContainer>
  );
}

export const Home = DashboardHome;

