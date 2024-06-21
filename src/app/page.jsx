'use client'
import React, { useState, useEffect } from 'react';
import SalesDatePicker from './SalesDatePicker';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { formatIncome, formatFirstTransaction, formatMailgunConnected, formatPaymentProcessor, formatAccountStatus } from './utils';
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
  const [selectedRange, setSelectedRange] = useState('1W');

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
        setFilteredUsers(users.filter(user => user.account_status !== 'Unknown'));
        updateCards(users.filter(user => user.account_status !== 'Unknown'));
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
          <a href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`} className="text-indigo-600 hover:text-indigo-900 location-name">
            {user.location_name.replace("'s Account", '').replace('Account', '').trim().length > 15 ? `${user.location_name.replace("'s Account", '').replace('Account', '').trim().substring(0, 15)}...` : user.location_name.replace("'s Account", '').replace('Account', '').trim()}
          </a>
          <div className="text-xs text-gray-500">
            {formatDate(user.relative_created_time)} <span className={`text-xs font-semibold ${user.account_status === 'Active' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'}`}>{formatAccountStatus(user.account_status)}</span>
          </div>
        </TableCell>
        <TableCell><span className={`text-xs font-semibold ${user.mailgun_connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatMailgunConnected(user.mailgun_connected)}</span></TableCell>
        <TableCell><span className={`text-xs font-semibold ${user.payment_processor_integration ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatPaymentProcessor(user.payment_processor_integration)}</span></TableCell>
        <TableCell><span className={`text-xs font-semibold ${user.has_had_first_transaction ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatFirstTransaction(user.has_had_first_transaction, user.income_all_time)}</span></TableCell>
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

  const StatCard = ({ title, value, subtitle, trendData, showGraph }) => {
    const statusClasses = {
      'Active': 'bg-green-600',
      'Canceled': 'bg-red-600',
      'Past Due': 'bg-yellow-600',
      'Trialing': 'bg-blue-600',
      'Unknown': 'bg-gray-600'
    };
    const formattedTitle = statusClasses[title] ? (
      <div className="flex items-center">
        <span className={`inline-block w-2 h-2 mr-2 rounded-full ${statusClasses[title]}`}></span>
        <span>{title}</span>
      </div>
    ) : (
      title
    );
    const textColor = (title === 'MailGun' || title === 'Payment Int.') ? 'text-green-600' : 'text-gray-900';
    return (
      <div className="flex flex-col bg-white p-4 shadow rounded-md">
        <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{formattedTitle}</dt>
        <dd className={`text-2xl font-bold tracking-tight ${textColor} mt-1 text-left`}>{value}</dd>
        {subtitle && <dd className="text-sm text-gray-600 mt-1 text-left">{subtitle}</dd>}
        {showGraph && (
          <div className="flex-grow w-full">
            <TrendGraph data={trendData} />
          </div>
        )}
      </div>
    );
  };

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

  const formatStatus = (status) => {
    const statusClasses = {
      'active': 'text-green-600 bg-green-100',
      'canceled': 'text-red-600 bg-red-100',
      'past_due': 'text-yellow-600 bg-yellow-100',
      'trialing': 'text-purple-600 bg-blue-100',
      'unknown': 'text-gray-600 bg-gray-100'
    };
    return <span className={`text-xs font-semibold ${statusClasses[status.toLowerCase()] || 'text-gray-600 bg-gray-100'} rounded-full`}>{formatAccountStatus(status)}</span>;
  };

  const handleDateRangeChange = (range) => {
    setSelectedRange(range);
    const now = new Date();
    let start, end;
    switch (range) {
      case '1W':
        start = new Date();
        start.setDate(now.getDate() - 7);
        end = now;
        break;
      case '4W':
        start = new Date();
        start.setDate(now.getDate() - 28);
        end = now;
        break;
      case '1Y':
        start = new Date();
        start.setFullYear(now.getFullYear() - 1);
        end = now;
        break;
      case 'MTD':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
        break;
      case 'QTD':
        start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        end = now;
        break;
      case 'YTD':
        start = new Date(now.getFullYear(), 0, 1);
        end = now;
        break;
      case 'ALL':
        start = new Date(0);
        end = now;
        break;
      default:
        start = new Date();
        start.setDate(now.getDate() - 7);
        end = now;
    }
    setStartDate(start);
    setEndDate(end);
  };

  const DateRangeSelector = () => (
    <div className="flex space-x-2">
      {['1W', '4W', '1Y', 'MTD', 'QTD', 'YTD', 'ALL'].map(range => (
        <button
          key={range}
          onClick={() => handleDateRangeChange(range)}
          className={`text-sm font-semibold px-3 py-1 rounded-md ${selectedRange === range ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
        >
          {range}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-left">
            <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">User Data</Heading>
            <p className="mt-4 text-lg leading-8 text-gray-600">Overview of user data based on the selected date range.</p>
            <hr className="mt-4 mb-8 border-t border-gray-300" />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <Button className="mb-4 sm:mb-0" onClick={() => setIsSidebarOpen(true)}>Filters</Button>
            <div className="hidden sm:block">
              <SalesDatePicker
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                fetchSalesData={fetchData}
              />
            </div>
            <div className="block sm:hidden w-full">
              <DateRangeSelector />
              <hr className="mt-2 mb-4 border-t border-gray-300" />
            </div>
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
            <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} showGraph={true} />
            <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} showGraph={true} />
            <StatCard title="Active" value={stats.activePercentage} subtitle={stats.activeCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} showGraph={false} />
            <StatCard title="Canceled" value={stats.canceledPercentage} subtitle={stats.canceledCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} showGraph={false} />
            <StatCard title="Past Due" value={stats.pastDuePercentage} subtitle={stats.pastDueCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} showGraph={false} />
            <StatCard title="Trialing" value={stats.trialingPercentage} subtitle={stats.trialingCount} trendData={aggregateDataByDay(filteredUsers, 'account_status')} showGraph={false} />
          </dl>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Table className="table-auto w-full">
            <TableHead>
              <TableRow>
                <TableHeader>Location Name</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('mailgun_connected')}>Mailgun</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('payment_processor_integration')}>Pay Int</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('has_had_first_transaction')}>AllTime $</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderTable()}
            </TableBody>
          </Table>
        </div>
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-64 p-4 shadow-lg">
            <button onClick={() => setIsSidebarOpen(false)} className="mb-4">Close</button>
            <Filters onFilterChange={setFilteredUsers} />
          </div>
        </div>
      )}
      <style jsx>{`
        th, td {
          padding: 0.5rem 0.75rem; /* Adjust padding to make columns less spaced apart */
        }
        th {
          font-size: 0.75rem; /* Smaller text for table headers */
          white-space: normal; /* Allow text to wrap onto two lines */
        }
        .location-name {
          font-size: 0.875rem; /* Smaller text for location name */
        }
        @media (max-width: 640px) {
          .flex-col {
            flex-direction: column;
          }
          .table-auto {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          .table-auto th, .table-auto td {
            display: inline-block;
            width: auto;
          }
          th, td {
            font-size: 0.75rem; /* Smaller text for table data */
          }
          .status-dot {
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            margin-right: 0.5rem;
          }
          .status-active {
            background-color: #16a34a; /* Green */
          }
          .status-canceled {
            background-color: #dc2626; /* Red */
          }
          .status-past_due {
            background-color: #facc15; /* Yellow */
          }
          .status-trialing {
            background-color: #3b82f6; /* Blue */
          }
          .status-unknown {
            background-color: #6b7280; /* Gray */
          }
        }
      `}</style>
    </>
  );
}