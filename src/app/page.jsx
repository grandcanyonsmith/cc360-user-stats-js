'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SalesDatePicker from './SalesDatePicker';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import {
  formatIncome,
  formatFirstTransaction,
  formatMailgunConnected,
  formatPaymentProcessor,
  formatAccountStatus,
  formatHasDemoCallScheduled,
  formatHasOnboardingCallScheduled,
  formatCurrency,
  formatDate
} from './utils';
import Filters from '@/components/Filters';
import CombinedStatusCard from '@/components/CombinedStatusCard';
import LeviCommissionCard from '@/components/LeviCommissionCard';
import Tabs from '@/components/Tabs';
import UserTable from '@/components/UserTable';
import StatCard from '@/components/StatCard';
import TrendGraph from '@/components/TrendGraph';
import StatusBadge from '@/components/StatusBadge';
import ReportButton from '@/components/ReportButton';

const Home = () => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCallType, setModalCallType] = useState('');
  const [modalUser, setModalUser] = useState(null);
  const [revenueTrendData, setRevenueTrendData] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(1);
  const [leviCommission, setLeviCommission] = useState(0);
  const [stats, setStats] = useState(initialStats());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgDailyMRR, setAvgDailyMRR] = useState(0);
  const [mrrTrajectory, setMrrTrajectory] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('1W');
  const [filterState, setFilterState] = useState(initialFilterState());
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    if (activeTab === 'Sales') {
      setFilterState(prevState => ({
        ...prevState,
        demoScheduled: 'true' // Set Demo Scheduled to true when Sales tab is active
      }));
    }
  }, [activeTab]);

  const fetchData = async (start, end) => {
    try {
      const response = await axios.post('https://rozduvvh2or5rxgucec3rfdp5e0hupbk.lambda-url.us-west-2.on.aws/', {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (!Array.isArray(response.data)) {
        console.error('Expected response data to be an array, but got:', response.data);
        return;
      }
      const processedUsers = processUsers(response.data);
      setUsers(processedUsers);
      setFilteredUsers(processedUsers.filter(user => user.account_status !== 'Unknown'));
      updateCards(processedUsers.filter(user => user.account_status !== 'Unknown'));
      const totalRevenue = calculateTotalRevenue(processedUsers);
      const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, start, end);
      setTotalRevenue(totalRevenue);
      setAvgDailyMRR(avgDailyMRR);
      setMrrTrajectory(mrrTrajectory);
      setRevenueTrendData(aggregateRevenueByDay(processedUsers));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const processUsers = (users) => {
    return users.map(user => {
      const hasIncome = parseFloat(user.income_all_time) > 0 || parseFloat(user.income_7_days) > 0 || parseFloat(user.income_30_days) > 0 || parseFloat(user.income_90_days) > 0;
      return {
        ...user,
        mailgun_connected: user.mailgun_connected === "true" || user.mailgun_connected === true,
        has_had_first_transaction: hasIncome || user.has_had_first_transaction === "true" || user.has_had_first_transaction === true,
        payment_processor_integration: user.payment_processor_integration === "True" || user.payment_processor_integration === true,
        relative_created_time: user.relative_created_time ? parseRelativeTime(user.relative_created_time) : new Date(),
        timestamp: user.timestamp ? new Date(user.timestamp * 1000) : new Date(), // Ensure timestamp is correctly parsed
        demo_call: processCall(user.demo_call),
        onboarding_call: processCall(user.onboarding_call)
      };
    });
  };

  const processCall = (call) => {
    return call ? {
      scheduled_call: call.scheduled_call,
      completed_call: call.completed_call,
      appointment_time: call.appointment_time,
      employee_name: call.employee_name,
      joined_higher_plan_after_call: call.joined_higher_plan_after_call,
      paid_early_after_call: call.paid_early_after_call,
      sale_upgrade_after_call: call.sale_upgrade_after_call
    } : { scheduled_call: false, completed_call: false, appointment_time: null, employee_name: null, joined_higher_plan_after_call: false, paid_early_after_call: false, sale_upgrade_after_call: false };
  };

  const calculateTotalRevenue = (users) => {
    return users.reduce((sum, user) => {
      const { price } = getProductPriceAndStyle(user.product_id);
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
    if (isNaN(value)) return now; // Return current date if parsing fails
    const timeMap = {
      'seconds': value * 1000,
      'second': value * 1000,
      'minutes': value * 60 * 1000,
      'minute': value * 60 * 1000,
      'hours': value * 60 * 60 * 1000,
      'hour': value * 60 * 60 * 1000,
      'days': value * 24 * 60 * 60 * 1000,
      'day': value * 24 * 60 * 60 * 1000,
      'weeks': value * 7 * 24 * 60 * 60 * 1000,
      'week': value * 7 * 24 * 60 * 60 * 1000
    };
    return new Date(now.getTime() - (timeMap[unit] || 0));
  };

  const handleSort = (field) => {
    const newSortDirection = sortField === field ? sortDirection * -1 : -1;
    setSortField(field);
    setSortDirection(newSortDirection);
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      let valA = parseFloat(a[field]);
      let valB = parseFloat(b[field]);
      if (isNaN(valA) || isNaN(valB)) return 0;
      return (valA < valB ? -1 : 1) * newSortDirection;
    });
    setFilteredUsers(sortedUsers);
  };

  const getProductPriceAndStyle = (productId) => {
    const productMap = {
      'prod_NC25k0PnePTpDK': { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' },
      'prod_PuhtpFfKP74tSq': { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' },
      'prod_PpFYdvqmj38F2I': { price: '$297', style: 'bg-yellow-200 border-yellow-400 text-yellow-800' },
      'prod_PpFXqy79vlGOIE': { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' },
      'prod_PdPwwouLLJod3b': { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' },
      'prod_M6IyZeJydN4vMn': { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' },
      'prod_OvDkzhKINbc38T': { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' },
      'prod_M6IyfUy0ONYSIw': { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' },
      'prod_M6Iy3zjRHbDmm8': { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' }
    };
    return productMap[productId] || { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' };
  };

  const formatDemoCompleted = (user) => {
    const demoCall = user.demo_call;
    if (!demoCall || demoCall.scheduled_call === false) {
      return <StatusBadge status="No" color="red" />;
    } else if (demoCall.completed_call === true) {
      return <StatusBadge status="Yes" color="green" />;
    } else {
      return <ReportButton callType="Demo" user={user} openReportModal={openReportModal} />;
    }
  };

  const formatOnboardingCompleted = (user) => {
    const onboardingCall = user.onboarding_call;
    if (!onboardingCall || onboardingCall.scheduled_call === false) {
      return <StatusBadge status="No" color="red" />;
    } else if (onboardingCall.completed_call === true) {
      return <StatusBadge status="Yes" color="green" />;
    } else {
      return <ReportButton callType="Onboarding" user={user} openReportModal={openReportModal} />;
    }
  };

  const formatDemoClosed = (user) => {
    const demoCall = user.demo_call;
    if (demoCall && (demoCall.joined_higher_plan_after_call || demoCall.paid_early_after_call || demoCall.sale_upgrade_after_call)) {
      return <StatusBadge status="Yes" color="green" />;
    } else {
      return <StatusBadge status="No" color="red" />;
    }
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
    const totalUsers = filteredUsers.length;
    const mailgunConnectedCount = filteredUsers.filter(user => user.mailgun_connected).length;
    const firstTransactionCount = filteredUsers.filter(user => user.has_had_first_transaction).length;
    const paymentProcessorCount = filteredUsers.filter(user => user.payment_processor_integration).length;
    const demoCallCount = filteredUsers.filter(user => user.demo_call.scheduled_call).length;
    const onboardingCallCount = filteredUsers.filter(user => user.onboarding_call.scheduled_call).length;
    const mailgunPercentage = calculatePercentage(mailgunConnectedCount, totalUsers);
    const transactionPercentage = calculatePercentage(firstTransactionCount, totalUsers);
    const paymentProcessorPercentage = calculatePercentage(paymentProcessorCount, totalUsers);
    const demoCallPercentage = calculatePercentage(demoCallCount, totalUsers);
    const onboardingCallPercentage = calculatePercentage(onboardingCallCount, totalUsers);
    const profitableUsers = filteredUsers.filter(user => user.has_had_first_transaction && user.time_to_become_profitable);
    const totalProfitableTime = profitableUsers.reduce((sum, user) => sum + user.time_to_become_profitable, 0);
    const averageTimeToRevenue = totalProfitableTime ? (totalProfitableTime / profitableUsers.length) / (1000 * 60 * 60 * 24) : 0;
    const activeCount = filteredUsers.filter(user => user.account_status === 'active').length;
    const canceledCount = filteredUsers.filter(user => user.account_status === 'canceled').length;
    const pastDueCount = filteredUsers.filter(user => user.account_status === 'past_due').length;
    const trialingCount = filteredUsers.filter(user => user.account_status === 'trialing').length;
    const activePercentage = calculatePercentage(activeCount, totalUsers);
    const canceledPercentage = calculatePercentage(canceledCount, totalUsers);
    const pastDuePercentage = calculatePercentage(pastDueCount, totalUsers);
    const trialingPercentage = calculatePercentage(trialingCount, totalUsers);
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
      demoCallPercentage: `${demoCallPercentage}%`,
      demoCallCount: `${demoCallCount} of ${totalUsers}`,
      onboardingCallPercentage: `${onboardingCallPercentage}%`,
      onboardingCallCount: `${onboardingCallCount} of ${totalUsers}`,
    });
  };

  const calculatePercentage = (count, total) => {
    return total ? (count / total * 100).toFixed(2) : 0;
  };

  const aggregateDataByDay = (data, field) => {
    if (!Array.isArray(data)) {
      console.error('Expected data to be an array, but got:', data);
      return [];
    }
    const aggregatedData = {};
    const totalUsersByDay = {};
    const runningTotal = { count: 0, total: 0 };
    data.forEach(item => {
      const date = new Date(item.timestamp).toISOString().split('T')[0]; // Ensure correct date conversion
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
        totalUsersByDay[date] = 0;
      }
      totalUsersByDay[date] += 1;
      if (item[field]) {
        aggregatedData[date] += 1;
      }
    });
    return Object.keys(aggregatedData)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => {
        runningTotal.count += totalUsersByDay[date];
        runningTotal.total += aggregatedData[date];
        return {
          date: new Date(date), // Ensure date is a JavaScript Date object
          value: (runningTotal.total / runningTotal.count) * 100, // Calculate running average percentage
        };
      });
  };

  const aggregateRevenueByDay = (users) => {
    const aggregatedData = {};
    users.forEach(user => {
      const date = new Date(user.timestamp).toISOString().split('T')[0]; // Ensure correct date conversion
      const { price } = getProductPriceAndStyle(user.product_id);
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }
      aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
    });
    return Object.keys(aggregatedData)
      .map(date => ({
        date: new Date(date), // Ensure date is a JavaScript Date object
        value: aggregatedData[date],
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const aggregateCumulativeRevenueByDay = (users) => {
    const aggregatedData = {};
    let cumulativeRevenue = 0;
    users.forEach(user => {
      const date = new Date(user.timestamp).toISOString().split('T')[0];
      const { price } = getProductPriceAndStyle(user.product_id);
      if (!aggregatedData[date]) {
        aggregatedData[date] = 0;
      }
      aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
    });
    return Object.keys(aggregatedData)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => {
        cumulativeRevenue += aggregatedData[date];
        return {
          date: new Date(date), // Ensure date is a JavaScript Date object
          value: cumulativeRevenue,
        };
      });
  };
  const handleFilterChange = (filters) => {
    setFilterState(filters);
    const filteredUsers = users.filter(user => {
      const statusMatch = filters.status.includes(user.account_status);
      const planMatch = filters.plan === 'all' ||
        (filters.plan === 'platinum' && ['prod_NC25k0PnePTpDK', 'prod_PuhtpFfKP74tSq'].includes(user.product_id)) ||
        (filters.plan === 'elite' && ['prod_PpFYdvqmj38F2I'].includes(user.product_id)) ||
        (filters.plan === 'premium' && ['prod_PpFXqy79vlGOIE', 'prod_PdPwwouLLJod3b', 'prod_M6IyZeJydN4vMn'].includes(user.product_id)) ||
        (filters.plan === 'starter' && ['prod_OvDkzhKINbc38T', 'prod_M6IyfUy0ONYSIw'].includes(user.product_id)) ||
        filters.plan === user.product_id;
      return (filters.calendar === 'all' || (filters.calendar === 'true' && user.total_calendars > 0) || (filters.calendar === 'false' && user.total_calendars === 0)) &&
        (filters.product === 'all' || (filters.product === 'true' && user.total_products > 0) || (filters.product === 'false' && user.total_products === 0)) &&
        (filters.firstTransaction === 'all' || (filters.firstTransaction === 'true' && user.has_had_first_transaction) || (filters.firstTransaction === 'false' && !user.has_had_first_transaction)) &&
        (filters.mailgun === 'all' || (filters.mailgun === 'true' && user.mailgun_connected) || (filters.mailgun === 'false' && !user.mailgun_connected)) &&
        (filters.paymentProcessor === 'all' || (filters.paymentProcessor === 'true' && user.payment_processor_integration) || (filters.paymentProcessor === 'false' && !user.payment_processor_integration)) &&
        (filters.demoScheduled === 'all' ||
          (filters.demoScheduled === 'true' && user.demo_call?.scheduled_call) ||
          (filters.demoScheduled === 'false' && (!user.demo_call || !user.demo_call.scheduled_call))) &&
        (filters.onboardingScheduled === 'all' ||
          (filters.onboardingScheduled === 'true' && user.onboarding_call?.scheduled_call) ||
          (filters.onboardingScheduled === 'false' && (!user.onboarding_call || !user.onboarding_call.scheduled_call))) &&
        (filters.demoCompleted === 'all' ||
          (filters.demoCompleted === 'true' && user.demo_call?.completed_call === true) ||
          (filters.demoCompleted === 'false' && user.demo_call?.completed_call === false)) &&
        (filters.onboardingCompleted === 'all' ||
          (filters.onboardingCompleted === 'true' && user.onboarding_call?.completed_call === true) ||
          (filters.onboardingCompleted === 'false' && user.onboarding_call?.completed_call === false)) &&
        planMatch &&
        statusMatch;
    });
    setFilteredUsers(filteredUsers);
    updateCards(filteredUsers);
    const totalRevenue = calculateTotalRevenue(filteredUsers);
    const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, startDate, endDate);
    setTotalRevenue(totalRevenue);
    setAvgDailyMRR(avgDailyMRR);
    setMrrTrajectory(mrrTrajectory);
  };

  const openReportModal = (callType, user) => {
    setModalCallType(callType);
    setModalUser(user);
    setIsModalOpen(true);
  };

  const closeReportModal = () => {
    setIsModalOpen(false);
    setModalCallType('');
    setModalUser(null);
  };

  return (
    <>
      <div className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-left">
            <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">User Data</Heading>
            <p className="mt-4 text-lg leading-8 text-gray-600">Overview of user data based on the selected date range.</p>
            <hr className="mt-4 mb-8 border-t border-gray-300" />
          </div>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'Sales') {
              setFilterState(prevState => ({
                ...prevState,
                demoScheduled: 'true' // Set Demo Scheduled to true when Sales tab is active
              }));
              handleFilterChange({
                ...filterState,
                demoScheduled: 'true'
              });
            }
          }} />
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row sm:flex-grow sm:space-x-4">
              <div className="hidden sm:block">
                <SalesDatePicker
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  fetchSalesData={fetchData}
                />
              </div>
            </div>
            <Button className="hidden sm:block sm:ml-auto" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
            <div className="block sm:hidden w-full">
              <Button className="mt-4 w-full" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
              <SalesDatePicker
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                fetchSalesData={fetchData}
              />
            </div>
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
            {activeTab === 'Home' && (
              <>
                <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} showGraph={true} isPercentage={true} />
                <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} showGraph={true} isPercentage={true} />
                <CombinedStatusCard stats={stats} />
                <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle={`Sum of all revenue`} trendData={aggregateCumulativeRevenueByDay(filteredUsers)} showGraph={true} isPercentage={false} />
                <StatCard title="Daily MRR" value={formatCurrency(avgDailyMRR)} subtitle={`Average Daily increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
                <StatCard title="MRR Trajectory" value={formatCurrency(mrrTrajectory)} subtitle={`Projected monthly increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
                <StatCard title="Demo Call Scheduled" value={stats.demoCallPercentage} subtitle={stats.demoCallCount} trendData={aggregateDataByDay(filteredUsers, 'demo_call')} showGraph={true} isPercentage={true} />
                <StatCard title="Onboarding Call Scheduled" value={stats.onboardingCallPercentage} subtitle={stats.onboardingCallCount} trendData={aggregateDataByDay(filteredUsers, 'onboarding_call')} showGraph={true} isPercentage={true} />
                <LeviCommissionCard users={filteredUsers} />
              </>
            )}
            {activeTab === 'Sales' && (
              <>
                <StatCard title="Daily MRR" value={formatCurrency(avgDailyMRR)} subtitle={`Average Daily increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
                <StatCard title="Onboarding Call Scheduled" value={stats.onboardingCallPercentage} subtitle={stats.onboardingCallCount} trendData={aggregateDataByDay(filteredUsers, 'onboarding_call')} showGraph={true} isPercentage={true} />
                <LeviCommissionCard users={filteredUsers} />
              </>
            )}
            {activeTab === 'Customer Support' && (
              <>
                <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} showGraph={true} isPercentage={true} />
                <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} showGraph={true} isPercentage={true} />
              </>
            )}
          </dl>
        </div>
      </div>
      <UserTable
        filteredUsers={filteredUsers}
        handleSort={handleSort}
        openReportModal={openReportModal}
        formatDemoCompleted={formatDemoCompleted}
        formatDemoClosed={formatDemoClosed}
        formatHasDemoCallScheduled={formatHasDemoCallScheduled}
        formatHasOnboardingCallScheduled={formatHasOnboardingCallScheduled}
        formatOnboardingCompleted={formatOnboardingCompleted}
        formatMailgunConnected={formatMailgunConnected}
        formatPaymentProcessor={formatPaymentProcessor}
        modalUser={modalUser}
        isModalOpen={isModalOpen}
        closeReportModal={closeReportModal}
        modalCallType={modalCallType}
        getProductPriceAndStyle={getProductPriceAndStyle}
        formatDate={formatDate}
        getStatusBgColor={getStatusBgColor}
        formatAccountStatus={formatAccountStatus}
        activeTab={activeTab} // Pass activeTab state
      />
      {isFilterPanelOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-64 p-4 shadow-lg">
            <button onClick={() => setIsFilterPanelOpen(false)} className="mb-4">Close</button>
            <Filters
              onFilterChange={handleFilterChange}
              users={users}
              filterState={filterState}
              setIsFilterPanelOpen={setIsFilterPanelOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

const initialStats = () => ({
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
  demoCallPercentage: '0%',
  demoCallCount: '0 of 0',
  onboardingCallPercentage: '0%',
  onboardingCallCount: '0 of 0',
});

const initialFilterState = () => ({
  calendar: 'all',
  product: 'all',
  firstTransaction: 'all',
  mailgun: 'all',
  paymentProcessor: 'all',
  demoScheduled: 'true', // Set Demo Scheduled to true by default
  onboardingScheduled: 'all',
  demoCompleted: 'all',
  onboardingCompleted: 'all',
  plan: 'all',
  status: ['active', 'trialing', 'past_due', 'canceled']
});

export default Home;