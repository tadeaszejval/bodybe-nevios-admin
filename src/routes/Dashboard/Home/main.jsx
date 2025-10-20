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
    { date: 'Jun 2024', primary: 100000, secondary: 50000 },
    { date: 'Jul 2024', primary: 500000, secondary: 200000 },
    { date: 'Aug 2024', primary: 1200000, secondary: 800000 },
    { date: 'Sep 2024', primary: 6000000, secondary: 3000000 },
    { date: 'Oct 2024', primary: 2500000, secondary: 2200000 },
    { date: 'Nov 2024', primary: 2800000, secondary: 1800000 },
    { date: 'Dec 2024', primary: 500000, secondary: 400000 },
    { date: 'Jan 2025', primary: 200000, secondary: 150000 },
    { date: 'Feb 2025', primary: 100000, secondary: 80000 },
    { date: 'Mar 2025', primary: 50000, secondary: 30000 }
  ];

  const ordersData = [
    { date: 'Jun 2024', primary: 45, secondary: 32 },
    { date: 'Jul 2024', primary: 67, secondary: 48 },
    { date: 'Aug 2024', primary: 89, secondary: 65 },
    { date: 'Sep 2024', primary: 156, secondary: 98 },
    { date: 'Oct 2024', primary: 134, secondary: 112 },
    { date: 'Nov 2024', primary: 178, secondary: 145 },
    { date: 'Dec 2024', primary: 98, secondary: 76 },
    { date: 'Jan 2025', primary: 67, secondary: 54 },
    { date: 'Feb 2025', primary: 45, secondary: 38 },
    { date: 'Mar 2025', primary: 34, secondary: 28 }
  ];

  const conversionData = [
    { date: 'Jun 2024', primary: 2.3, secondary: 1.8 },
    { date: 'Jul 2024', primary: 3.1, secondary: 2.4 },
    { date: 'Aug 2024', primary: 4.2, secondary: 3.6 },
    { date: 'Sep 2024', primary: 5.8, secondary: 4.1 },
    { date: 'Oct 2024', primary: 4.9, secondary: 4.3 },
    { date: 'Nov 2024', primary: 6.2, secondary: 5.1 },
    { date: 'Dec 2024', primary: 3.7, secondary: 3.2 },
    { date: 'Jan 2025', primary: 2.9, secondary: 2.5 },
    { date: 'Feb 2025', primary: 2.1, secondary: 1.9 },
    { date: 'Mar 2025', primary: 1.8, secondary: 1.6 }
  ];

  const sessionsByLandingPageData = [
    {
      label: "Homepage · /",
      value: 93413,
      percentageChange: 5.9,
      previousValue: 88234
    },
    {
      label: "Custom Page · /pages/oslavy-75-let",
      value: 27311,
      percentageChange: null,
      previousValue: null
    },
    {
      label: "Custom Page · /pages/nordic",
      value: 13885,
      percentageChange: null,
      previousValue: null
    },
    {
      label: "Custom Page · /pages/oslavy-botas",
      value: 13419,
      percentageChange: null,
      previousValue: null
    },
    {
      label: "Product · /products/iconic-legend-75-limited-edition",
      value: 4998,
      percentageChange: null,
      previousValue: null
    },
    {
      label: "Product · /products/iconic-victory-76",
      value: 4065,
      percentageChange: null,
      previousValue: null
    },
    {
      label: "Product · /products/organic-shadow",
      value: 3735,
      percentageChange: null,
      previousValue: null
    },
    {
      label: "Custom Page · /pages/botas-x-bjp",
      value: 3497,
      percentageChange: null,
      previousValue: null
    }
  ];

  const sessionsByLocationData = [
    { 
      label: 'Czechia · Prague · Prague', 
      value: 64436, 
      percentageChange: -10,
      previousValue: 58292
    },
    { 
      label: 'Czechia · Hlavni mesto Praha · Prague', 
      value: 24167, 
      percentageChange: 607.3,
      previousValue: 201
    },
    { 
      label: 'Czechia · South Moravian · Brno', 
      value: 12147, 
      percentageChange: 120.9,
      previousValue: 2
    },
    { 
      label: 'Czechia · None · None', 
      value: 9683, 
      percentageChange: null,
      previousValue: 3000
    },
    { 
      label: 'Czechia · None · None', 
      value: 9683, 
      percentageChange: null,
      previousValue: 4828
    },
    { 
      label: 'Czechia · None · None', 
      value: 9683, 
      percentageChange: null,
      previousValue: 8
    },
    { 
      label: 'Czechia · None · None', 
      value: 9683, 
      percentageChange: null,
      previousValue: 8
    }
  ];

  const deviceTypeData = [
    {
      label: "Mobile",
      value: 200200,
      percentageChange: 104.2
    },
    {
      label: "Desktop",
      value: 44200,
      percentageChange: 2.7
    },
    {
      label: "Other",
      value: 3300,
      percentageChange: null
    },
    {
      label: "Tablet",
      value: 1000,
      percentageChange: null
    }
  ];

  const returningCustomerData = [
    { value: 8.5 },
    { value: 9.2 },
    { value: 8.8 },
    { value: 9.5 },
    { value: 90.2 },
    { value: 9.8 },
    { value: 9.83 }
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
      <NeviosAnalyticsGroupMetricCard data={customerMetrics} />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
        {/* Sales Chart with CZK */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsLineChart
            title="Total sales over time"
            value="CZK 11,961,958.70"
            data={salesData}
            height={250}
            valueLabel="CZK"
          />
        </Box>


        {/* Orders Chart with unit label */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsLineChart
            title="Orders over time"
            value="1,234 orders"
            data={ordersData}
            height={250}
            primaryColor="#10B981"
            secondaryColor="#D1FAE5"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsMetricCard
            title="Returning customer rate"
            value="9.83%"
            data={returningCustomerData}
            color="#3B82F6"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsMetricCard
            title="Average order value"
            value="$127.50"
            data={returningCustomerData}
            color="#10B981"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <NeviosAnalyticsMetricCard
            title="Customer satisfaction"
            value="4.8/5"
            data={returningCustomerData}
            color="#F59E0B"
          />
        </Box>
      </Box>

      {/* Conversion Rate Chart with percentage */}
      <NeviosAnalyticsLineChart
        title="Conversion rate over time"
        value="4.2% average"
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

