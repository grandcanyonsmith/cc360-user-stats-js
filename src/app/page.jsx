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
  const [revenueTrendData, setRevenueTrendData] = useState([]);
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
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgDailyMRR, setAvgDailyMRR] = useState(0);
  const [mrrTrajectory, setMrrTrajectory] = useState(0);
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
          if (!user.relative_created_time) {
            console.warn('Missing relative_created_time for user:', user);
          }
          return {
            ...user,
            mailgun_connected: user.mailgun_connected === "true" || user.mailgun_connected === true,
            has_had_first_transaction: hasIncome || user.has_had_first_transaction === "true" || user.has_had_first_transaction === true,
            payment_processor_integration: user.payment_processor_integration === "True" || user.payment_processor_integration === true,
            relative_created_time: user.relative_created_time ? parseRelativeTime(user.relative_created_time) : new Date(), // Handle undefined relative_created_time
            demo_call: user.demo_call ? user.demo_call.scheduled_call : false,
            onboarding_call: user.onboarding_call ? user.onboarding_call.scheduled_call : false
          };
        });
        console.log('Processed users:', users);
        setUsers(users);
        setFilteredUsers(users.filter(user => user.account_status !== 'Unknown'));
        updateCards(users.filter(user => user.account_status !== 'Unknown'));
        const totalRevenue = calculateTotalRevenue(users);
        const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, start, end);
        setTotalRevenue(totalRevenue);
        setAvgDailyMRR(avgDailyMRR);
        setMrrTrajectory(mrrTrajectory);
        const revenueTrendData = aggregateRevenueByDay(users);
        console.log(revenueTrendData, 'revenue trend data')
        setRevenueTrendData(revenueTrendData);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const calculateTotalRevenue = (users) => {
    return users.reduce((sum, user) => {
      const { product_id } = user;
      const { price } = getProductPriceAndStyle(product_id);
      return sum + parseFloat(price.replace('$', '').replace(',', ''));
    }, 0);
  };

  const calculateMRR = (totalRevenue, startDate, endDate) => {
    const workdays = calculateWorkdays(startDate, endDate);
    const avgDailyMRR = workdays > 0 ? totalRevenue / workdays : 0;
    const mrrTrajectory = avgDailyMRR * 22; // Assuming 22 workdays in a month
    return { avgDailyMRR, mrrTrajectory };
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

  const getProductPriceAndStyle = (productId) => {
    switch (productId) {
      case 'prod_NC25k0PnePTpDK':
      case 'prod_PuhtpFfKP74tSq':
        return { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' }; // Platinum
      case 'prod_PpFYdvqmj38F2I':
        return { price: '$297', style: 'bg-yellow-200 border-yellow-400 text-yellow-800' }; // Gold
      case 'prod_PpFXqy79vlGOIE':
      case 'prod_PdPwwouLLJod3b':
      case 'prod_M6IyZeJydN4vMn':
        return { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' }; // Silver
      case 'prod_OvDkzhKINbc38T':
      case 'prod_M6IyfUy0ONYSIw':
        return { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' }; // Bronze
      default:
      case 'prod_M6Iy3zjRHbDmm8':
        console.log(productId, 'productid')
        return { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' }; // Default Bronze
    }
  };

  const renderTable = () => {
    return filteredUsers.map(user => {
      const { price, style } = getProductPriceAndStyle(user.product_id);
      return (
        <TableRow key={user.location_id}>
          <TableCell>
            <div className="flex items-center">
              <a href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`} className="text-indigo-600 hover:text-indigo-900 location-name">
                {user.location_name.replace("'s Account", '').replace('Account', '').trim().length > 15 ? `${user.location_name.replace("'s Account", '').replace('Account', '').trim().substring(0, 15)}...` : user.location_name.replace("'s Account", '').replace('Account', '').trim()}
              </a>
              <a href={user.contact_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </a>
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <div className={`flex-none rounded-full p-1 ${getStatusBgColor(user.account_status)}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
              </div>
              <time className="text-gray-400 sm:hidden" dateTime={user.relative_created_time}>{formatDate(user.relative_created_time)}</time>
              <div className="hidden sm:block ml-2">{formatAccountStatus(user.account_status)}</div>
              <div className={`ml-2 px-2 py-1 rounded-md border ${style}`}>{price}</div>
            </div>
          </TableCell>
          <TableCell><span className={`text-xs font-semibold ${user.mailgun_connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatMailgunConnected(user.mailgun_connected)}</span></TableCell>
          <TableCell><span className={`text-xs font-semibold ${user.payment_processor_integration ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatPaymentProcessor(user.payment_processor_integration)}</span></TableCell>
          <TableCell><span className={`text-xs font-semibold ${user.demo_call ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{user.demo_call ? 'True' : 'False'}</span></TableCell>
          <TableCell><span className={`text-xs font-semibold ${user.onboarding_call ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{user.onboarding_call ? 'True' : 'False'}</span></TableCell>
        </TableRow>
      );
    });
  };

  const getStatusBgColor = (status) => {
    if (!status) return 'bg-gray-400/10 text-gray-400';
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-400/10 text-green-400';
      case 'canceled':
        return 'bg-red-400/10 text-red-400';
      case 'past_due':
        return 'bg-yellow-400/10 text-yellow-400';
      case 'trialing':
        return 'bg-blue-400/10 text-blue-400';
      default:
        return 'bg-gray-400/10 text-gray-400';
    }
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
    const aggregatedData = {};
    data.forEach(item => {
      const date = new Date(item.relative_created_time).toISOString().split('T')[0];
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }
      if (item[field]) {
        aggregatedData[date] += 1;
      }
    });
    const result = Object.keys(aggregatedData)
      .map(date => ({
        date,
        value: aggregatedData[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return result;
  };

  const aggregateRevenueByDay = (users) => {
    const aggregatedData = {};
    users.forEach(user => {
      const date = new Date(user.relative_created_time).toISOString().split('T')[0];
      const { product_id } = user;
      const { price } = getProductPriceAndStyle(product_id);
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }
      aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
    });
    const result = Object.keys(aggregatedData)
      .map(date => ({
        date,
        value: aggregatedData[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
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
    const textColor = (title === 'MailGun Connected' || title === 'Payment Processor Connected') ? 'text-green-600' : 'text-gray-900';
    return (
      <div className="flex flex-col bg-white p-4 shadow rounded-md">
        <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{formattedTitle}</dt>
        <dd className={`text-2xl font-bold tracking-tight ${textColor} mt-1 text-left`}>{value}</dd>
        {subtitle && <dd className="text-xs text-gray-600 mt-0 text-left">{subtitle}</dd>}
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
        <YAxis tickFormatter={(tick) => formatCurrency(tick)} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
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

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
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
    <div className="flex space-x-1">
      {['1W', '4W', '1Y', 'MTD', 'QTD', 'YTD', 'ALL'].map(range => (
        <button
          key={range}
          onClick={() => handleDateRangeChange(range)}
          className={`text-sm font-semibold px-2 py-1 rounded-md ${selectedRange === range ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
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
            {/* <Button className="mb-4 sm:mb-0" onClick={() => setIsSidebarOpen(true)}>Filters</Button> */}
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
            <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle={`Sum of all revenue`} trendData={revenueTrendData} showGraph={true} />
            <StatCard title="Daily MRR" value={formatCurrency(avgDailyMRR)} subtitle={`Average Daily increase`} trendData={revenueTrendData} showGraph={true} />
            <StatCard title="MRR Trajectory" value={formatCurrency(mrrTrajectory)} subtitle={`Projected monthly increase`} trendData={revenueTrendData} showGraph={true} />
          </dl>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 bg-white-100">
        <div className="mx-auto max-w-7xl bg-white-100">
          <Table className="table-auto w-full bg-white-100">
            <TableHead>
              <TableRow>
                <TableHeader>Location Name</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('mailgun_connected')}>Mailgun</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('payment_processor_integration')}>Pay Int</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('demo_call')}>Demo</TableHeader>
                <TableHeader className="cursor-pointer" onClick={() => handleSort('onboarding_call')}>Onboarding</TableHeader>
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
        .status-dot {
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          margin-right: 0.5rem;
        }
        .text-green-600 {
          color: #16a34a;
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
          .hidden {
            display: none;
          }
        }
      `}</style>
    </>
  );
}