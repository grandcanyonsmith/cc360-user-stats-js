'use client'
import React, { useState, useEffect } from 'react';
import SalesDatePicker from './SalesDatePicker';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

export default function SalesDataFetcher() {
  const [startDate, setStartDate] = useState(new Date());
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
    fetchSalesData(startDate, endDate);
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

  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString() + ' ' + date.toTimeString().split(' ')[0].slice(0, 5);
  };

  return (
    <>
      <div className="bg-gray-100 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none text-center">
            <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Sales Data</Heading>
            <p className="mt-4 text-lg leading-8 text-gray-600">Overview of sales data based on the selected date range.</p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-5">
            <StatCard title="Total" value={totals.totalRevenue} subtitle={`Sales Amount: ${totals.totalSalesAmount}`} />
            <StatCard title="Demo Completed" value={totals.demoCompletedRevenue} subtitle={`Sales Amount: ${totals.demoCompletedSalesAmount}`} />
            <StatCard title="No Demo Completed" value={totals.noDemoCompletedRevenue} subtitle={`Sales Amount: ${totals.noDemoCompletedSalesAmount}`} />
            <StatCard title="Avg. Daily MRR Increase" value={totals.avgDailyMRR} />
            <StatCard title="MRR Increase Trajectory" value={totals.mrrTrajectory} />
          </dl>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
const formatCurrency = (value) => `$${value.toLocaleString()}`;

const StatCard = ({ title, value, subtitle }) => (
  <div className="flex flex-col bg-white p-8 shadow rounded-md">
    <dt className="text-sm font-semibold leading-6 text-gray-600">{title}</dt>
    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{formatCurrency(value)}</dd>
    {subtitle && <dd className="text-sm font-semibold leading-6 text-gray-600">{subtitle}</dd>}
  </div>
);

const DataTable = ({ title, data, columns }) => (
  <div className="mt-8">
    <Heading className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</Heading>
    <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
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

const groupedColumns = ["Product Name", "Price", "Demo Completed", "Total Revenue", "Sales Amount"];
const detailedColumns = ["Sale Date", "Email", "Product Name", "Price", "Demo Completed", "Sources"];