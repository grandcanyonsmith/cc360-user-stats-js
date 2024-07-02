'use client'
import React, { useState, useEffect } from 'react';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

export default function SalesDataFetcher() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
    const today = new Date();
    const priorDate = new Date().setDate(today.getDate() - 30);
    setStartDate(new Date(priorDate).toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const fetchSalesData = async () => {
    const response = await fetch('https://wse6p5xqvwvjqwjdzo5qphqkue0titsh.lambda-url.us-west-2.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ start_date: startDate, end_date: endDate }),
    });
    const data = await response.json();
    console.log(data, 'data');
    processSalesData(data);
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
      <div className="bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <Heading className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Sales Data</Heading>
              <p className="mt-4 text-lg leading-8 text-gray-300">Overview of sales data based on the selected date range.</p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-5">
              <DataCard title="Total" value={formatCurrency(totals.totalRevenue)} subtitle={`Sales Amount: ${totals.totalSalesAmount}`} />
              <DataCard title="Demo Completed" value={formatCurrency(totals.demoCompletedRevenue)} subtitle={`Sales Amount: ${totals.demoCompletedSalesAmount}`} />
              <DataCard title="No Demo Completed" value={formatCurrency(totals.noDemoCompletedRevenue)} subtitle={`Sales Amount: ${totals.noDemoCompletedSalesAmount}`} />
              <DataCard title="Avg. Daily MRR Increase" value={formatCurrency(totals.avgDailyMRR)} />
              <DataCard title="MRR Increase Trajectory" value={formatCurrency(totals.mrrTrajectory)} />
            </dl>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-end mb-4">
            <label htmlFor="start_date" className="text-white mr-2">Start Date:</label>
            <input type="date" id="start_date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-4" />
            <label htmlFor="end_date" className="text-white mr-2">End Date:</label>
            <input type="date" id="end_date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-4" />
            <Button onClick={fetchSalesData} className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Fetch Sales Data</Button>
          </div>
          <SalesTable data={groupedData} formatCurrency={formatCurrency} />
          <DetailedSalesTable data={detailedData} formatDate={formatDate} formatCurrency={formatCurrency} />
        </div>
      </div>
    </>
  );
}

const DataCard = ({ title, value, subtitle }) => (
  <div className="flex flex-col bg-white/5 p-8">
    <dt className="text-sm font-semibold leading-6 text-gray-300">{title}</dt>
    <dd className="order-first text-3xl font-semibold tracking-tight text-white">{value}</dd>
    {subtitle && <dd className="text-sm font-semibold leading-6 text-gray-300">{subtitle}</dd>}
  </div>
);

const SalesTable = ({ data, formatCurrency }) => (
  <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
    <TableHead>
      <TableRow>
        <TableHeader>Product Name</TableHeader>
        <TableHeader>Price</TableHeader>
        <TableHeader>Demo Completed</TableHeader>
        <TableHeader>Total Revenue</TableHeader>
        <TableHeader>Sales Amount</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{item["Product Name"]}</TableCell>
          <TableCell>{formatCurrency(item.Price)}</TableCell>
          <TableCell>{item["Demo Completed"]}</TableCell>
          <TableCell>{formatCurrency(item.Total_Revenue)}</TableCell>
          <TableCell>{item.Sales_Amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const DetailedSalesTable = ({ data, formatDate, formatCurrency }) => (
  <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
    <TableHead>
      <TableRow>
        <TableHeader>Sale Date</TableHeader>
        <TableHeader>Email</TableHeader>
        <TableHeader>Product Name</TableHeader>
        <TableHeader>Price</TableHeader>
        <TableHeader>Demo Completed</TableHeader>
        <TableHeader>Sources</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{formatDate(item.saleDate)}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.productName}</TableCell>
          <TableCell>{formatCurrency(item.price)}</TableCell>
          <TableCell>{item.demoCompleted}</TableCell>
          <TableCell>{item.source}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);