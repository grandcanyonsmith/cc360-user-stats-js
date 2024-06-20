'use client'

import { Avatar } from '@/components/avatar'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './Navbar';
import { Stat } from './Stat';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Filters } from './Filters';
import { formatIncome, formatHasCalendar, formatHasProduct, formatFirstTransaction, formatMailgunConnected, formatPaymentProcessor, formatAccountStatus } from './utils';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(1);

  useEffect(() => {
    const today = new Date();
    const priorDate = new Date().setDate(today.getDate() - 30);
    document.getElementById('startDate').valueAsDate = new Date(priorDate);
    document.getElementById('endDate').valueAsDate = today;
  }, []);

  const fetchData = () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    axios.post('https://rozduvvh2or5rxgucec3rfdp5e0hupbk.lambda-url.us-west-2.on.aws/', {
      startDate: startDate,
      endDate: endDate
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const users = response.data.map(user => {
          const hasIncome = parseFloat(user.income_all_time) > 0 || parseFloat(user.last_seven_day_income) > 0 || parseFloat(user.last_thirty_day_income) > 0 || parseFloat(user.last_ninety_day_income) > 0;
          return {
            ...user,
            mailgun_connected: user.mailgun_connected === "true" || user.mailgun_connected === true,
            has_had_first_transaction: hasIncome || user.has_had_first_transaction === "true" || user.has_had_first_transaction === true,
            payment_processor_integration: user.payment_processor_integration === "True" || user.payment_processor_integration === true
          };
        });
        setUsers(users);
        setFilteredUsers(users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const handleSort = (field) => {
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
        <TableCell className="hidden sm:table-cell">{formatIncome(user.last_ninety_day_income)}</TableCell>
        <TableCell className="hidden sm:table-cell">{formatIncome(user.last_thirty_day_income)}</TableCell>
        <TableCell className="hidden sm:table-cell">{formatIncome(user.last_seven_day_income)}</TableCell>
        <TableCell>{formatHasCalendar(user.total_calendars)}</TableCell>
        <TableCell>{formatHasProduct(user.total_products)}</TableCell>
        <TableCell>{user.relative_created_time}</TableCell>
        <TableCell>{user.relative_time_to_revenue || 'N/A'}</TableCell>
        <TableCell>{formatFirstTransaction(user.has_had_first_transaction)}</TableCell>
        <TableCell>{formatMailgunConnected(user.mailgun_connected)}</TableCell>
        <TableCell>{formatPaymentProcessor(user.payment_processor_integration)}</TableCell>
        <TableCell>{formatAccountStatus(user.account_status)}</TableCell>
      </TableRow>
    ));
  };

  const updateCards = (filteredUsers) => {
    const filteredWithoutUnknown = filteredUsers.filter(user => user.account_status !== 'Unknown');
    const totalUsers = filteredWithoutUnknown.length;
    const mailgunConnectedCount = filteredWithoutUnknown.filter(user => user.mailgun_connected).length;
    const firstTransactionCount = filteredWithoutUnknown.filter(user => user.has_had_first_transaction).length;
    const paymentProcessorCount = filteredWithoutUnknown.filter(user => user.payment_processor_integration).length;
    const mailgunPercentage = totalUsers ? (mailgunConnectedCount / totalUsers * 100).toFixed(2) : 0;
    const transactionPercentage = totalUsers ? (firstTransactionCount / totalUsers * 100).toFixed(2) : 0;
    const paymentProcessorPercentage = totalUsers ? (paymentProcessorCount / totalUsers * 100).toFixed(2) : 0;
    document.getElementById('mailgunPercentage').innerText = `${mailgunPercentage}%`;
    document.getElementById('mailgunCount').innerText = `${mailgunConnectedCount} of ${totalUsers}`;
    document.getElementById('transactionPercentage').innerText = `${transactionPercentage}%`;
    document.getElementById('transactionCount').innerText = `${firstTransactionCount} of ${totalUsers}`;
    document.getElementById('paymentProcessorPercentage').innerText = `${paymentProcessorPercentage}%`;
    document.getElementById('paymentProcessorCount').innerText = `${paymentProcessorCount} of ${totalUsers}`;

    const profitableUsers = filteredWithoutUnknown.filter(user => user.has_had_first_transaction && user.time_to_become_profitable);
    const totalProfitableTime = profitableUsers.reduce((sum, user) => sum + user.time_to_become_profitable, 0);
    const averageTimeToRevenue = totalProfitableTime ? (totalProfitableTime / profitableUsers.length) / (1000 * 60 * 60 * 24) : 0;
    document.getElementById('averageTimeToRevenue').innerText = `${averageTimeToRevenue.toFixed(2)} days`;

    const activeCount = filteredWithoutUnknown.filter(user => user.account_status === 'active').length;
    const canceledCount = filteredWithoutUnknown.filter(user => user.account_status === 'canceled').length;
    const pastDueCount = filteredWithoutUnknown.filter(user => user.account_status === 'past_due').length;
    const trialingCount = filteredWithoutUnknown.filter(user => user.account_status === 'trialing').length;
    const activePercentage = totalUsers ? (activeCount / totalUsers * 100).toFixed(2) : 0;
    const canceledPercentage = totalUsers ? (canceledCount / totalUsers * 100).toFixed(2) : 0;
    const pastDuePercentage = totalUsers ? (pastDueCount / totalUsers * 100).toFixed(2) : 0;
    const trialingPercentage = totalUsers ? (trialingCount / totalUsers * 100).toFixed(2) : 0;
    document.getElementById('activePercentage').innerText = `${activePercentage}%`;
    document.getElementById('activeCount').innerText = `${activeCount} of ${totalUsers}`;
    document.getElementById('canceledPercentage').innerText = `${canceledPercentage}%`;
    document.getElementById('canceledCount').innerText = `${canceledCount} of ${totalUsers}`;
    document.getElementById('pastDuePercentage').innerText = `${pastDuePercentage}%`;
    document.getElementById('pastDueCount').innerText = `${pastDueCount} of ${totalUsers}`;
    document.getElementById('trialingPercentage').innerText = `${trialingPercentage}%`;
    document.getElementById('trialingCount').innerText = `${trialingCount} of ${totalUsers}`;
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="startDate" name="startDate" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" id="endDate" name="endDate" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
          <button id="fetchData" className="w-full sm:w-auto ml-0 sm:ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={fetchData}>Fetch Data</button>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <Stat title="MailGun Connected" value="0%" change="0 of 0" />
          <Stat title="First Transaction Completed" value="0%" change="0 of 0" />
          <Stat title="Payment Processor Connected" value="0%" change="0 of 0" />
          <Stat title="Average Time to Revenue" value="0 days" change="" />
          <Stat title="Active" value="0%" change="0 of 0" />
          <Stat title="Canceled" value="0%" change="0 of 0" />
          <Stat title="Unknown" value="0%" change="0 of 0" />
          <Stat title="Past Due" value="0%" change="0 of 0" />
          <Stat title="Trialing" value="0%" change="0 of 0" />
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="relative inline-block text-left">
            <div>
              <button type="button" className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="sortMenuButton" aria-expanded="false" aria-haspopup="true">
                Sort
                <svg className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="sortMenuButton" tabIndex="-1" style={{ display: 'none' }}>
              <div className="py-1" role="none">
                <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-900" role="menuitem" tabIndex="-1" id="sortIncomeAllTime">All Time Revenue</a>
                <a href="#" className="block px-4 py-2 text-sm font-medium text-gray-900" role="menuitem" tabIndex="-1" id="sortTimestamp">Timestamp</a>
                </div>
            </div>
          </div>
          <button type="button" className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900" id="filterButton">Filters</button>
        </div>
        <Filters onFilterChange={setFilteredUsers} />
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Location Name</TableHeader>
              <TableHeader className="cursor-pointer" onClick={() => handleSort('income_all_time')}>All Time $</TableHeader>
              <TableHeader className="cursor-pointer hidden sm:table-cell" onClick={() => handleSort('last_ninety_day_income')}>90D $</TableHeader>
              <TableHeader className="cursor-pointer hidden sm:table-cell" onClick={() => handleSort('last_thirty_day_income')}>30D $</TableHeader>
              <TableHeader className="cursor-pointer hidden sm:table-cell" onClick={() => handleSort('last_seven_day_income')}>7D $</TableHeader>
              <TableHeader>Calendars</TableHeader>
              <TableHeader>Products</TableHeader>
              <TableHeader>Relative Created Time</TableHeader>
              <TableHeader>Relative Time to Revenue</TableHeader>
              <TableHeader className="cursor-pointer" onClick={() => handleSort('has_had_first_transaction')}>First Transaction</TableHeader>
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
    </>
  );
}
              

