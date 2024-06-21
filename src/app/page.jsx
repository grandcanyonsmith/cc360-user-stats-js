'use client'
import React, { useState, useEffect } from 'react';
import SalesDatePicker from './SalesDatePicker';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { formatIncome, formatHasCalendar, formatHasProduct, formatFirstTransaction, formatMailgunConnected, formatPaymentProcessor, formatAccountStatus } from './utils';
import { Filters } from './Filters'; // Assuming Filters component is available

export default function Home() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(1);
  const [stats, setStats] = useState({
    mailgunPercentage: '0%',
    mailgunCount: '0 of 0',
    transactionPercentage: '0%',
    transactionCount: '0 of 0',
    paymentProcessorPercentage: '0%',
    paymentProcessorCount: '0 of 0',
    averageTimeToRevenue: '0 days',
    activePercentage: '0%',
    activeCount: '0 of 0',
    canceledPercentage: '0%',
    canceledCount: '0 of 0',
    pastDuePercentage: '0%',
    pastDueCount: '0 of 0',
    trialingPercentage: '0%',
    trialingCount: '0 of 0',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching data for date range:', startDate, endDate);
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const fetchData = (start, end) => {
    console.log('Sending request with start date:', start, 'and end date:', end);
    axios.post('https://rozduvvh2or5rxgucec3rfdp5e0hupbk.lambda-url.us-west-2.on.aws/', {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Received response:', response);
      const users = response.data.map(user => {
        const hasIncome = parseFloat(user.income_all_time) > 0 || parseFloat(user.last_seven_day_income) > 0 || parseFloat(user.last_thirty_day_income) > 0 || parseFloat(user.last_ninety_day_income) > 0;
        return {
          ...user,
          mailgun_connected: user.mailgun_connected === "true" || user.mailgun_connected === true,
          has_had_first_transaction: hasIncome || user.has_had_first_transaction === "true" || user.has_had_first_transaction === true,
          payment_processor_integration: user.payment_processor_integration === "True" || user.payment_processor_integration === true,
          relative_created_time: parseRelativeTime(user.relative_created_time)
        };
      });
      console.log('Processed users:', users);
      setUsers(users);
      setFilteredUsers(users);
      updateCards(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
  };

  const parseRelativeTime = (relativeTime) => {
    const now = new Date();
    const timeParts = relativeTime.split(' ');
    const value = parseInt(timeParts[0], 10);
    const unit = timeParts[1];

    if (isNaN(value)) {
      return now; // Return current date if parsing fails
    }

    switch (unit) {
      case 'seconds':
      case 'second':
        return new Date(now.getTime() - value * 1000);
      case 'minutes':
      case 'minute':
        return new Date(now.getTime() - value * 60 * 1000);
      case 'hours':
      case 'hour':
        return new Date(now.getTime() - value * 60 * 60 * 1000);
      case 'days':
      case 'day':
        return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
      case 'weeks':
      case 'week':
        return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
      default:
        return now; // Return current date if unit is unrecognized
    }
  };

  const handleSort = (field) => {
    console.log('Sorting by field:', field);
    const newSortDirection = sortField === field ? sortDirection * -1 : -1;
    setSortField(field);
    setSortDirection(newSortDirection);
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      let valA = parseFloat(a[field]);
      let valB = parseFloat(b[field]);
      if (isNaN(valA) || isNaN(valB)) {
        return 0;
      } else {
        return (valA < valB ? -1 : 1) * newSortDirection;
      }
    });
    console.log('Sorted users:', sortedUsers);
    setFilteredUsers(sortedUsers);
  };

  const renderTable = () => {
    return filteredUsers.map(user => (
      <TableRow key={user.location_id}>
        <TableCell>
          <a href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`} className="text-indigo-600 hover:text-indigo-900">
            {user.location_name}
          </a>
        </TableCell>
        <TableCell>{formatIncome(user.income_all_time)}</TableCell>
        <TableCell className="hidden sm:table-cell hidden-column">{formatIncome(user.last_ninety_day_income)}</TableCell>
        <TableCell className="hidden sm:table-cell hidden-column">{formatIncome(user.last_thirty_day_income)}</TableCell>
        <TableCell className="hidden sm:table-cell hidden-column">{formatIncome(user.last_seven_day_income)}</TableCell>
        <TableCell>{formatHasCalendar(user.total_calendars)}</TableCell>
        <TableCell>{formatHasProduct(user.total_products)}</TableCell>
        <TableCell>{formatDate(user.relative_created_time)}</TableCell>
        <TableCell className="hidden-column">{user.relative_time_to_revenue || 'N/A'}</TableCell>
        <TableCell className="hidden-column">{formatFirstTransaction(user.has_had_first_transaction)}</TableCell>
        <TableCell>{formatMailgunConnected(user.mailgun_connected)}</TableCell>
        <TableCell>{formatPaymentProcessor(user.payment_processor_integration)}</TableCell>
        <TableCell>{formatAccountStatus(user.account_status)}</TableCell>
      </TableRow>
    ));
  };

  const updateCards = (filteredUsers) => {
    console.log('Updating cards with filtered users:', filteredUsers);
    const filteredWithoutUnknown = filteredUsers.filter(user => user.account_status !== 'Unknown');
    const totalUsers = filteredWithoutUnknown.length;
    const mailgunConnectedCount = filteredWithoutUnknown.filter(user => user.mailgun_connected).length;
    const firstTransactionCount = filteredWithoutUnknown.filter(user => user.has_had_first_transaction).length;
    const paymentProcessorCount = filteredWithoutUnknown.filter(user => user.payment_processor_integration).length;
    const mailgunPercentage = totalUsers ? (mailgunConnectedCount / totalUsers * 100).toFixed(2) : 0;
    const transactionPercentage = totalUsers ? (firstTransactionCount / totalUsers * 100).toFixed(2) : 0;
    const paymentProcessorPercentage = totalUsers ? (paymentProcessorCount / totalUsers * 100).toFixed(2) : 0;
    const profitableUsers = filteredWithoutUnknown.filter(user => user.has_had_first_transaction && user.time_to_become_profitable);
    const totalProfitableTime = profitableUsers.reduce((sum, user) => sum + user.time_to_become_profitable, 0);
    const averageTimeToRevenue = totalProfitableTime ? (totalProfitableTime / profitableUsers.length) / (1000 * 60 * 60 * 24) : 0;
    const activeCount = filteredWithoutUnknown.filter(user => user.account_status === 'active').length;
    const canceledCount = filteredWithoutUnknown.filter(user => user.account_status === 'canceled').length;
    const pastDueCount = filteredWithoutUnknown.filter(user => user.account_status === 'past_due').length;
    const trialingCount = filteredWithoutUnknown.filter(user => user.account_status === 'trialing').length;
    const activePercentage = totalUsers ? (activeCount / totalUsers * 100).toFixed(2) : 0;
    const canceledPercentage = totalUsers ? (canceledCount / totalUsers * 100).toFixed(2) : 0;
    const pastDuePercentage = totalUsers ? (pastDueCount / totalUsers * 100).toFixed(2) : 0;
    const trialingPercentage = totalUsers ? (trialingCount / totalUsers * 100).toFixed(2) : 0;
    setStats({
      mailgunPercentage: `${mailgunPercentage}%`,
      mailgunCount: `${mailgunConnectedCount} of ${totalUsers}`,
      transactionPercentage: `${transactionPercentage}%`,
      transactionCount: `${firstTransactionCount} of ${totalUsers}`,
      paymentProcessorPercentage: `${paymentProcessorPercentage}%`,
      paymentProcessorCount: `${paymentProcessorCount} of ${totalUsers}`,
      averageTimeToRevenue: `${averageTimeToRevenue.toFixed(2)} days`,
      activePercentage: `${activePercentage}%`,
      activeCount: `${activeCount} of ${totalUsers}`,
      canceledPercentage: `${canceledPercentage}%`,
      canceledCount: `${canceledCount} of ${totalUsers}`,
      pastDuePercentage: `${pastDuePercentage}%`,
      pastDueCount: `${pastDueCount} of ${totalUsers}`,
      trialingPercentage: `${trialingPercentage}%`,
      trialingCount: `${trialingCount} of ${totalUsers}`,
    });
  };

  const aggregateDataByDay = (data, field) => {
    console.log('Aggregating data by day for field:', field);
    const aggregatedData = {};
    data.forEach(user => {
      const date = new Date(user.relative_created_time).toISOString().split('T')[0];
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }
      aggregatedData[date] += user[field] ? 1 : 0;
    });
    const result = Object.keys(aggregatedData)
      .map(date => ({
        date,
        value: aggregatedData[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('Aggregated data:', result);
    return result;
  };

  const StatCard = ({ title, value, subtitle, trendData }) => (
    <div className="flex flex-col bg-white p-4 shadow rounded-md">
      <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{title}</dt>
      <dd className="text-sm text-gray-600 mt-1 text-left">{trendData.length > 0 ? formatDate(trendData[0].date) : 'N/A'}</dd>
      <dd className="text-2xl font-bold tracking-tight text-gray-900 mt-1 text-left">{value}</dd>
      {subtitle && <dd className="text-sm text-gray-600 mt-1 text-left">{subtitle}</dd>}
      <div className="flex-grow w-full">
        <TrendGraph data={trendData} />
      </div>
    </div>
  );

  const TrendGraph = ({ data }) => (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => formatDate(tick)}
          ticks={[data[0]?.date, data[data.length - 1]?.date]}
        />
        <YAxis tickFormatter={(tick) => tick} />
        <Tooltip
          formatter={(value) => value}
          labelFormatter={(label) => formatDate(label)}
        />
        <Line type="monotone" dataKey="value" stroke="#0072c6" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-left">
            <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">User Data</Heading>
            <p className="mt-4 text-lg leading-8 text-gray-600">Overview of user data based on the selected date range.</p>
            <hr className="mt-4 mb-8 border-t border-gray-300" />
          </div>
          <SalesDatePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            fetchSalesData={fetchData}
          />
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => setIsSidebarOpen(true)}>Filters</Button>
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
            <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} />
            <StatCard title="First Transaction Completed" value={stats.transactionPercentage} subtitle={stats.transactionCount} trendData={aggregateDataByDay(filteredUsers, 'has_had_first_transaction')} />
            <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} />
            <StatCard title="Average Time to Revenue" value={stats.averageTimeToRevenue} subtitle="from last week" trendData={aggregateDataByDay(filteredUsers, 'time_to_become_profitable')} />
            <StatCard title="Active" value={stats.activePercentage} subtitle={stats.activeCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} />
            <StatCard title="Canceled" value={stats.canceledPercentage} subtitle={stats.canceledCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} />
            <StatCard title="Unknown" value="0%" subtitle="0 of 0 from last week" trendData={aggregateDataByDay(filteredUsers, 'account_status')} />
            <StatCard title="Past Due" value={stats.pastDuePercentage} subtitle={stats.pastDueCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} />
            <StatCard title="Trialing" value={stats.trialingPercentage} subtitle={stats.trialingCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} />
          </dl>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Location Name</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('income_all_time')}>All Time $</TableHeader>
                <TableHeader className="cursor-pointer hidden sm:table-cell hidden-column" onClick={() => handleSort('last_ninety_day_income')}>90D $</TableHeader>
                <TableHeader className="cursor-pointer hidden sm:table-cell hidden-column" onClick={() => handleSort('last_thirty_day_income')}>30D $</TableHeader>
                <TableHeader className="cursor-pointer hidden sm:table-cell hidden-column" onClick={() => handleSort('last_seven_day_income')}>7D $</TableHeader>
                <TableHeader>Calendars</TableHeader>
                <TableHeader>Products</TableHeader>
                <TableHeader>Relative Created Time</TableHeader>
                <TableHeader className="hidden-column">Relative Time to Revenue</TableHeader>
                <TableHeader className="hidden-column" onClick={() => handleSort('has_had_first_transaction')}>First Transaction</TableHeader>
                <TableHeader>Mailgun Connected</TableHeader>
                <TableHeader>Payment Processor</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTable()}
            </TableBody>
          </Table>
        </div>
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex">
          <div className="bg-white w-64 p-4 shadow-lg">
            <button onClick={() => setIsSidebarOpen(false)} className="mb-4">Close</button>
            <Filters onFilterChange={setFilteredUsers} />
          </div>
        </div>
      )}
      <style jsx>{`
        .hidden-column {
          display: none;
        }
      `}</style>
    </>
  );
}