'use client'
import React, { useState, useEffect } from 'react';
import SalesDatePicker from './SalesDatePicker';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesDataFetcher() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [sourceCounts, setSourceCounts] = useState({});
  const [totals, setTotals] = useState({
    totalRevenue: 0,
    totalSalesAmount: 0,
    demoCompletedRevenue: 0,
    demoCompletedSalesAmount: 0,
    noDemoCompletedRevenue: 0,
    noDemoCompletedSalesAmount: 0,
    avgDailyMRR: 0,
    mrrTrajectory: 0,
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchSalesData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchSalesData = async (start, end) => {
    try {
      const response = await fetch('https://wse6p5xqvwvjqwjdzo5qphqkue0titsh.lambda-url.us-west-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start_date: start.toISOString().split('T')[0], end_date: end.toISOString().split('T')[0] }),
      });
      if (response.status === 429) {
        console.error('Too many requests. Please try again later.');
        return;
      }
      const data = await response.json();
      console.log(data, 'data');
      processSalesData(data);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    }
  };

  const processSalesData = (data) => {
    let totalRevenue = 0;
    let totalSalesAmount = 0;
    let demoCompletedRevenue = 0;
    let demoCompletedSalesAmount = 0;
    let noDemoCompletedRevenue = 0;
    let noDemoCompletedSalesAmount = 0;
    const sourceCounts = {};
    const groupedData = data.filter(item => {
      if (item["Product Name"] === "Demo Completed Totals") {
        demoCompletedRevenue = item.Total_Revenue;
        demoCompletedSalesAmount = item.Sales_Amount;
        return false;
      } else if (item["Product Name"] === "No Demo Completed Totals") {
        noDemoCompletedRevenue = item.Total_Revenue;
        noDemoCompletedSalesAmount = item.Sales_Amount;
        return false;
      } else if (item["Product Name"] === "All Totals") {
        totalRevenue = item.Total_Revenue;
        totalSalesAmount = item.Sales_Amount;
        return false;
      }
      return true;
    });

    const detailedData = [];
    data.forEach(item => {
      item.Emails.forEach((email, index) => {
        detailedData.push({
          saleDate: item["Sale Dates"][index],
          email,
          productName: item["Product Name"],
          price: item["Price"],
          demoCompleted: item["Demo Completed"],
          source: item["Sources"][index],
        });
        if (!sourceCounts[email]) {
          sourceCounts[email] = item["Sources"][index];
        }
      });
    });
    console.log('Detailed Data:', detailedData);

    const aggregatedSourceCounts = {};
    Object.values(sourceCounts).forEach(source => {
      if (aggregatedSourceCounts[source]) {
        aggregatedSourceCounts[source]++;
      } else {
        aggregatedSourceCounts[source] = 1;
      }
    });

    const workdays = calculateWorkdays(new Date(startDate), new Date(endDate));
    const avgDailyMRR = workdays > 0 ? totalRevenue / workdays : 0;
    const mrrTrajectory = avgDailyMRR * 22; // Assuming 22 workdays in a month

    setTotals({
      totalRevenue,
      totalSalesAmount,
      demoCompletedRevenue,
      demoCompletedSalesAmount,
      noDemoCompletedRevenue,
      noDemoCompletedSalesAmount,
      avgDailyMRR,
      mrrTrajectory,
    });
    setGroupedData(groupedData);
    setDetailedData(detailedData);
    setSourceCounts(aggregatedSourceCounts);
  };

  const calculateWorkdays = (startDate, endDate) => {
    let count = 0;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', day: 'numeric' });
  };

  const aggregateSalesByDay = (data) => {
    const aggregatedData = {};
    data.forEach(item => {
      const date = new Date(item.saleDate).toISOString().split('T')[0]; // Ensure date is in YYYY-MM-DD format
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }
      aggregatedData[date] += item.price;
    });

    // Convert the aggregated data to an array and sort by date
    return Object.keys(aggregatedData)
      .map(date => ({
        date,
        value: aggregatedData[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
  };

  return (
    <>
      <div className="bg-gray-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mx-auto max-w-2xl lg:max-w-none text-center">
            <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Sales Data</Heading>
            <p className="mt-4 text-lg leading-8 text-gray-600">Overview of sales data based on the selected date range.</p>
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
            <StatCard title="Total" value={totals.totalRevenue} subtitle={`Sales Amount: ${totals.totalSalesAmount}`} trendData={aggregateSalesByDay(detailedData)} />
            <StatCard title="Demo Completed" value={totals.demoCompletedRevenue} subtitle={`Sales Amount: ${totals.demoCompletedSalesAmount}`} trendData={aggregateSalesByDay(detailedData.filter(item => item.demoCompleted === "Yes"))} />
            <StatCard title="No Demo Completed" value={totals.noDemoCompletedRevenue} subtitle={`Sales Amount: ${totals.noDemoCompletedSalesAmount}`} trendData={aggregateSalesByDay(detailedData.filter(item => item.demoCompleted === "No"))} />
            <StatCard title="Avg. Daily MRR Increase" value={totals.avgDailyMRR} trendData={aggregateSalesByDay(detailedData)} />
            <StatCard title="MRR Increase Trajectory" value={totals.mrrTrajectory} trendData={aggregateSalesByDay(detailedData)} />
          </dl>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <SalesDatePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            fetchSalesData={fetchSalesData}
          />
          <DataTable title="Grouped Data" data={groupedData} columns={groupedColumns} />
          <DataTable title="Detailed Data" data={detailedData} columns={detailedColumns} />
        </div>
      </div>
    </>
  );
}

const StatCard = ({ title, value, subtitle, trendData }) => (
  <div className="flex flex-col bg-white p-4 shadow rounded-md">
    <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{title}</dt>
    <dd className="text-2xl font-bold tracking-tight text-gray-900 mt-1 text-left">{formatCurrency(value)}</dd>
    {subtitle && <dd className="text-sm text-gray-600 mt-1 text-left">{subtitle}</dd>}
    <div className="flex-grow w-full">
      <TrendGraph data={trendData} />
    </div>
  </div>
);

const TrendGraph = ({ data }) => {
  console.log('TrendGraph data:', data); // Debugging line to check the data
  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => formatDate(tick)}
          ticks={[data[0]?.date, data[data.length - 1]?.date]} // Show only start and end dates
        />
        <YAxis tickFormatter={(tick) => formatCurrency(tick)} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#0072c6" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const formatCurrency = (value) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'short', day: 'numeric' });
};

const DataTable = ({ title, data, columns }) => (
  <div className="mt-4">
    <Heading className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</Heading>
    <Table className="mt-2 [--gutter:theme(spacing.4)] lg:[--gutter:theme(spacing.6)]">
      <TableHead>
        <TableRow>
          {columns.map((col, index) => (
            <TableHeader key={index}>{col}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((col, colIndex) => (
              <TableCell key={colIndex}>{item[col]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const groupedColumns = ["Product Name", "Price", "Demo Completed", "Total_Revenue", "Sales_Amount"];
const detailedColumns = ["saleDate", "email", "productName", "price", "demoCompleted", "source"];