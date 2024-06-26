// old working code
// 'use client'
// import React, { useState, useEffect } from 'react';
// import SalesDatePicker from './SalesDatePicker';
// import { Avatar } from '@/components/avatar';
// import { Button } from '@/components/button';
// import { Heading } from '@/components/heading';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';
// import {
//   formatIncome,
//   formatFirstTransaction,
//   formatMailgunConnected,
//   formatPaymentProcessor,
//   formatAccountStatus,
//   formatHasDemoCallScheduled,
//   formatHasOnboardingCallScheduled,
//   formatCurrency // Ensure this utility function is available
// } from './utils';
// import { Filters } from './Filters'; // Assuming Filters component is available
// import CallReportingModal from './CallReportingModal'; // Import the modal component
// import CombinedStatusCard from './CombinedStatusCard';
// import LeviCommissionCard from './LeviCommissionCard'; // Import the new LeviCommissionCard component

// export default function Home() {
//   const [startDate, setStartDate] = useState(() => {
//       const date = new Date();
//       date.setDate(date.getDate() - 7);
//       return date;
//   });


//   const openReportModal = (callType, user) => {
//     setModalCallType(callType);
//     setModalUser(user);
//     setIsModalOpen(true);
//     console.log(modalUser,'user here here')
//     console.log(callType)
//   };

//   const closeReportModal = () => {
//     setIsModalOpen(false);
//     setModalCallType('');
//     setModalUser(null);
//   };
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalCallType, setModalCallType] = useState('');
//   const [modalUser, setModalUser] = useState(null);
//   const [revenueTrendData, setRevenueTrendData] = useState([]);
//   const [endDate, setEndDate] = useState(new Date());
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState(1);
//   const [leviCommission, setLeviCommission] = useState(0);
//   const [stats, setStats] = useState({
//     mailgunPercentage: '0%',
//     mailgunCount: '0 of 0',
//     transactionPercentage: '0%',
//     transactionCount: '0 of 0',
//     paymentProcessorPercentage: '0%',
//     paymentProcessorCount: '0 of 0',
//     averageTimeToRevenue: '0 days',
//     activePercentage: '0%',
//     activeCount: '0 of 0',
//     canceledPercentage: '0%',
//     canceledCount: '0 of 0',
//     pastDuePercentage: '0%',
//     pastDueCount: '0 of 0',
//     trialingPercentage: '0%',
//     trialingCount: '0 of 0',
//     demoCallPercentage: '0%',
//     demoCallCount: '0 of 0',
//     onboardingCallPercentage: '0%',
//     onboardingCallCount: '0 of 0',
//   });
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [avgDailyMRR, setAvgDailyMRR] = useState(0);
//   const [mrrTrajectory, setMrrTrajectory] = useState(0);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedRange, setSelectedRange] = useState('1W');
//   const [filterState, setFilterState] = useState({
//     calendar: 'all',
//     product: 'all',
//     firstTransaction: 'all',
//     mailgun: 'all',
//     paymentProcessor: 'all',
//     demoScheduled: 'all',
//     onboardingScheduled: 'all',
//     demoCompleted: 'all', // New filter
//     onboardingCompleted: 'all', // New filter
//     plan: 'all',
//     status: ['active', 'trialing', 'past_due', 'canceled']
//   });


//   useEffect(() => {
//     console.log('Fetching data for date range:', startDate, endDate);
//     fetchData(startDate, endDate);
//   }, [startDate, endDate]);

//   const openModal = (callType, user) => {
//     console.log('Opening modal for:', callType, user); // Debugging log
//     setModalCallType(callType);
//     setModalUser(user);
//     setIsModalOpen(true);
//   };
  
//   const closeModal = () => {
//     console.log('Closing modal'); // Debugging log
//     setIsModalOpen(false);
//     setModalCallType('');
//     setModalUser(null);
//   };

//   const formatDemoCompleted = (user) => {
//     const demoCall = user.demo_call;
//     if (!demoCall || demoCall.scheduled_call === false) {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     } else if (demoCall.completed_call === true) {
//       return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
//     } else if (demoCall.completed_call === 'unknown' || demoCall.completed_call === undefined) {
//       return (
//         <button
//           className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
//           onClick={() => openReportModal('Demo', user)}
//         >
//           Report
//         </button>
//       );
//     } else {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     }
//   };

//   const formatOnboardingCompleted = (user) => {
//     const onboardingCall = user.onboarding_call;
//     if (!onboardingCall || onboardingCall.scheduled_call === false) {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     } else if (onboardingCall.completed_call === true) {
//       return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
//     } else if (onboardingCall.completed_call === 'unknown' || onboardingCall.completed_call === undefined) {
//       return (
//         <button
//           className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
//           onClick={() => openReportModal('Onboarding', user)}
//         >
//           Report
//         </button>
//       );
//     } else {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     }
//   };
  
//   const fetchData = (start, end) => {
//     console.log('Sending request with start date:', start, 'and end date:', end);
//     axios.post('https://rozduvvh2or5rxgucec3rfdp5e0hupbk.lambda-url.us-west-2.on.aws/', {
//       startDate: start.toISOString().split('T')[0],
//       endDate: end.toISOString().split('T')[0]
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     .then(response => {
//       console.log('Received response:', response);
//       if (!Array.isArray(response.data)) {
//         console.error('Expected response data to be an array, but got:', response.data);
//         return;
//       }
//       const users = response.data.map(user => {
//         const hasIncome = parseFloat(user.income_all_time) > 0 || parseFloat(user.income_7_days) > 0 || parseFloat(user.income_30_days) > 0 || parseFloat(user.income_90_days) > 0;
//         if (!user.relative_created_time) {
//           console.warn('Missing relative_created_time for user:', user);
//         }
//         return {
//           ...user,
//           mailgun_connected: user.mailgun_connected === "true" || user.mailgun_connected === true,
//           has_had_first_transaction: hasIncome || user.has_had_first_transaction === "true" || user.has_had_first_transaction === true,
//           payment_processor_integration: user.payment_processor_integration === "True" || user.payment_processor_integration === true,
//           relative_created_time: user.relative_created_time ? parseRelativeTime(user.relative_created_time) : new Date(), // Handle undefined relative_created_time
//           demo_call: user.demo_call ? {
//             scheduled_call: user.demo_call.scheduled_call,
//             completed_call: user.demo_call.completed_call,
//             appointment_time: user.demo_call.appointment_time, // Include appointment_time
//             employee_name: user.demo_call.employee_name // Include employee_name
//           } : { scheduled_call: false, completed_call: false, appointment_time: null, employee_name: null },
//           onboarding_call: user.onboarding_call ? {
//             scheduled_call: user.onboarding_call.scheduled_call,
//             completed_call: user.onboarding_call.completed_call,
//             appointment_time: user.onboarding_call.appointment_time // Include appointment_time
//           } : { scheduled_call: false, completed_call: false, appointment_time: null }
//         };
//       });
  
//       console.log('Processed users:', users);
//       setUsers(users);
//       setFilteredUsers(users.filter(user => user.account_status !== 'Unknown'));
//       updateCards(users.filter(user => user.account_status !== 'Unknown'));
  
//       const totalRevenue = calculateTotalRevenue(users);
//       const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, start, end);
//       setTotalRevenue(totalRevenue);
//       setAvgDailyMRR(avgDailyMRR);
//       setMrrTrajectory(mrrTrajectory);
  
//       const revenueTrendData = aggregateRevenueByDay(users);
//       console.log(revenueTrendData, 'revenue trend data')
//       setRevenueTrendData(revenueTrendData);
//     })
//     .catch(error => {
//       console.error('Error fetching users:', error);
//     });
//   };

//   const calculateTotalRevenue = (users) => {
//     return users.reduce((sum, user) => {
//       const { product_id } = user;
//       const { price } = getProductPriceAndStyle(product_id);
//       return sum + parseFloat(price.replace('$', '').replace(',', ''));
//     }, 0);
//   };

//   // const calculateLeviCommission = (users) => {
//   //   const filteredUsers = users.filter(user => 
//   //     user.demo_call?.scheduled_call && 
//   //     user.demo_call?.completed_call === true && 
//   //     user.onboarding_call?.scheduled_call
//   //   );
  
//   //   const totalRevenue = filteredUsers.reduce((sum, user) => {
//   //     const { price } = getProductPriceAndStyle(user.product_id);
//   //     return sum + parseFloat(price.replace('$', '').replace(',', ''));
//   //   }, 0);
  
//   //   return totalRevenue;
//   // };

//   const calculateMRR = (totalRevenue, startDate, endDate) => {
//     const workdays = calculateWorkdays(startDate, endDate);
//     const avgDailyMRR = workdays > 0 ? totalRevenue / workdays : 0;
//     const mrrTrajectory = avgDailyMRR * 22; // Assuming 22 workdays in a month
//     return { avgDailyMRR, mrrTrajectory };
//   };

//   const calculateWorkdays = (startDate, endDate) => {
//     let count = 0;
//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       const dayOfWeek = currentDate.getDay();
//       if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
//         count++;
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return count;
//   };

//   const parseRelativeTime = (relativeTime) => {
//     const now = new Date();
//     const timeParts = relativeTime.split(' ');
//     const value = parseInt(timeParts[0], 10);
//     const unit = timeParts[1];
//     if (isNaN(value)) {
//       return now; // Return current date if parsing fails
//     }
//     switch (unit) {
//       case 'seconds':
//       case 'second':
//         return new Date(now.getTime() - value * 1000);
//       case 'minutes':
//       case 'minute':
//         return new Date(now.getTime() - value * 60 * 1000);
//       case 'hours':
//       case 'hour':
//         return new Date(now.getTime() - value * 60 * 60 * 1000);
//       case 'days':
//       case 'day':
//         return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
//       case 'weeks':
//       case 'week':
//         return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
//       default:
//         return now; // Return current date if unit is unrecognized
//     }
//   };

//   const handleSort = (field) => {
//     console.log('Sorting by field:', field);
//     const newSortDirection = sortField === field ? sortDirection * -1 : -1;
//     setSortField(field);
//     setSortDirection(newSortDirection);
//     const sortedUsers = [...filteredUsers].sort((a, b) => {
//       let valA = parseFloat(a[field]);
//       let valB = parseFloat(b[field]);
//       if (isNaN(valA) || isNaN(valB)) {
//         return 0;
//       } else {
//         return (valA < valB ? -1 : 1) * newSortDirection;
//       }
//     });
//     console.log('Sorted users:', sortedUsers);
//     setFilteredUsers(sortedUsers);
//   };

//   const getProductPriceAndStyle = (productId) => {
//     switch (productId) {
//       case 'prod_NC25k0PnePTpDK':
//       case 'prod_PuhtpFfKP74tSq':
//         return { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' }; // Platinum
//       case 'prod_PpFYdvqmj38F2I':
//         return { price: '$297', style: 'bg-yellow-200 border-yellow-400 text-yellow-800' }; // Elite
//       case 'prod_PpFXqy79vlGOIE':
//       case 'prod_PdPwwouLLJod3b':
//       case 'prod_M6IyZeJydN4vMn':
//         return { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' }; // Premium
//       case 'prod_OvDkzhKINbc38T':
//       case 'prod_M6IyfUy0ONYSIw':
//         return { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' }; // Starter
//       default:
//       case 'prod_M6Iy3zjRHbDmm8':
//         console.log(productId, 'productid')
//         return { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' }; // Default Basic
//     }
//   };

//   const renderTable = () => {
//     if (!Array.isArray(filteredUsers)) {
//       console.error('Expected filteredUsers to be an array, but got:', filteredUsers);
//       return null;
//     }
  
//     return filteredUsers.map(user => {
//       const { price, style } = getProductPriceAndStyle(user.product_id);
//       const formattedDate = formatDate(user.timestamp);
  
//       console.log('User:', user.location_name, 'Timestamp:', user.timestamp, 'Formatted Date:', formattedDate);
  
//       return (
//         <TableRow key={user.location_id}>
//           <TableCell>
//             <div className="flex items-center">
//               <a href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`} className="text-indigo-600 hover:text-indigo-900 location-name">
//                 {user.location_name.replace("'s Account", '').replace('Account', '').trim().length > 15 ? `${user.location_name.replace("'s Account", '').replace('Account', '').trim().substring(0, 15)}...` : user.location_name.replace("'s Account", '').replace('Account', '').trim()}
//               </a>
//               <a href={user.contact_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                 </svg>
//               </a>
//             </div>
//             <div className="text-xs text-gray-500 flex items-center">
//               <div className={`flex-none rounded-full p-1 ${getStatusBgColor(user.account_status)}`}>
//                 <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
//               </div>
//               <time className="text-gray-400 sm:hidden" dateTime={user.timestamp}>{formattedDate}</time>
//               <div className="hidden sm:block ml-2">{formatAccountStatus(user.account_status)}</div>
//               <div className={`ml-2 px-2 py-1 rounded-md border ${style}`}>{price}</div>
//             </div>
//           </TableCell>
//           <TableCell>{formatHasDemoCallScheduled(user.demo_call)}</TableCell>
//           <TableCell>
//             {user.demo_call && user.demo_call.scheduled_call && user.demo_call.completed_call === 'unknown' ? (
//               <button onClick={() => openReportModal('Demo', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
//             ) : formatDemoCompleted(user)}
//           </TableCell>
//           <TableCell>{formatHasOnboardingCallScheduled(user.onboarding_call)}</TableCell>
//           <TableCell>
//             {user.onboarding_call && user.onboarding_call.scheduled_call && user.onboarding_call.completed_call === 'unknown' ? (
//               <button onClick={() => openReportModal('Onboarding', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
//             ) : formatOnboardingCompleted(user)}
//           </TableCell>
//           <TableCell><span className={`text-xs font-semibold ${user.mailgun_connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatMailgunConnected(user.mailgun_connected)}</span></TableCell>
//           <TableCell><span className={`text-xs font-semibold ${user.payment_processor_integration ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatPaymentProcessor(user.payment_processor_integration)}</span></TableCell>
//         </TableRow>
//       );
//     });
//   };

//   const getStatusBgColor = (status) => {
//     if (!status) return 'bg-gray-400/10 text-gray-400';
//     switch (status.toLowerCase()) {
//       case 'active':
//         return 'bg-green-400/10 text-green-400';
//       case 'canceled':
//         return 'bg-red-400/10 text-red-400';
//       case 'past_due':
//         return 'bg-yellow-400/10 text-yellow-400';
//       case 'trialing':
//         return 'bg-blue-400/10 text-blue-400';
//       default:
//         return 'bg-gray-400/10 text-gray-400';
//     }
//   };

//   const updateCards = (filteredUsers) => {
//     console.log('Updating cards with filtered users:', filteredUsers);
//     const filteredWithoutUnknown = filteredUsers.filter(user => user.account_status !== 'Unknown');
//     const totalUsers = filteredWithoutUnknown.length;
//     const mailgunConnectedCount = filteredWithoutUnknown.filter(user => user.mailgun_connected).length;
//     const firstTransactionCount = filteredWithoutUnknown.filter(user => user.has_had_first_transaction).length;
//     const paymentProcessorCount = filteredWithoutUnknown.filter(user => user.payment_processor_integration).length;
//     const demoCallCount = filteredWithoutUnknown.filter(user => user.demo_call.scheduled_call).length;
//     const onboardingCallCount = filteredWithoutUnknown.filter(user => user.onboarding_call.scheduled_call).length;
//     const mailgunPercentage = totalUsers ? (mailgunConnectedCount / totalUsers * 100).toFixed(2) : 0;
//     const transactionPercentage = totalUsers ? (firstTransactionCount / totalUsers * 100).toFixed(2) : 0;
//     const paymentProcessorPercentage = totalUsers ? (paymentProcessorCount / totalUsers * 100).toFixed(2) : 0;
//     const demoCallPercentage = totalUsers ? (demoCallCount / totalUsers * 100).toFixed(2) : 0;
//     const onboardingCallPercentage = totalUsers ? (onboardingCallCount / totalUsers * 100).toFixed(2) : 0;
//     const profitableUsers = filteredWithoutUnknown.filter(user => user.has_had_first_transaction && user.time_to_become_profitable);
//     const totalProfitableTime = profitableUsers.reduce((sum, user) => sum + user.time_to_become_profitable, 0);
//     const averageTimeToRevenue = totalProfitableTime ? (totalProfitableTime / profitableUsers.length) / (1000 * 60 * 60 * 24) : 0;
//     const activeCount = filteredWithoutUnknown.filter(user => user.account_status === 'active').length;
//     const canceledCount = filteredWithoutUnknown.filter(user => user.account_status === 'canceled').length;
//     const pastDueCount = filteredWithoutUnknown.filter(user => user.account_status === 'past_due').length;
//     const trialingCount = filteredWithoutUnknown.filter(user => user.account_status === 'trialing').length;
//     const activePercentage = totalUsers ? (activeCount / totalUsers * 100).toFixed(2) : 0;
//     const canceledPercentage = totalUsers ? (canceledCount / totalUsers * 100).toFixed(2) : 0;
//     const pastDuePercentage = totalUsers ? (pastDueCount / totalUsers * 100).toFixed(2) : 0;
//     const trialingPercentage = totalUsers ? (trialingCount / totalUsers * 100).toFixed(2) : 0;
// setStats({
//   mailgunPercentage: `${mailgunPercentage}%`,
//   mailgunCount: `${mailgunConnectedCount} of ${totalUsers}`,
//   transactionPercentage: `${transactionPercentage}%`,
//   transactionCount: `${firstTransactionCount} of ${totalUsers}`,
//   paymentProcessorPercentage: `${paymentProcessorPercentage}%`,
//   paymentProcessorCount: `${paymentProcessorCount} of ${totalUsers}`,
//   averageTimeToRevenue: `${averageTimeToRevenue.toFixed(2)} days`,
//   activePercentage: `${activePercentage}%`,
//   activeCount: `${activeCount} of ${totalUsers}`,
//   canceledPercentage: `${canceledPercentage}%`,
//   canceledCount: `${canceledCount} of ${totalUsers}`,
//   pastDuePercentage: `${pastDuePercentage}%`,
//   pastDueCount: `${pastDueCount} of ${totalUsers}`,
//   trialingPercentage: `${trialingPercentage}%`,
//   trialingCount: `${trialingCount} of ${totalUsers}`,
//   demoCallPercentage: `${demoCallPercentage}%`,
//   demoCallCount: `${demoCallCount} of ${totalUsers}`,
//   onboardingCallPercentage: `${onboardingCallPercentage}%`,
//   onboardingCallCount: `${onboardingCallCount} of ${totalUsers}`,
// });
// };
    
// const aggregateDataByDay = (data, field) => {
//   if (!Array.isArray(data)) {
//     console.error('Expected data to be an array, but got:', data);
//     return [];
//   }
//   const aggregatedData = {};
//   const totalUsersByDay = {};
//   const runningTotal = { count: 0, total: 0 };
//   data.forEach(item => {
//     const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
//     if (!aggregatedData[date]) {
//       aggregatedData[date] = 0;
//       totalUsersByDay[date] = 0;
//     }
//     totalUsersByDay[date] += 1;
//     if (item[field]) {
//       aggregatedData[date] += 1;
//     }
//   });
//   const result = Object.keys(aggregatedData)
//     .sort((a, b) => new Date(a) - new Date(b))
//     .map(date => {
//       runningTotal.count += totalUsersByDay[date];
//       runningTotal.total += aggregatedData[date];
//       return {
//         date,
//         value: (runningTotal.total / runningTotal.count) * 100, // Calculate running average percentage
//       };
//     });
//   return result;
// };
    
// const aggregateRevenueByDay = (users) => {
//   const aggregatedData = {};
//   users.forEach(user => {
//     const date = new Date(user.timestamp * 1000).toISOString().split('T')[0]; // Ensure correct date conversion
//     const { product_id } = user;
//     const { price } = getProductPriceAndStyle(product_id);
//     if (!aggregatedData[date]) {
//       aggregatedData[date] = 0;
//     }
//     aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
//   });
//   const result = Object.keys(aggregatedData)
//     .map(date => ({
//       date: new Date(date), // Ensure date is a JavaScript Date object
//       value: aggregatedData[date],
//     }))
//     .sort((a, b) => new Date(a.date) - new Date(b.date));
//   console.log('Aggregated Revenue Data:', result); // Debug the data
//   return result;
// };

// const aggregateCumulativeRevenueByDay = (users) => {
//   const aggregatedData = {};
//   let cumulativeRevenue = 0;
  
//   users.forEach(user => {
//     const date = new Date(user.timestamp * 1000).toISOString().split('T')[0];
//     const { product_id } = user;
//     const { price } = getProductPriceAndStyle(product_id);
//     if (!aggregatedData[date]) {
//       aggregatedData[date] = 0;
//     }
//     aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
//   });

//   const result = Object.keys(aggregatedData)
//     .sort((a, b) => new Date(a) - new Date(b))
//     .map(date => {
//       cumulativeRevenue += aggregatedData[date];
//       return {
//         date: new Date(date), // Ensure date is a JavaScript Date object
//         value: cumulativeRevenue,
//       };
//     });

//   console.log('Cumulative Revenue Data:', result); // Debug the data
//   return result;
// };

    
//       const StatCard = ({ title, value, subtitle, trendData, showGraph, isPercentage }) => {
//         const statusClasses = {
//           'Active': 'bg-green-600',
//           'Canceled': 'bg-red-600',
//           'Past Due': 'bg-yellow-600',
//           'Trialing': 'bg-blue-600',
//           'Unknown': 'bg-gray-600'
//         };
//         const formattedTitle = statusClasses[title] ? (
//           <div className="flex items-center">
//             <span className={`inline-block w-2 h-2 mr-2 rounded-full ${statusClasses[title]}`}></span>
//             <span>{title}</span>
//           </div>
//         ) : (
//           title
//         );
//         const textColor = (title === 'MailGun Connected' || title === 'Payment Processor Connected') ? 'text-green-600' : 'text-gray-900';
//         return (
//           <div className="flex flex-col bg-white p-4 shadow rounded-md">
//             <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{formattedTitle}</dt>
//             <dd className={`text-2xl font-bold tracking-tight ${textColor} mt-1 text-left`}>{value}</dd>
//             {subtitle && <dd className="text-xs text-gray-600 mt-0 text-left">{subtitle}</dd>}
//             {showGraph && (
//               <div className="flex-grow w-full">
//                 <TrendGraph data={trendData} isPercentage={isPercentage} />
//               </div>
//             )}
//           </div>
//         );
//       };
    
//       const TrendGraph = ({ data, isPercentage }) => (
//         <ResponsiveContainer width="100%" height={100}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="date"
//               tickFormatter={(tick) => formatDate(tick)}
//               ticks={[data[0]?.date, data[data.length - 1]?.date]}
//             />
//             <YAxis
//               tickFormatter={(tick) => isPercentage ? `${Math.round(tick)}%` : formatCurrency(tick)}
//               tick={{ fontSize: 10 }} // Make the numbers smaller
//             />
//             <Tooltip
//               formatter={(value) => isPercentage ? `${Math.round(value)}%` : formatCurrency(value)}
//               labelFormatter={(label) => formatDate(label)}
//             />
//             <Line type="monotone" dataKey="value" stroke="#0072c6" dot={false} />
//           </LineChart>
//         </ResponsiveContainer>
//       );
    
//       const formatDate = (date) => {
//         if (!(date instanceof Date)) {
//           date = new Date(date); // Ensure date is a JavaScript Date object
//         }
//         return date.toLocaleDateString('default', { month: 'short', day: 'numeric' }); // Use toLocaleDateString for consistent formatting
//       };

// // Ensure formatCurrency function is defined
// const formatCurrency = (value) => {
//   if (value >= 1000) {
//     return `$${(value / 1000).toFixed(1)}K`;
//   }
//   return `$${value.toLocaleString()}`;
// };
    
//       const formatStatus = (status) => {
//         const statusClasses = {
//           'active': 'text-green-600 bg-green-100',
//           'canceled': 'text-red-600 bg-red-100',
//           'past_due': 'text-yellow-600 bg-yellow-100',
//           'trialing': 'text-purple-600 bg-blue-100',
//           'unknown': 'text-gray-600 bg-gray-100'
//         };
//         return <span className={`text-xs font-semibold ${statusClasses[status.toLowerCase()] || 'text-gray-600 bg-gray-100'} rounded-full`}>{formatAccountStatus(status)}</span>;
//       };
    
//       const handleRangeChange = (range) => {
//         setSelectedRange(range);
//         const today = new Date();
//         let start, end;
//         switch (range) {
//           case '1W':
//             start = new Date(today);
//             start.setDate(today.getDate() - 7);
//             end = new Date();
//             break;
//           case '4W':
//             start = new Date(today);
//             start.setDate(today.getDate() - 28);
//             end = new Date();
//             break;
//           case '3M':
//             start = new Date(today);
//             start.setMonth(today.getMonth() - 3);
//             end = new Date();
//             break;
//           case '1Y':
//             start = new Date(today);
//             start.setFullYear(today.getFullYear() - 1);
//             end = new Date();
//             break;
//           case 'MTD':
//             start = new Date(today.getFullYear(), today.getMonth(), 1);
//             end = new Date();
//             break;
//           case 'QTD':
//             start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
//             end = new Date();
//             break;
//           case 'YTD':
//             start = new Date(today.getFullYear(), 0, 1);
//             end = new Date();
//             break;
//           case 'ALL':
//             start = new Date(2000, 0, 1); // Arbitrary old date
//             end = new Date();
//             break;
//           default:
//             start = end = new Date();
//         }
      
//         console.log('Selected Range:', range);
//         console.log('Start Date:', start);
//         console.log('End Date:', end);
      
//         setStartDate(start);
//         setEndDate(end);
//         fetchData(start, end);
//       };
    
//       const DateRangeSelector = () => (
//         <div className="flex space-x-1">
//           {['1W', '4W', '3M', '1Y', 'MTD', 'QTD', 'YTD', 'ALL'].map(range => (
//             <button
//               key={range}
//               onClick={() => handleRangeChange(range)}
//               className={`text-sm font-semibold px-2 py-1 rounded-md ${selectedRange === range ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
//             >
//               {range}
//             </button>
//           ))}
//         </div>
//       );
    
//       const handleFilterChange = (filters) => {
//         setFilterState(filters);
//         const filteredUsers = users.filter(user => {
//           const statusMatch = filters.status.includes(user.account_status);
//           const planMatch = filters.plan === 'all' ||
//             (filters.plan === 'platinum' && ['prod_NC25k0PnePTpDK', 'prod_PuhtpFfKP74tSq'].includes(user.product_id)) ||
//             (filters.plan === 'prod_PpFXqy79vlGOIE' && ['prod_PpFXqy79vlGOIE', 'prod_PdPwwouLLJod3b', 'prod_M6IyZeJydN4vMn'].includes(user.product_id)) ||
//             (filters.plan === 'prod_OvDkzhKINbc38T' && ['prod_OvDkzhKINbc38T', 'prod_M6IyfUy0ONYSIw'].includes(user.product_id)) ||
//             filters.plan === user.product_id;
      
//           return (filters.calendar === 'all' || (filters.calendar === 'true' && user.total_calendars > 0) || (filters.calendar === 'false' && user.total_calendars === 0)) &&
//             (filters.product === 'all' || (filters.product === 'true' && user.total_products > 0) || (filters.product === 'false' && user.total_products === 0)) &&
//             (filters.firstTransaction === 'all' || (filters.firstTransaction === 'true' && user.has_had_first_transaction) || (filters.firstTransaction === 'false' && !user.has_had_first_transaction)) &&
//             (filters.mailgun === 'all' || (filters.mailgun === 'true' && user.mailgun_connected) || (filters.mailgun === 'false' && !user.mailgun_connected)) &&
//             (filters.paymentProcessor === 'all' || (filters.paymentProcessor === 'True' && user.payment_processor_integration) || (filters.paymentProcessor === 'False' && !user.payment_processor_integration)) &&
//             (filters.demoScheduled === 'all' ||
//               (filters.demoScheduled === 'true' && user.demo_call?.scheduled_call) ||
//               (filters.demoScheduled === 'false' && (!user.demo_call || !user.demo_call.scheduled_call))) &&
//             (filters.onboardingScheduled === 'all' ||
//               (filters.onboardingScheduled === 'true' && user.onboarding_call?.scheduled_call) ||
//               (filters.onboardingScheduled === 'false' && (!user.onboarding_call || !user.onboarding_call.scheduled_call))) &&
//             (filters.demoCompleted === 'all' ||
//               (filters.demoCompleted === 'true' && user.demo_call?.completed_call === true) ||
//               (filters.demoCompleted === 'false' && user.demo_call?.completed_call === false)) &&
//             (filters.onboardingCompleted === 'all' ||
//               (filters.onboardingCompleted === 'true' && user.onboarding_call?.completed_call === true) ||
//               (filters.onboardingCompleted === 'false' && user.onboarding_call?.completed_call === false)) &&
//             planMatch &&
//             statusMatch;
//         });
      
//         setFilteredUsers(filteredUsers);
//         updateCards(filteredUsers);
      
//         // Recalculate Total Revenue, Daily MRR, and MRR Trajectory
//         const totalRevenue = calculateTotalRevenue(filteredUsers);
//         const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, startDate, endDate);
//         setTotalRevenue(totalRevenue);
//         setAvgDailyMRR(avgDailyMRR);
//         setMrrTrajectory(mrrTrajectory);
//       };
    




//       return (
//         <>
//           <div className="py-12 sm:py-16 bg-white">
//             <div className="mx-auto max-w-7xl px-4 lg:px-6">
//               <div className="text-left">
//                 <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">User Data</Heading>
//                 <p className="mt-4 text-lg leading-8 text-gray-600">Overview of user data based on the selected date range.</p>
//                 <hr className="mt-4 mb-8 border-t border-gray-300" />
//               </div>
//               <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
//                 <div className="flex flex-col sm:flex-row sm:flex-grow sm:space-x-4">
//                   <div className="hidden sm:block">
//                     <SalesDatePicker
//                       startDate={startDate}
//                       setStartDate={setStartDate}
//                       endDate={endDate}
//                       setEndDate={setEndDate}
//                       fetchSalesData={fetchData}
//                     />
//                   </div>
//                 </div>
//                 <Button className="hidden sm:block sm:ml-auto" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
//                 <div className="block sm:hidden w-full">
//                   <Button className="mt-4 w-full" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
//                   <SalesDatePicker
//                     startDate={startDate}
//                     setStartDate={setStartDate}
//                     endDate={endDate}
//                     setEndDate={setEndDate}
//                     fetchSalesData={fetchData}
//                   />
//                 </div>
//               </div>
//               <dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
//   <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} showGraph={true} isPercentage={true} />
//   <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} showGraph={true} isPercentage={true} />
//   <CombinedStatusCard stats={stats} />
//   <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle={`Sum of all revenue`} trendData={aggregateCumulativeRevenueByDay(filteredUsers)} showGraph={true} isPercentage={false} />
//   <StatCard title="Daily MRR" value={formatCurrency(avgDailyMRR)} subtitle={`Average Daily increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
//   <StatCard title="MRR Trajectory" value={formatCurrency(mrrTrajectory)} subtitle={`Projected monthly increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
//   <StatCard title="Demo Call Scheduled" value={stats.demoCallPercentage} subtitle={stats.demoCallCount} trendData={aggregateDataByDay(filteredUsers, 'demo_call')} showGraph={true} isPercentage={true} />
//   <StatCard title="Onboarding Call Scheduled" value={stats.onboardingCallPercentage} subtitle={stats.onboardingCallCount} trendData={aggregateDataByDay(filteredUsers, 'onboarding_call')} showGraph={true} isPercentage={true} />
//   <LeviCommissionCard users={filteredUsers} /> {/* New stat card */}
// </dl>
//             </div>
//           </div>
//           <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 bg-white-100">
//             <div className="mx-auto max-w-7xl bg-white-100">
//               <Table className="table-auto w-full bg-white-100">
//                 <CallReportingModal
//                   isOpen={isModalOpen}
//                   onClose={closeReportModal}
//                   callType={modalCallType}
//                   user={modalUser}
//                 />
//                 <TableHead>
//                   <TableRow>
//                     <TableHeader>Location Name</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('demo_call')}>Demo<br />Scheduled</TableHeader>
//                     <TableHeader>Demo<br />Completed</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('onboarding_call')}>Onboarding<br />Scheduled</TableHeader>
//                     <TableHeader>Onboarding<br />Completed</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('mailgun_connected')}>Mailgun</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('payment_processor_integration')}>Pay<br />Int</TableHeader>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {renderTable()}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//           {isFilterPanelOpen && (
//             <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-end">
//               <div className="bg-white w-64 p-4 shadow-lg">
//                 <button onClick={() => setIsFilterPanelOpen(false)} className="mb-4">Close</button>
//                 <Filters
//                   onFilterChange={handleFilterChange}
//                   users={users}
//                   filterState={filterState}
//                   setIsFilterPanelOpen={setIsFilterPanelOpen}
//                 />
//               </div>
//             </div>
//           )}
//           <style jsx>{`
//             th, td {
//               padding: 0.5rem 0.75rem; /* Adjust padding to make columns less spaced apart */
//             }
//             th {
//               font-size: 0.5rem; /* Smaller text for table headers */
//               white-space: normal; /* Allow text to wrap onto two lines */
//             }
//             .location-name {
//               font-size: 0.875rem; /* Smaller text for location name */
//             }
//             .status-dot {
//               display: inline-block;
//               width: 0.5rem;
//               height: 0.5rem;
//               border-radius: 50%;
//               margin-right: 0.5rem;
//             }
//             .text-green-600 {
//               color: #16a34a;
//             }
//             .text-yellow-700 {
//               font-size: 0.875rem; /* Ensure the same size as "Yes" and "No" */
//             }
//             .bg-yellow-100 {
//               background-color: #fef3c7;
//             }
//             .border-yellow-700 {
//               border-color: #d97706;
//             }
//             @media (max-width: 640px) {
//               .flex-col {
//                 flex-direction: column;
//               }
//               .table-auto {
//                 display: block;
//                 overflow-x: auto;
//                 white-space: nowrap;
//               }
//               .table-auto th, .table-auto td {
//                 display: inline-block;
//                 width: auto;
//               }
//               th, td {
//                 font-size: 0.75rem; /* Smaller text for table data */
//               }
//               .hidden {
//                 display: none;
//               }
//             }
//             button {
//               position: relative;
//               z-index: 10; /* Ensure the button is on top */
//             }
//           `}</style>
//         </>
//       );};
// new code with tabs that doesnt work
// 'use client'
// import React, { useState, useEffect } from 'react';
// import SalesDatePicker from './SalesDatePicker';
// import { Avatar } from '@/components/avatar';
// import { Button } from '@/components/button';
// import { Heading } from '@/components/heading';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import axios from 'axios';
// import {
//   formatIncome,
//   formatFirstTransaction,
//   formatMailgunConnected,
//   formatPaymentProcessor,
//   formatAccountStatus,
//   formatHasDemoCallScheduled,
//   formatHasOnboardingCallScheduled,
//   formatCurrency // Ensure this utility function is available
// } from './utils';
// import { Filters } from './Filters'; // Assuming Filters component is available
// import CallReportingModal from './CallReportingModal'; // Import the modal component
// import CombinedStatusCard from './CombinedStatusCard';
// import LeviCommissionCard from './LeviCommissionCard'; // Import the new LeviCommissionCard component

// const getProductPriceAndStyle = (productId) => {
//   switch (productId) {
//     case 'prod_NC25k0PnePTpDK':
//     case 'prod_PuhtpFfKP74tSq':
//       return { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' }; // Platinum
//     case 'prod_PpFYdvqmj38F2I':
//       return { price: '$297', style: 'bg-yellow-200 border-yellow-400 text-yellow-800' }; // Elite
//     case 'prod_PpFXqy79vlGOIE':
//     case 'prod_PdPwwouLLJod3b':
//     case 'prod_M6IyZeJydN4vMn':
//       return { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' }; // Premium
//     case 'prod_OvDkzhKINbc38T':
//     case 'prod_M6IyfUy0ONYSIw':
//       return { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' }; // Starter
//     default:
//     case 'prod_M6Iy3zjRHbDmm8':
//       console.log(productId, 'productid');
//       return { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' }; // Default Basic
//   }
// };

// const aggregateCumulativeRevenueByDay = (users) => {
//   const aggregatedData = {};
//   let cumulativeRevenue = 0;
//   users.forEach(user => {
//     const date = new Date(user.timestamp * 1000).toISOString().split('T')[0];
//     const { product_id } = user;
//     const { price } = getProductPriceAndStyle(product_id);
//     if (!aggregatedData[date]) {
//       aggregatedData[date] = 0;
//     }
//     aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
//   });
//   const result = Object.keys(aggregatedData)
//     .sort((a, b) => new Date(a) - new Date(b))
//     .map(date => {
//       cumulativeRevenue += aggregatedData[date];
//       return {
//         date: new Date(date), // Ensure date is a JavaScript Date object
//         value: cumulativeRevenue,
//       };
//     });
//   console.log('Cumulative Revenue Data:', result); // Debug the data
//   return result;
// };

// const aggregateDataByDay = (data, field) => {
//   if (!Array.isArray(data)) {
//     console.error('Expected data to be an array, but got:', data);
//     return [];
//   }
//   const aggregatedData = {};
//   const totalUsersByDay = {};
//   const runningTotal = { count: 0, total: 0 };
//   data.forEach(item => {
//     const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
//     if (!aggregatedData[date]) {
//       aggregatedData[date] = 0;
//       totalUsersByDay[date] = 0;
//     }
//     totalUsersByDay[date] += 1;
//     if (item[field]) {
//       aggregatedData[date] += 1;
//     }
//   });
//   const result = Object.keys(aggregatedData)
//     .sort((a, b) => new Date(a) - new Date(b))
//     .map(date => {
//       runningTotal.count += totalUsersByDay[date];
//       runningTotal.total += aggregatedData[date];
//       return {
//         date,
//         value: (runningTotal.total / runningTotal.count) * 100, // Calculate running average percentage
//       };
//     });
//   console.log('Aggregated Data by Day:', result); // Debug the data
//   return result;
// };

// export default function Home() {
//   const [startDate, setStartDate] = useState(() => {
//     const date = new Date();
//     date.setDate(date.getDate() - 7);
//     return date;
//   });
//   const [endDate, setEndDate] = useState(new Date());
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState(1);
//   const [leviCommission, setLeviCommission] = useState(0);
//   const [stats, setStats] = useState({
//     mailgunPercentage: '0%',
//     mailgunCount: '0 of 0',
//     transactionPercentage: '0%',
//     transactionCount: '0 of 0',
//     paymentProcessorPercentage: '0%',
//     paymentProcessorCount: '0 of 0',
//     averageTimeToRevenue: '0 days',
//     activePercentage: '0%',
//     activeCount: '0 of 0',
//     canceledPercentage: '0%',
//     canceledCount: '0 of 0',
//     pastDuePercentage: '0%',
//     pastDueCount: '0 of 0',
//     trialingPercentage: '0%',
//     trialingCount: '0 of 0',
//     demoCallPercentage: '0%',
//     demoCallCount: '0 of 0',
//     onboardingCallPercentage: '0%',
//     onboardingCallCount: '0 of 0',
//   });
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [avgDailyMRR, setAvgDailyMRR] = useState(0);
//   const [mrrTrajectory, setMrrTrajectory] = useState(0);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedRange, setSelectedRange] = useState('1W');
//   const [filterState, setFilterState] = useState({
//     calendar: 'all',
//     product: 'all',
//     firstTransaction: 'all',
//     mailgun: 'all',
//     paymentProcessor: 'all',
//     demoScheduled: 'all',
//     onboardingScheduled: 'all',
//     demoCompleted: 'all', // New filter
//     onboardingCompleted: 'all', // New filter
//     plan: 'all',
//     status: ['active', 'trialing', 'past_due', 'canceled']
//   });
//   const [activeTab, setActiveTab] = useState('Home'); // State to manage active tab
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalCallType, setModalCallType] = useState('');
//   const [modalUser, setModalUser] = useState(null);

//   const closeReportModal = () => {
//     setIsModalOpen(false);
//     setModalCallType('');
//     setModalUser(null);
//   };

//   const openReportModal = (callType, user) => {
//     setModalCallType(callType);
//     setModalUser(user);
//     setIsModalOpen(true);
//     console.log(modalUser, 'user here here');
//     console.log(callType);
//   };

//   const fetchData = (start, end) => {
//     console.log('Sending request with start date:', start, 'and end date:', end);
//     axios.post('https://rozduvvh2or5rxgucec3rfdp5e0hupbk.lambda-url.us-west-2.on.aws/', {
//       startDate: start.toISOString().split('T')[0],
//       endDate: end.toISOString().split('T')[0]
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(response => {
//         console.log('Received response:', response);
//         if (!Array.isArray(response.data)) {
//           console.error('Expected response data to be an array, but got:', response.data);
//           return;
//         }
//         const users = response.data.map(user => {
//           const hasIncome = parseFloat(user.income_all_time) > 0 || parseFloat(user.income_7_days) > 0 || parseFloat(user.income_30_days) > 0 || parseFloat(user.income_90_days) > 0;
//           if (!user.relative_created_time) {
//             console.warn('Missing relative_created_time for user:', user);
//           }
//           return {
//             ...user,
//             mailgun_connected: user.mailgun_connected === "true" || user.mailgun_connected === true,
//             has_had_first_transaction: hasIncome || user.has_had_first_transaction === "true" || user.has_had_first_transaction === true,
//             payment_processor_integration: user.payment_processor_integration === "True" || user.payment_processor_integration === true,
//             relative_created_time: user.relative_created_time ? parseRelativeTime(user.relative_created_time) : new Date(), // Handle undefined relative_created_time
//             demo_call: user.demo_call ? {
//               scheduled_call: user.demo_call.scheduled_call,
//               completed_call: user.demo_call.completed_call,
//               appointment_time: user.demo_call.appointment_time, // Include appointment_time
//               employee_name: user.demo_call.employee_name // Include employee_name
//             } : { scheduled_call: false, completed_call: false, appointment_time: null, employee_name: null },
//             onboarding_call: user.onboarding_call ? {
//               scheduled_call: user.onboarding_call.scheduled_call,
//               completed_call: user.onboarding_call.completed_call,
//               appointment_time: user.onboarding_call.appointment_time // Include appointment_time
//             } : { scheduled_call: false, completed_call: false, appointment_time: null }
//           };
//         });
//         console.log('Processed users:', users);
//         setUsers(users);
//         setFilteredUsers(users.filter(user => user.account_status !== 'Unknown'));
//         updateCards(users.filter(user => user.account_status !== 'Unknown'));
//         const totalRevenue = calculateTotalRevenue(users);
//         const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, start, end);
//         setTotalRevenue(totalRevenue);
//         setAvgDailyMRR(avgDailyMRR);
//         setMrrTrajectory(mrrTrajectory);
//         const revenueTrendData = aggregateRevenueByDay(users);
//         console.log(revenueTrendData, 'revenue trend data');
//         setRevenueTrendData(revenueTrendData);
//       })
//       .catch(error => {
//         console.error('Error fetching users:', error);
//       });
//   };

//   const aggregateRevenueByDay = (users) => {
//     const aggregatedData = {};
//     users.forEach(user => {
//       const date = new Date(user.timestamp * 1000).toISOString().split('T')[0]; // Ensure correct date conversion
//       const { product_id } = user;
//       const { price } = getProductPriceAndStyle(product_id);
//       if (!aggregatedData[date]) {
//         aggregatedData[date] = 0;
//       }
//       aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
//     });
//     const result = Object.keys(aggregatedData)
//       .map(date => ({
//         date: new Date(date), // Ensure date is a JavaScript Date object
//         value: aggregatedData[date],
//       }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//     console.log('Aggregated Revenue Data:', result); // Debug the data
//     return result;
//   };

//   const revenueTrendData = aggregateRevenueByDay(users);

//   useEffect(() => {
//     console.log('Fetching data for date range:', startDate, endDate);
//     fetchData(startDate, endDate);
//   }, [startDate, endDate]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };



//   const formatDemoCompleted = (user) => {
//     const demoCall = user.demo_call;
//     if (!demoCall || demoCall.scheduled_call === false) {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     } else if (demoCall.completed_call === true) {
//       return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
//     } else if (demoCall.completed_call === 'unknown' || demoCall.completed_call === undefined) {
//       return (
//         <button
//           className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
//           onClick={() => openReportModal('Demo', user)}
//         >
//           Report
//         </button>
//       );
//     } else {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     }
//   };

//   const formatOnboardingCompleted = (user) => {
//     const onboardingCall = user.onboarding_call;
//     if (!onboardingCall || onboardingCall.scheduled_call === false) {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     } else if (onboardingCall.completed_call === true) {
//       return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
//     } else if (onboardingCall.completed_call === 'unknown' || onboardingCall.completed_call === undefined) {
//       return (
//         <button
//           className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
//           onClick={() => openReportModal('Onboarding', user)}
//         >
//           Report
//         </button>
//       );
//     } else {
//       return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
//     }
//   };
  


//   const calculateTotalRevenue = (users) => {
//     return users.reduce((sum, user) => {
//       const { product_id } = user;
//       const { price } = getProductPriceAndStyle(product_id);
//       return sum + parseFloat(price.replace('$', '').replace(',', ''));
//     }, 0);
//   };


//   const calculateMRR = (totalRevenue, startDate, endDate) => {
//     const workdays = calculateWorkdays(startDate, endDate);
//     const avgDailyMRR = workdays > 0 ? totalRevenue / workdays : 0;
//     const mrrTrajectory = avgDailyMRR * 22; // Assuming 22 workdays in a month
//     return { avgDailyMRR, mrrTrajectory };
//   };

//   const calculateWorkdays = (startDate, endDate) => {
//     let count = 0;
//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       const dayOfWeek = currentDate.getDay();
//       if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
//         count++;
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return count;
//   };

//   const parseRelativeTime = (relativeTime) => {
//     const now = new Date();
//     const timeParts = relativeTime.split(' ');
//     const value = parseInt(timeParts[0], 10);
//     const unit = timeParts[1];
//     if (isNaN(value)) {
//       return now; // Return current date if parsing fails
//     }
//     switch (unit) {
//       case 'seconds':
//       case 'second':
//         return new Date(now.getTime() - value * 1000);
//       case 'minutes':
//       case 'minute':
//         return new Date(now.getTime() - value * 60 * 1000);
//       case 'hours':
//       case 'hour':
//         return new Date(now.getTime() - value * 60 * 60 * 1000);
//       case 'days':
//       case 'day':
//         return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
//       case 'weeks':
//       case 'week':
//         return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
//       default:
//         return now; // Return current date if unit is unrecognized
//     }
//   };

//   const handleSort = (field) => {
//     console.log('Sorting by field:', field);
//     const newSortDirection = sortField === field ? sortDirection * -1 : -1;
//     setSortField(field);
//     setSortDirection(newSortDirection);
//     const sortedUsers = [...filteredUsers].sort((a, b) => {
//       let valA = parseFloat(a[field]);
//       let valB = parseFloat(b[field]);
//       if (isNaN(valA) || isNaN(valB)) {
//         return 0;
//       } else {
//         return (valA < valB ? -1 : 1) * newSortDirection;
//       }
//     });
//     console.log('Sorted users:', sortedUsers);
//     setFilteredUsers(sortedUsers);
//   };


//   const renderTable = () => {
//     if (!Array.isArray(filteredUsers)) {
//       console.error('Expected filteredUsers to be an array, but got:', filteredUsers);
//       return null;
//     }
  
//     return filteredUsers.map(user => {
//       const { price, style } = getProductPriceAndStyle(user.product_id);
//       const formattedDate = formatDate(user.timestamp);
  
//       console.log('User:', user.location_name, 'Timestamp:', user.timestamp, 'Formatted Date:', formattedDate);
  
//       return (
//         <TableRow key={user.location_id}>
//           <TableCell>
//             <div className="flex items-center">
//               <a href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`} className="text-indigo-600 hover:text-indigo-900 location-name">
//                 {user.location_name.replace("'s Account", '').replace('Account', '').trim().length > 15 ? `${user.location_name.replace("'s Account", '').replace('Account', '').trim().substring(0, 15)}...` : user.location_name.replace("'s Account", '').replace('Account', '').trim()}
//               </a>
//               <a href={user.contact_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                 </svg>
//               </a>
//             </div>
//             <div className="text-xs text-gray-500 flex items-center">
//               <div className={`flex-none rounded-full p-1 ${getStatusBgColor(user.account_status)}`}>
//                 <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
//               </div>
//               <time className="text-gray-400 sm:hidden" dateTime={user.timestamp}>{formattedDate}</time>
//               <div className="hidden sm:block ml-2">{formatAccountStatus(user.account_status)}</div>
//               <div className={`ml-2 px-2 py-1 rounded-md border ${style}`}>{price}</div>
//             </div>
//           </TableCell>
//           <TableCell>{formatHasDemoCallScheduled(user.demo_call)}</TableCell>
//           <TableCell>
//             {user.demo_call && user.demo_call.scheduled_call && user.demo_call.completed_call === 'unknown' ? (
//               <button onClick={() => openReportModal('Demo', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
//             ) : formatDemoCompleted(user)}
//           </TableCell>
//           <TableCell>{formatHasOnboardingCallScheduled(user.onboarding_call)}</TableCell>
//           <TableCell>
//             {user.onboarding_call && user.onboarding_call.scheduled_call && user.onboarding_call.completed_call === 'unknown' ? (
//               <button onClick={() => openReportModal('Onboarding', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
//             ) : formatOnboardingCompleted(user)}
//           </TableCell>
//           <TableCell><span className={`text-xs font-semibold ${user.mailgun_connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatMailgunConnected(user.mailgun_connected)}</span></TableCell>
//           <TableCell><span className={`text-xs font-semibold ${user.payment_processor_integration ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatPaymentProcessor(user.payment_processor_integration)}</span></TableCell>
//         </TableRow>
//       );
//     });
//   };

//   const getStatusBgColor = (status) => {
//     if (!status) return 'bg-gray-400/10 text-gray-400';
//     switch (status.toLowerCase()) {
//       case 'active':
//         return 'bg-green-400/10 text-green-400';
//       case 'canceled':
//         return 'bg-red-400/10 text-red-400';
//       case 'past_due':
//         return 'bg-yellow-400/10 text-yellow-400';
//       case 'trialing':
//         return 'bg-blue-400/10 text-blue-400';
//       default:
//         return 'bg-gray-400/10 text-gray-400';
//     }
//   };

//   const updateCards = (filteredUsers) => {
//     console.log('Updating cards with filtered users:', filteredUsers);
//     const filteredWithoutUnknown = filteredUsers.filter(user => user.account_status !== 'Unknown');
//     const totalUsers = filteredWithoutUnknown.length;
//     const mailgunConnectedCount = filteredWithoutUnknown.filter(user => user.mailgun_connected).length;
//     const firstTransactionCount = filteredWithoutUnknown.filter(user => user.has_had_first_transaction).length;
//     const paymentProcessorCount = filteredWithoutUnknown.filter(user => user.payment_processor_integration).length;
//     const demoCallCount = filteredWithoutUnknown.filter(user => user.demo_call.scheduled_call).length;
//     const onboardingCallCount = filteredWithoutUnknown.filter(user => user.onboarding_call.scheduled_call).length;
//     const mailgunPercentage = totalUsers ? (mailgunConnectedCount / totalUsers * 100).toFixed(2) : 0;
//     const transactionPercentage = totalUsers ? (firstTransactionCount / totalUsers * 100).toFixed(2) : 0;
//     const paymentProcessorPercentage = totalUsers ? (paymentProcessorCount / totalUsers * 100).toFixed(2) : 0;
//     const demoCallPercentage = totalUsers ? (demoCallCount / totalUsers * 100).toFixed(2) : 0;
//     const onboardingCallPercentage = totalUsers ? (onboardingCallCount / totalUsers * 100).toFixed(2) : 0;
//     const profitableUsers = filteredWithoutUnknown.filter(user => user.has_had_first_transaction && user.time_to_become_profitable);
//     const totalProfitableTime = profitableUsers.reduce((sum, user) => sum + user.time_to_become_profitable, 0);
//     const averageTimeToRevenue = totalProfitableTime ? (totalProfitableTime / profitableUsers.length) / (1000 * 60 * 60 * 24) : 0;
//     const activeCount = filteredWithoutUnknown.filter(user => user.account_status === 'active').length;
//     const canceledCount = filteredWithoutUnknown.filter(user => user.account_status === 'canceled').length;
//     const pastDueCount = filteredWithoutUnknown.filter(user => user.account_status === 'past_due').length;
//     const trialingCount = filteredWithoutUnknown.filter(user => user.account_status === 'trialing').length;
//     const activePercentage = totalUsers ? (activeCount / totalUsers * 100).toFixed(2) : 0;
//     const canceledPercentage = totalUsers ? (canceledCount / totalUsers * 100).toFixed(2) : 0;
//     const pastDuePercentage = totalUsers ? (pastDueCount / totalUsers * 100).toFixed(2) : 0;
//     const trialingPercentage = totalUsers ? (trialingCount / totalUsers * 100).toFixed(2) : 0;
//     const [activeTab, setActiveTab] = useState('Home'); // State to manage active tab
// setStats({
//   mailgunPercentage: `${mailgunPercentage}%`,
//   mailgunCount: `${mailgunConnectedCount} of ${totalUsers}`,
//   transactionPercentage: `${transactionPercentage}%`,
//   transactionCount: `${firstTransactionCount} of ${totalUsers}`,
//   paymentProcessorPercentage: `${paymentProcessorPercentage}%`,
//   paymentProcessorCount: `${paymentProcessorCount} of ${totalUsers}`,
//   averageTimeToRevenue: `${averageTimeToRevenue.toFixed(2)} days`,
//   activePercentage: `${activePercentage}%`,
//   activeCount: `${activeCount} of ${totalUsers}`,
//   canceledPercentage: `${canceledPercentage}%`,
//   canceledCount: `${canceledCount} of ${totalUsers}`,
//   pastDuePercentage: `${pastDuePercentage}%`,
//   pastDueCount: `${pastDueCount} of ${totalUsers}`,
//   trialingPercentage: `${trialingPercentage}%`,
//   trialingCount: `${trialingCount} of ${totalUsers}`,
//   demoCallPercentage: `${demoCallPercentage}%`,
//   demoCallCount: `${demoCallCount} of ${totalUsers}`,
//   onboardingCallPercentage: `${onboardingCallPercentage}%`,
//   onboardingCallCount: `${onboardingCallCount} of ${totalUsers}`,
// });
// };
   

// const aggregateCumulativeRevenueByDay = (users) => {
//   const aggregatedData = {};
//   let cumulativeRevenue = 0;
  
//   users.forEach(user => {
//     const date = new Date(user.timestamp * 1000).toISOString().split('T')[0];
//     const { product_id } = user;
//     const { price } = getProductPriceAndStyle(product_id);
//     if (!aggregatedData[date]) {
//       aggregatedData[date] = 0;
//     }
//     aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
//   });

//   const result = Object.keys(aggregatedData)
//     .sort((a, b) => new Date(a) - new Date(b))
//     .map(date => {
//       cumulativeRevenue += aggregatedData[date];
//       return {
//         date: new Date(date), // Ensure date is a JavaScript Date object
//         value: cumulativeRevenue,
//       };
//     });

//   console.log('Cumulative Revenue Data:', result); // Debug the data
//   return result;
// };

    
//       const StatCard = ({ title, value, subtitle, trendData, showGraph, isPercentage }) => {
//         const statusClasses = {
//           'Active': 'bg-green-600',
//           'Canceled': 'bg-red-600',
//           'Past Due': 'bg-yellow-600',
//           'Trialing': 'bg-blue-600',
//           'Unknown': 'bg-gray-600'
//         };
//         const formattedTitle = statusClasses[title] ? (
//           <div className="flex items-center">
//             <span className={`inline-block w-2 h-2 mr-2 rounded-full ${statusClasses[title]}`}></span>
//             <span>{title}</span>
//           </div>
//         ) : (
//           title
//         );
//         const textColor = (title === 'MailGun Connected' || title === 'Payment Processor Connected') ? 'text-green-600' : 'text-gray-900';
//         return (
//           <div className="flex flex-col bg-white p-4 shadow rounded-md">
//             <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{formattedTitle}</dt>
//             <dd className={`text-2xl font-bold tracking-tight ${textColor} mt-1 text-left`}>{value}</dd>
//             {subtitle && <dd className="text-xs text-gray-600 mt-0 text-left">{subtitle}</dd>}
//             {showGraph && (
//               <div className="flex-grow w-full">
//                 <TrendGraph data={trendData} isPercentage={isPercentage} />
//               </div>
//             )}
//           </div>
//         );
//       };
    
//       const TrendGraph = ({ data, isPercentage }) => (
//         <ResponsiveContainer width="100%" height={100}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="date"
//               tickFormatter={(tick) => formatDate(tick)}
//               ticks={[data[0]?.date, data[data.length - 1]?.date]}
//             />
//             <YAxis
//               tickFormatter={(tick) => isPercentage ? `${Math.round(tick)}%` : formatCurrency(tick)}
//               tick={{ fontSize: 10 }} // Make the numbers smaller
//             />
//             <Tooltip
//               formatter={(value) => isPercentage ? `${Math.round(value)}%` : formatCurrency(value)}
//               labelFormatter={(label) => formatDate(label)}
//             />
//             <Line type="monotone" dataKey="value" stroke="#0072c6" dot={false} />
//           </LineChart>
//         </ResponsiveContainer>
//       );
    
//       const formatDate = (date) => {
//         if (!(date instanceof Date)) {
//           date = new Date(date); // Ensure date is a JavaScript Date object
//         }
//         return date.toLocaleDateString('default', { month: 'short', day: 'numeric' }); // Use toLocaleDateString for consistent formatting
//       };

// // Ensure formatCurrency function is defined
// const formatCurrency = (value) => {
//   if (value >= 1000) {
//     return `$${(value / 1000).toFixed(1)}K`;
//   }
//   return `$${value.toLocaleString()}`;
// };
    
//       const formatStatus = (status) => {
//         const statusClasses = {
//           'active': 'text-green-600 bg-green-100',
//           'canceled': 'text-red-600 bg-red-100',
//           'past_due': 'text-yellow-600 bg-yellow-100',
//           'trialing': 'text-purple-600 bg-blue-100',
//           'unknown': 'text-gray-600 bg-gray-100'
//         };
//         return <span className={`text-xs font-semibold ${statusClasses[status.toLowerCase()] || 'text-gray-600 bg-gray-100'} rounded-full`}>{formatAccountStatus(status)}</span>;
//       };
    
//       const handleRangeChange = (range) => {
//         setSelectedRange(range);
//         const today = new Date();
//         let start, end;
//         switch (range) {
//           case '1W':
//             start = new Date(today);
//             start.setDate(today.getDate() - 7);
//             end = new Date();
//             break;
//           case '4W':
//             start = new Date(today);
//             start.setDate(today.getDate() - 28);
//             end = new Date();
//             break;
//           case '3M':
//             start = new Date(today);
//             start.setMonth(today.getMonth() - 3);
//             end = new Date();
//             break;
//           case '1Y':
//             start = new Date(today);
//             start.setFullYear(today.getFullYear() - 1);
//             end = new Date();
//             break;
//           case 'MTD':
//             start = new Date(today.getFullYear(), today.getMonth(), 1);
//             end = new Date();
//             break;
//           case 'QTD':
//             start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
//             end = new Date();
//             break;
//           case 'YTD':
//             start = new Date(today.getFullYear(), 0, 1);
//             end = new Date();
//             break;
//           case 'ALL':
//             start = new Date(2000, 0, 1); // Arbitrary old date
//             end = new Date();
//             break;
//           default:
//             start = end = new Date();
//         }
      
//         console.log('Selected Range:', range);
//         console.log('Start Date:', start);
//         console.log('End Date:', end);
      
//         setStartDate(start);
//         setEndDate(end);
//         fetchData(start, end);
//       };
    
//       const DateRangeSelector = () => (
//         <div className="flex space-x-1">
//           {['1W', '4W', '3M', '1Y', 'MTD', 'QTD', 'YTD', 'ALL'].map(range => (
//             <button
//               key={range}
//               onClick={() => handleRangeChange(range)}
//               className={`text-sm font-semibold px-2 py-1 rounded-md ${selectedRange === range ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
//             >
//               {range}
//             </button>
//           ))}
//         </div>
//       );
    
//       const handleFilterChange = (filters) => {
//         setFilterState(filters);
//         const filteredUsers = users.filter(user => {
//           const statusMatch = filters.status.includes(user.account_status);
//           const planMatch = filters.plan === 'all' ||
//             (filters.plan === 'platinum' && ['prod_NC25k0PnePTpDK', 'prod_PuhtpFfKP74tSq'].includes(user.product_id)) ||
//             (filters.plan === 'prod_PpFXqy79vlGOIE' && ['prod_PpFXqy79vlGOIE', 'prod_PdPwwouLLJod3b', 'prod_M6IyZeJydN4vMn'].includes(user.product_id)) ||
//             (filters.plan === 'prod_OvDkzhKINbc38T' && ['prod_OvDkzhKINbc38T', 'prod_M6IyfUy0ONYSIw'].includes(user.product_id)) ||
//             filters.plan === user.product_id;
      
//           return (filters.calendar === 'all' || (filters.calendar === 'true' && user.total_calendars > 0) || (filters.calendar === 'false' && user.total_calendars === 0)) &&
//             (filters.product === 'all' || (filters.product === 'true' && user.total_products > 0) || (filters.product === 'false' && user.total_products === 0)) &&
//             (filters.firstTransaction === 'all' || (filters.firstTransaction === 'true' && user.has_had_first_transaction) || (filters.firstTransaction === 'false' && !user.has_had_first_transaction)) &&
//             (filters.mailgun === 'all' || (filters.mailgun === 'true' && user.mailgun_connected) || (filters.mailgun === 'false' && !user.mailgun_connected)) &&
//             (filters.paymentProcessor === 'all' || (filters.paymentProcessor === 'True' && user.payment_processor_integration) || (filters.paymentProcessor === 'False' && !user.payment_processor_integration)) &&
//             (filters.demoScheduled === 'all' ||
//               (filters.demoScheduled === 'true' && user.demo_call?.scheduled_call) ||
//               (filters.demoScheduled === 'false' && (!user.demo_call || !user.demo_call.scheduled_call))) &&
//             (filters.onboardingScheduled === 'all' ||
//               (filters.onboardingScheduled === 'true' && user.onboarding_call?.scheduled_call) ||
//               (filters.onboardingScheduled === 'false' && (!user.onboarding_call || !user.onboarding_call.scheduled_call))) &&
//             (filters.demoCompleted === 'all' ||
//               (filters.demoCompleted === 'true' && user.demo_call?.completed_call === true) ||
//               (filters.demoCompleted === 'false' && user.demo_call?.completed_call === false)) &&
//             (filters.onboardingCompleted === 'all' ||
//               (filters.onboardingCompleted === 'true' && user.onboarding_call?.completed_call === true) ||
//               (filters.onboardingCompleted === 'false' && user.onboarding_call?.completed_call === false)) &&
//             planMatch &&
//             statusMatch;
//         });
      
//         setFilteredUsers(filteredUsers);
//         updateCards(filteredUsers);
      
//         // Recalculate Total Revenue, Daily MRR, and MRR Trajectory
//         const totalRevenue = calculateTotalRevenue(filteredUsers);
//         const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, startDate, endDate);
//         setTotalRevenue(totalRevenue);
//         setAvgDailyMRR(avgDailyMRR);
//         setMrrTrajectory(mrrTrajectory);
//       };
    





//       return (
//         <>
//           <div className="py-12 sm:py-16 bg-white">
//             <div className="mx-auto max-w-7xl px-4 lg:px-6">
//               <div className="text-left">
//                 <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">User Data</Heading>
//                 <p className="mt-4 text-lg leading-8 text-gray-600">Overview of user data based on the selected date range.</p>
//                 <hr className="mt-4 mb-8 border-t border-gray-300" />
//               </div>
//               <div className="flex space-x-4 mb-4">
//                 {['Home', 'Sales', 'Customer Support'].map(tab => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`text-sm font-semibold px-4 py-2 rounded-md ${activeTab === tab ? 'bg-black text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
//                   >
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//               <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
//                 <div className="flex flex-col sm:flex-row sm:flex-grow sm:space-x-4">
//                   <div className="hidden sm:block">
//                     <SalesDatePicker
//                       startDate={startDate}
//                       setStartDate={setStartDate}
//                       endDate={endDate}
//                       setEndDate={setEndDate}
//                       fetchSalesData={fetchData}
//                     />
//                   </div>
//                 </div>
//                 <Button className="hidden sm:block sm:ml-auto" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
//                 <div className="block sm:hidden w-full">
//                   <Button className="mt-4 w-full" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
//                   <SalesDatePicker
//                     startDate={startDate}
//                     setStartDate={setStartDate}
//                     endDate={endDate}
//                     setEndDate={setEndDate}
//                     fetchSalesData={fetchData}
//                   />
//                 </div>
//               </div>
//               <dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
//                 {activeTab === 'Home' && (
//                   <>
//                     <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} showGraph={true} isPercentage={true} />
//                     <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} showGraph={true} isPercentage={true} />
//                     <CombinedStatusCard stats={stats} />
//                     <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle={`Sum of all revenue`} trendData={aggregateCumulativeRevenueByDay(filteredUsers)} showGraph={true} isPercentage={false} />
//                     <StatCard title="Daily MRR" value={formatCurrency(avgDailyMRR)} subtitle={`Average Daily increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
//                     <StatCard title="MRR Trajectory" value={formatCurrency(mrrTrajectory)} subtitle={`Projected monthly increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
//                     <StatCard title="Demo Call Scheduled" value={stats.demoCallPercentage} subtitle={stats.demoCallCount} trendData={aggregateDataByDay(filteredUsers, 'demo_call')} showGraph={true} isPercentage={true} />
//                     <StatCard title="Onboarding Call Scheduled" value={stats.onboardingCallPercentage} subtitle={stats.onboardingCallCount} trendData={aggregateDataByDay(filteredUsers, 'onboarding_call')} showGraph={true} isPercentage={true} />
//                     <LeviCommissionCard users={filteredUsers} /> {/* New stat card */}
//                   </>
//                 )}
//                 {activeTab === 'Sales' && (
//                   <>
//                     <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle={`Sum of all revenue`} trendData={aggregateCumulativeRevenueByDay(filteredUsers)} showGraph={true} isPercentage={false} />
//                     <StatCard title="Daily MRR" value={formatCurrency(avgDailyMRR)} subtitle={`Average Daily increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
//                     <StatCard title="MRR Trajectory" value={formatCurrency(mrrTrajectory)} subtitle={`Projected monthly increase`} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
//                     <StatCard title="Demo Call Scheduled" value={stats.demoCallPercentage} subtitle={stats.demoCallCount} trendData={aggregateDataByDay(filteredUsers, 'demo_call')} showGraph={true} isPercentage={true} />
//                     <StatCard title="Onboarding Call Scheduled" value={stats.onboardingCallPercentage} subtitle={stats.onboardingCallCount} trendData={aggregateDataByDay(filteredUsers, 'onboarding_call')} showGraph={true} isPercentage={true} />
//                     <LeviCommissionCard users={filteredUsers} /> {/* New stat card */}
//                   </>
//                 )}
//                 {activeTab === 'Customer Support' && (
//                   <>
//                     <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} showGraph={true} isPercentage={true} />
//                     <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} showGraph={true} isPercentage={true} />
//                   </>
//                 )}
//               </dl>
//             </div>
//           </div>
//           <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 bg-white-100">
//             <div className="mx-auto max-w-7xl bg-white-100">
//               <Table className="table-auto w-full bg-white-100">
//                 <CallReportingModal
//                   isOpen={isModalOpen}
//                   onClose={closeReportModal}
//                   callType={modalCallType}
//                   user={modalUser}
//                 />
//                 <TableHead>
//                   <TableRow>
//                     <TableHeader>Location Name</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('demo_call')}>Demo<br />Scheduled</TableHeader>
//                     <TableHeader>Demo<br />Completed</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('onboarding_call')}>Onboarding<br />Scheduled</TableHeader>
//                     <TableHeader>Onboarding<br />Completed</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('mailgun_connected')}>Mailgun</TableHeader>
//                     <TableHeader className="cursor-pointer" onClick={() => handleSort('payment_processor_integration')}>Pay<br />Int</TableHeader>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {renderTable()}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//           {isFilterPanelOpen && (
//             <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-end">
//               <div className="bg-white w-64 p-4 shadow-lg">
//                 <button onClick={() => setIsFilterPanelOpen(false)} className="mb-4">Close</button>
//                 <Filters
//                   onFilterChange={handleFilterChange}
//                   users={users}
//                   filterState={filterState}
//                   setIsFilterPanelOpen={setIsFilterPanelOpen}
//                 />
//               </div>
//             </div>
//           )}
//           <style jsx>{`
//             th, td {
//               padding: 0.5rem 0.75rem; /* Adjust padding to make columns less spaced apart */
//             }
//             th {
//               font-size: 0.5rem; /* Smaller text for table headers */
//               white-space: normal; /* Allow text to wrap onto two lines */
//             }
//             .location-name {
//               font-size: 0.875rem; /* Smaller text for location name */
//             }
//             .status-dot {
//               display: inline-block;
//               width: 0.5rem;
//               height: 0.5rem;
//               border-radius: 50%;
//               margin-right: 0.5rem;
//             }
//             .text-green-600 {
//               color: #16a34a;
//             }
//             .text-yellow-700 {
//               font-size: 0.875rem; /* Ensure the same size as "Yes" and "No" */
//             }
//             .bg-yellow-100 {
//               background-color: #fef3c7;
//             }
//             .border-yellow-700 {
//               border-color: #d97706;
//             }
//             @media (max-width: 640px) {
//               .flex-col {
//                 flex-direction: column;
//               }
//               .table-auto {
//                 display: block;
//                 overflow-x: auto;
//                 white-space: nowrap;
//               }
//               .table-auto th, .table-auto td {
//                 display: inline-block;
//                 width: auto;
//               }
//               th, td {
//                 font-size: 0.75rem; /* Smaller text for table data */
//               }
//               .hidden {
//                 display: none;
//               }
//             }
//             button {
//               position: relative;
//               z-index: 10; /* Ensure the button is on top */
//             }
//           `}</style>
//         </>
//       );
//     }


// // // seperated code
// //   'use client'
// //   import CombinedStatusCard from './CombinedStatusCard'
  
// //   import React, { useState, useEffect } from 'react';
// //   import SalesDatePicker from './SalesDatePicker';
// //   import { Button } from '@/components/button';
// //   import { Heading } from '@/components/heading';
// //   import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
// //   import axios from 'axios';
// //   import { formatIncome, formatFirstTransaction, formatMailgunConnected, formatPaymentProcessor, formatAccountStatus, formatHasDemoCallScheduled, formatHasOnboardingCallScheduled, formatDate} from './utils';
// //   import { Filters } from './Filters'; // Assuming Filters component is available
// //   import CallReportingModal from './CallReportingModal'; // Import the modal component
// //   import TotalRevenueCard from './TotalRevenueCard';
// //   import DailyMRRCard from './DailyMRRCard';
// //   import MRRTrajectoryCard from './MRRTrajectoryCard';
// //   import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// //   export default function Home() {
// //     const [startDate, setStartDate] = useState(() => {
// //       const date = new Date();
// //       date.setDate(date.getDate() - 7);
// //       return date;
// //     });
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [endDate, setEndDate] = useState(new Date());
// //     const [users, setUsers] = useState([]);
// //     const [filteredUsers, setFilteredUsers] = useState([]);
// //     const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
// //     const [sortField, setSortField] = useState(null);
// //     const [sortDirection, setSortDirection] = useState(1);
// //     const [stats, setStats] = useState({
// //       mailgunPercentage: '0%',
// //       mailgunCount: '0 of 0',
// //       transactionPercentage: '0%',
// //       transactionCount: '0 of 0',
// //       paymentProcessorPercentage: '0%',
// //       paymentProcessorCount: '0 of 0',
// //       averageTimeToRevenue: '0 days',
// //       activePercentage: '0%',
// //       activeCount: '0 of 0',
// //       canceledPercentage: '0%',
// //       canceledCount: '0 of 0',
// //       pastDuePercentage: '0%',
// //       pastDueCount: '0 of 0',
// //       trialingPercentage: '0%',
// //       trialingCount: '0 of 0',
// //       demoCallPercentage: '0%',
// //       demoCallCount: '0 of 0',
// //       onboardingCallPercentage: '0%',
// //       onboardingCallCount: '0 of 0',
// //     });
// //     const [totalRevenue, setTotalRevenue] = useState(0);
// //     const [modalCallType, setModalCallType] = useState('');
// //     const [avgDailyMRR, setAvgDailyMRR] = useState(0);
// //     const [mrrTrajectory, setMrrTrajectory] = useState(0);
// //     const [revenueTrendData, setRevenueTrendData] = useState([]);
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const [selectedRange, setSelectedRange] = useState('1W');
// //       // const [isModalOpen, setIsModalOpen] = useState(false);
// //   //   const [modalCallType, setModalCallType] = useState('');
// //     const [modalUser, setModalUser] = useState(null);
// //   //   const [revenueTrendData, setRevenueTrendData] = useState([]);
// //   //   const [endDate, setEndDate] = useState(new Date());
// //   //   const [users, setUsers] = useState([]);
// //   //   const [filteredUsers, setFilteredUsers] = useState([]);
// //   //   const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
// //   //   const [sortField, setSortField] = useState(null);
// //   //   const [sortDirection, setSortDirection] = useState(1);
// //     const [filterState, setFilterState] = useState({
// //       calendar: 'all',
// //       product: 'all',
// //       firstTransaction: 'all',
// //       mailgun: 'all',
// //       paymentProcessor: 'all',
// //       demoScheduled: 'all',
// //       onboardingScheduled: 'all',
// //       demoCompleted: 'all',
// //       onboardingCompleted: 'all',
// //       plan: 'all',
// //       status: ['active', 'trialing', 'past_due', 'canceled']
// //     });
  
// //     useEffect(() => {
// //       console.log('Fetching data for date range:', startDate, endDate);
// //       fetchData(startDate, endDate);
// //     }, [startDate, endDate]);
// //     const closeReportModal = () => {
// //       setIsModalOpen(false);
// //       setModalCallType('');
// //       setModalUser(null);
// //     };
// //     const fetchData = (start, end) => {
// //       axios.post('https://rozduvvh2or5rxgucec3rfdp5e0hupbk.lambda-url.us-west-2.on.aws/', {
// //         startDate: start.toISOString().split('T')[0],
// //         endDate: end.toISOString().split('T')[0]
// //       }, {
// //         headers: {
// //           'Content-Type': 'application/json'
// //         }
// //       })
// //       .then(response => {
// //         if (!Array.isArray(response.data)) {
// //           console.error('Expected response data to be an array, but got:', response.data);
// //           return;
// //         }
// //         const users = response.data.map(user => {
// //           const hasIncome = parseFloat(user.income_all_time) > 0 || parseFloat(user.income_7_days) > 0 || parseFloat(user.income_30_days) > 0 || parseFloat(user.income_90_days) > 0;
// //           return {
// //             ...user,
// //             mailgun_connected: user.mailgun_connected === "true" || user.mailgun_connected === true,
// //             has_had_first_transaction: hasIncome || user.has_had_first_transaction === "true" || user.has_had_first_transaction === true,
// //             payment_processor_integration: user.payment_processor_integration === "True" || user.payment_processor_integration === true,
// //             relative_created_time: user.relative_created_time ? parseRelativeTime(user.relative_created_time) : new Date(),
// //             demo_call: user.demo_call ? {
// //               scheduled_call: user.demo_call.scheduled_call,
// //               completed_call: user.demo_call.completed_call,
// //               appointment_time: user.demo_call.appointment_time
// //             } : { scheduled_call: false, completed_call: false, appointment_time: null },
// //             onboarding_call: user.onboarding_call ? {
// //               scheduled_call: user.onboarding_call.scheduled_call,
// //               completed_call: user.onboarding_call.completed_call,
// //               appointment_time: user.onboarding_call.appointment_time
// //             } : { scheduled_call: false, completed_call: false, appointment_time: null }
// //           };
// //         });
    
// //         setUsers(users);
// //         setFilteredUsers(users.filter(user => user.account_status !== 'Unknown'));
// //         updateCards(users.filter(user => user.account_status !== 'Unknown'));
// //         const totalRevenue = calculateTotalRevenue(users);
// //         const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, start, end);
// //         setTotalRevenue(totalRevenue);
// //         setAvgDailyMRR(avgDailyMRR);
// //         setMrrTrajectory(mrrTrajectory);
// //         const dailyMRRTrendData = aggregateDailyMRR(users); // Calculate daily MRR trend data
// //         setRevenueTrendData(dailyMRRTrendData);
// //       })
// //       .catch(error => {
// //         console.error('Error fetching users:', error);
// //       });
// //     };
  
  
// //     const calculateTotalRevenue = (users) => {
// //       return users.reduce((sum, user) => {
// //         const { product_id } = user;
// //         const { price } = getProductPriceAndStyle(product_id);
// //         return sum + parseFloat(price.replace('$', '').replace(',', ''));
// //       }, 0);
// //     };
  
// //     const calculateMRR = (totalRevenue, startDate, endDate) => {
// //       const workdays = calculateWorkdays(startDate, endDate);
// //       const avgDailyMRR = workdays > 0 ? totalRevenue / workdays : 0;
// //       const mrrTrajectory = avgDailyMRR * 22;
// //       return { avgDailyMRR, mrrTrajectory };
// //     };
  
// //     const calculateWorkdays = (startDate, endDate) => {
// //       let count = 0;
// //       const currentDate = new Date(startDate);
// //       while (currentDate <= endDate) {
// //         const dayOfWeek = currentDate.getDay();
// //         if (dayOfWeek !== 0 && dayOfWeek !== 6) {
// //           count++;
// //         }
// //         currentDate.setDate(currentDate.getDate() + 1);
// //       }
// //       return count;
// //     };
  
  
    
// //     const parseRelativeTime = (relativeTime) => {
// //       const now = new Date();
// //       const timeParts = relativeTime.split(' ');
// //       const value = parseInt(timeParts[0], 10);
// //       const unit = timeParts[1];
// //       if (isNaN(value)) {
// //         return now;
// //       }
// //       switch (unit) {
// //         case 'seconds':
// //         case 'second':
// //           return new Date(now.getTime() - value * 1000);
// //         case 'minutes':
// //         case 'minute':
// //           return new Date(now.getTime() - value * 60 * 1000);
// //         case 'hours':
// //         case 'hour':
// //           return new Date(now.getTime() - value * 60 * 60 * 1000);
// //         case 'days':
// //         case 'day':
// //           return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
// //         case 'weeks':
// //         case 'week':
// //           return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
// //         default:
// //           return now;
// //       }
// //     };
  
// //     const handleSort = (field) => {
// //       console.log('Sorting by field:', field);
// //       const newSortDirection = sortField === field ? sortDirection * -1 : -1;
// //       setSortField(field);
// //       setSortDirection(newSortDirection);
// //       const sortedUsers = [...filteredUsers].sort((a, b) => {
// //         let valA = parseFloat(a[field]);
// //         let valB = parseFloat(b[field]);
// //         if (isNaN(valA) || isNaN(valB)) {
// //           return 0;
// //         } else {
// //           return (valA < valB ? -1 : 1) * newSortDirection;
// //         }
// //       });
// //       console.log('Sorted users:', sortedUsers);
// //       setFilteredUsers(sortedUsers);
// //     };
// //     const StatCard = ({ title, value, subtitle, trendData, showGraph, isPercentage }) => {
// //       const statusClasses = {
// //         'Active': 'bg-green-600',
// //         'Canceled': 'bg-red-600',
// //         'Past Due': 'bg-yellow-600',
// //         'Trialing': 'bg-blue-600',
// //         'Unknown': 'bg-gray-600'
// //       };
// //       const formattedTitle = statusClasses[title] ? (
// //         <div className="flex items-center">
// //           <span className={`inline-block w-2 h-2 mr-2 rounded-full ${statusClasses[title]}`}></span>
// //           <span>{title}</span>
// //         </div>
// //       ) : (
// //         title
// //       );
// //       const textColor = (title === 'MailGun Connected' || title === 'Payment Processor Connected') ? 'text-green-600' : 'text-gray-900';
// //       return (
// //         <div className="flex flex-col bg-white p-4 shadow rounded-md">
// //           <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{formattedTitle}</dt>
// //           <dd className={`text-2xl font-bold tracking-tight ${textColor} mt-1 text-left`}>{value}</dd>
// //           {subtitle && <dd className="text-xs text-gray-600 mt-0 text-left">{subtitle}</dd>}
// //           {showGraph && (
// //             <div className="flex-grow w-full">
// //               <TrendGraph data={trendData} isPercentage={isPercentage} />
// //             </div>
// //           )}
// //         </div>
// //       );
// //     };
// //     const aggregateDailyMRR = (users) => {
// //       const aggregatedData = {};
// //       users.forEach(user => {
// //         const date = new Date(user.timestamp * 1000).toISOString().split('T')[0];
// //         if (!aggregatedData[date]) {
// //           aggregatedData[date] = 0;
// //         }
// //         if (user.income_30_days) { // Assuming income_30_days represents daily MRR
// //           aggregatedData[date] += parseFloat(user.income_30_days);
// //         }
// //       });
    
// //       const result = Object.keys(aggregatedData)
// //         .sort((a, b) => new Date(a) - new Date(b))
// //         .map(date => ({
// //           date: new Date(date),
// //           value: aggregatedData[date],
// //         }));
    
// //       console.log('Aggregated Daily MRR Data:', result);
// //       return result;
// //     };
// //     const formatDemoCompleted = (user) => {
// //       const demoCall = user.demo_call;
// //       if (!demoCall || demoCall.scheduled_call === false) {
// //         return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
// //       } else if (demoCall.completed_call === true) {
// //         return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
// //       } else if (demoCall.completed_call === 'unknown' || demoCall.completed_call === undefined) {
// //         return (
// //           <button
// //             className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
// //             onClick={() => openReportModal('Demo', user)}
// //           >
// //             Report
// //           </button>
// //         );
// //       } else {
// //         return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
// //       }
// //     };
  
// //   const formatOnboardingCompleted = (user) => {
// //       const onboardingCall = user.onboarding_call;
// //       if (!onboardingCall || onboardingCall.scheduled_call === false) {
// //         return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
// //       } else if (onboardingCall.completed_call === true) {
// //         return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
// //       } else if (onboardingCall.completed_call === 'unknown' || onboardingCall.completed_call === undefined) {
// //         return (
// //           <button
// //             className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
// //             onClick={() => openReportModal('Onboarding', user)}
// //           >
// //             Report
// //           </button>
// //         );
// //       } else {
// //         return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
// //       }
// //     };
// //     const openReportModal = (callType, user) => {
// //       setModalCallType(callType);
// //       setModalUser(user);
// //       setIsModalOpen(true);
// //       console.log(modalUser,'user here here')
// //       console.log(callType)
// //     };
// //     const TrendGraph = ({ data, isPercentage }) => (
// //       <ResponsiveContainer width="100%" height={100}>
// //         <LineChart data={data}>
// //           <CartesianGrid strokeDasharray="3 3" />
// //           <XAxis
// //             dataKey="date"
// //             tickFormatter={(tick) => formatDate(tick)}
// //             ticks={[data[0]?.date, data[data.length - 1]?.date]}
// //           />
// //           <YAxis
// //             tickFormatter={(tick) => isPercentage ? `${Math.round(tick)}%` : formatCurrency(tick)}
// //             tick={{ fontSize: 10 }} // Make the numbers smaller
// //           />
// //           <Tooltip
// //             formatter={(value) => isPercentage ? `${Math.round(value)}%` : formatCurrency(value)}
// //             labelFormatter={(label) => formatDate(label)}
// //           />
// //           <Line type="monotone" dataKey="value" stroke="#0072c6" dot={false} />
// //         </LineChart>
// //       </ResponsiveContainer>
// //     );
// //     const getProductPriceAndStyle = (productId) => {
// //       switch (productId) {
// //         case 'prod_NC25k0PnePTpDK':
// //         case 'prod_PuhtpFfKP74tSq':
// //           return { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' };
// //         case 'prod_PpFYdvqmj38F2I':
// //           return { price: '$297', style: 'bg-yellow-200 border-yellow-400 text-yellow-800' };
// //         case 'prod_PpFXqy79vlGOIE':
// //         case 'prod_PdPwwouLLJod3b':
// //         case 'prod_M6IyZeJydN4vMn':
// //           return { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' };
// //   case 'prod_OvDkzhKINbc38T':
// //     case 'prod_M6IyfUy0ONYSIw':
// //       return { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' };
// //     default:
// //     case 'prod_M6Iy3zjRHbDmm8':
// //       console.log(productId, 'productid');
// //       return { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' };
// //   }
// //   };
  
// //   const renderTable = () => {
// //   if (!Array.isArray(filteredUsers)) {
// //     console.error('Expected filteredUsers to be an array, but got:', filteredUsers);
// //     return null;
// //   }
// //   return filteredUsers.map(user => {
// //     const { price, style } = getProductPriceAndStyle(user.product_id);
// //     const formattedDate = formatDate(user.timestamp);
// //     console.log('User:', user.location_name, 'Timestamp:', user.timestamp, 'Formatted Date:', formattedDate);
// //     return (
// //       <TableRow key={user.location_id}>
// //         <TableCell>
// //           <div className="flex items-center">
// //             <a href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`} className="text-indigo-600 hover:text-indigo-900 location-name">
// //               {user.location_name.replace("'s Account", '').replace('Account', '').trim().length > 15 ? `${user.location_name.replace("'s Account", '').replace('Account', '').trim().substring(0, 15)}...` : user.location_name.replace("'s Account", '').replace('Account', '').trim()}
// //             </a>
// //             <a href={user.contact_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-500 hover:text-gray-700">
// //               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
// //                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
// //               </svg>
// //             </a>
// //           </div>
// //           <div className="text-xs text-gray-500 flex items-center">
// //             <div className={`flex-none rounded-full p-1 ${getStatusBgColor(user.account_status)}`}>
// //               <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
// //             </div>
// //             <time className="text-gray-400 sm:hidden" dateTime={user.timestamp}>{formattedDate}</time>
// //             <div className="hidden sm:block ml-2">{formatAccountStatus(user.account_status)}</div>
// //             <div className={`ml-2 px-2 py-1 rounded-md border ${style}`}>{price}</div>
// //           </div>
// //         </TableCell>
// //         <TableCell>{formatHasDemoCallScheduled(user.demo_call)}</TableCell>
// //         <TableCell>
// //           {user.demo_call && user.demo_call.scheduled_call && user.demo_call.completed_call === 'unknown' ? (
// //             <button onClick={() => openReportModal('Demo', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
// //           ) : formatDemoCompleted(user)}
// //         </TableCell>
// //         <TableCell>{formatHasOnboardingCallScheduled(user.onboarding_call)}</TableCell>
// //         <TableCell>
// //           {user.onboarding_call && user.onboarding_call.scheduled_call && user.onboarding_call.completed_call === 'unknown' ? (
// //             <button onClick={() => openReportModal('Onboarding', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
// //           ) : formatOnboardingCompleted(user)}
// //         </TableCell>
// //         <TableCell><span className={`text-xs font-semibold ${user.mailgun_connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatMailgunConnected(user.mailgun_connected)}</span></TableCell>
// //         <TableCell><span className={`text-xs font-semibold ${user.payment_processor_integration ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}>{formatPaymentProcessor(user.payment_processor_integration)}</span></TableCell>
// //       </TableRow>
// //     );
// //   });
// //   };
  
// //   const getStatusBgColor = (status) => {
// //   if (!status) return 'bg-gray-400/10 text-gray-400';
// //   switch (status.toLowerCase()) {
// //     case 'active':
// //       return 'bg-green-400/10 text-green-400';
// //     case 'canceled':
// //       return 'bg-red-400/10 text-red-400';
// //     case 'past_due':
// //       return 'bg-yellow-400/10 text-yellow-400';
// //     case 'trialing':
// //       return 'bg-blue-400/10 text-blue-400';
// //     default:
// //       return 'bg-gray-400/10 text-gray-400';
// //   }
// //   };
  
// //   const updateCards = (filteredUsers) => {
// //   console.log('Updating cards with filtered users:', filteredUsers);
// //   const filteredWithoutUnknown = filteredUsers.filter(user => user.account_status !== 'Unknown');
// //   const totalUsers = filteredWithoutUnknown.length;
// //   const mailgunConnectedCount = filteredWithoutUnknown.filter(user => user.mailgun_connected).length;
// //   const firstTransactionCount = filteredWithoutUnknown.filter(user => user.has_had_first_transaction).length;
// //   const paymentProcessorCount = filteredWithoutUnknown.filter(user => user.payment_processor_integration).length;
// //   const demoCallCount = filteredWithoutUnknown.filter(user => user.demo_call.scheduled_call).length;
// //   const onboardingCallCount = filteredWithoutUnknown.filter(user => user.onboarding_call.scheduled_call).length;
// //   const mailgunPercentage = totalUsers ? (mailgunConnectedCount / totalUsers * 100).toFixed(2) : 0;
// //   const transactionPercentage = totalUsers ? (firstTransactionCount / totalUsers * 100).toFixed(2) : 0;
// //   const paymentProcessorPercentage = totalUsers ? (paymentProcessorCount / totalUsers * 100).toFixed(2) : 0;
// //   const demoCallPercentage = totalUsers ? (demoCallCount / totalUsers * 100).toFixed(2) : 0;
// //   const onboardingCallPercentage = totalUsers ? (onboardingCallCount / totalUsers * 100).toFixed(2) : 0;
// //   const profitableUsers = filteredWithoutUnknown.filter(user => user.has_had_first_transaction && user.time_to_become_profitable);
// //   const totalProfitableTime = profitableUsers.reduce((sum, user) => sum + user.time_to_become_profitable, 0);
// //   const averageTimeToRevenue = totalProfitableTime ? (totalProfitableTime / profitableUsers.length) / (1000 * 60 * 60 * 24) : 0;
// //   const activeCount = filteredWithoutUnknown.filter(user => user.account_status === 'active').length;
// //   const canceledCount = filteredWithoutUnknown.filter(user => user.account_status === 'canceled').length;
// //   const pastDueCount = filteredWithoutUnknown.filter(user => user.account_status === 'past_due').length;
// //   const trialingCount = filteredWithoutUnknown.filter(user => user.account_status === 'trialing').length;
// //   const activePercentage = totalUsers ? (activeCount / totalUsers * 100).toFixed(2) : 0;
// //   const canceledPercentage = totalUsers ? (canceledCount / totalUsers * 100).toFixed(2) : 0;
// //   const pastDuePercentage = totalUsers ? (pastDueCount / totalUsers * 100).toFixed(2) : 0;
// //   const trialingPercentage = totalUsers ? (trialingCount / totalUsers * 100).toFixed(2) : 0;
// //   setStats({
// //     mailgunPercentage: `${mailgunPercentage}%`,
// //     mailgunCount: `${mailgunConnectedCount} of ${totalUsers}`,
// //     transactionPercentage: `${transactionPercentage}%`,
// //     transactionCount: `${firstTransactionCount} of ${totalUsers}`,
// //     paymentProcessorPercentage: `${paymentProcessorPercentage}%`,
// //     paymentProcessorCount: `${paymentProcessorCount} of ${totalUsers}`,
// //     averageTimeToRevenue: `${averageTimeToRevenue.toFixed(2)} days`,
// //     activePercentage: `${activePercentage}%`,
// //     activeCount: `${activeCount} of ${totalUsers}`,
// //     canceledPercentage: `${canceledPercentage}%`,
// //     canceledCount: `${canceledCount} of ${totalUsers}`,
// //     pastDuePercentage: `${pastDuePercentage}%`,
// //     pastDueCount: `${pastDueCount} of ${totalUsers}`,
// //     trialingPercentage: `${trialingPercentage}%`,
// //     trialingCount: `${trialingCount} of ${totalUsers}`,
// //     demoCallPercentage: `${demoCallPercentage}%`,
// //     demoCallCount: `${demoCallCount} of ${totalUsers}`,
// //     onboardingCallPercentage: `${onboardingCallPercentage}%`,
// //     onboardingCallCount: `${onboardingCallCount} of ${totalUsers}`,
// //   });
// //   };
  
// // const aggregateDataByDay = (data, field) => {
// //   if (!Array.isArray(data)) {
// //     console.error('Expected data to be an array, but got:', data);
// //     return [];
// //   }
// //   const aggregatedData = {};
// //   const totalUsersByDay = {};
// //   const runningTotal = { count: 0, total: 0 };
// //   data.forEach(item => {
// //     const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
// //     if (!aggregatedData[date]) {
// //       aggregatedData[date] = 0;
// //       totalUsersByDay[date] = 0;
// //     }
// //     totalUsersByDay[date] += 1;
// //     if (item[field]) {
// //       aggregatedData[date] += 1;
// //     }
// //   });
// //   const result = Object.keys(aggregatedData)
// //     .sort((a, b) => new Date(a) - new Date(b))
// //     .map(date => {
// //       runningTotal.count += totalUsersByDay[date];
// //       runningTotal.total += aggregatedData[date];
// //       return {
// //         date,
// //         value: (runningTotal.total / runningTotal.count) * 100, // Calculate running average percentage
// //       };
// //     });
// //   return result;
// // };
    
// // const aggregateRevenueByDay = (users) => {
// //   const aggregatedData = {};
// //   users.forEach(user => {
// //     const date = new Date(user.timestamp * 1000).toISOString().split('T')[0]; // Ensure correct date conversion
// //     const { product_id } = user;
// //     const { price } = getProductPriceAndStyle(product_id);
// //     if (!aggregatedData[date]) {
// //       aggregatedData[date] = 0;
// //     }
// //     aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
// //   });
// //   const result = Object.keys(aggregatedData)
// //     .map(date => ({
// //       date: new Date(date), // Ensure date is a JavaScript Date object
// //       value: aggregatedData[date],
// //     }))
// //     .sort((a, b) => new Date(a.date) - new Date(b.date));
// //   console.log('Aggregated Revenue Data:', result); // Debug the data
// //   return result;
// // };

// // const aggregateCumulativeRevenueByDay = (users) => {
// //   const aggregatedData = {};
// //   let cumulativeRevenue = 0;
  
// //   users.forEach(user => {
// //     const date = new Date(user.timestamp * 1000).toISOString().split('T')[0];
// //     const { product_id } = user;
// //     const { price } = getProductPriceAndStyle(product_id);
// //     if (!aggregatedData[date]) {
// //       aggregatedData[date] = 0;
// //     }
// //     aggregatedData[date] += parseFloat(price.replace('$', '').replace(',', ''));
// //   });

// //   const result = Object.keys(aggregatedData)
// //     .sort((a, b) => new Date(a) - new Date(b))
// //     .map(date => {
// //       cumulativeRevenue += aggregatedData[date];
// //       return {
// //         date: new Date(date), // Ensure date is a JavaScript Date object
// //         value: cumulativeRevenue,
// //       };
// //     });

// //   console.log('Cumulative Revenue Data:', result); // Debug the data
// //   return result;
// // };
  
// //   const handleRangeChange = (range) => {
// //   setSelectedRange(range);
// //   const today = new Date();
// //   let start, end;
// //   switch (range) {
// //     case '1W':
// //       start = new Date(today);
// //       start.setDate(today.getDate() - 7);
// //       end = new Date();
// //       break;
// //     case '4W':
// //       start = new Date(today);
// //       start.setDate(today.getDate() - 28);
// //       end = new Date();
// //       break;
// //     case '3M':
// //       start = new Date(today);
// //       start.setMonth(today.getMonth() - 3);
// //       end = new Date();
// //       break;
// //     case '1Y':
// //       start = new Date(today);
// //       start.setFullYear(today.getFullYear() - 1);
// //       end = new Date();
// //       break;
// //     case 'MTD':
// //       start = new Date(today.getFullYear(), today.getMonth(), 1);
// //       end = new Date();
// //       break;
// //     case 'QTD':
// //       start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
// //       end = new Date();
// //       break;
// //     case 'YTD':
// //       start = new Date(today.getFullYear(), 0, 1);
// //       end = new Date();
// //       break;
// //     case 'ALL':
// //       start = new Date(2000, 0, 1);
// //       end = new Date();
// //       break;
// //     default:
// //       start = end = new Date();
// //   }
// //   console.log('Selected Range:', range);
// //   console.log('Start Date:', start);
// //   console.log('End Date:', end);
// //   setStartDate(start);
// //   setEndDate(end);
// //   fetchData(start, end);
// //   };
  
// //   const DateRangeSelector = () => (
// //   <div className="flex space-x-1">
// //     {['1W', '4W', '3M', '1Y', 'MTD', 'QTD', 'YTD', 'ALL'].map(range => (
// //       <button
// //         key={range}
// //         onClick={() => handleRangeChange(range)}
// //         className={`text-sm font-semibold px-2 py-1 rounded-md ${selectedRange === range ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
// //       >
// //         {range}
// //       </button>
// //     ))}
// //   </div>
// //   );
  
// //   const handleFilterChange = (filters) => {
// //   setFilterState(filters);
// //   const filteredUsers = users.filter(user => {
// //     const statusMatch = filters.status.includes(user.account_status);
// //     const planMatch = filters.plan === 'all' ||
// //       (filters.plan === 'platinum' && ['prod_NC25k0PnePTpDK', 'prod_PuhtpFfKP74tSq'].includes(user.product_id)) ||
// //       (filters.plan === 'prod_PpFXqy79vlGOIE' && ['prod_PpFXqy79vlGOIE', 'prod_PdPwwouLLJod3b', 'prod_M6IyZeJydN4vMn'].includes(user.product_id)) ||
// //       (filters.plan === 'prod_OvDkzhKINbc38T' && ['prod_OvDkzhKINbc38T', 'prod_M6IyfUy0ONYSIw'].includes(user.product_id)) ||
// //       filters.plan === user.product_id;
// //     return (filters.calendar === 'all' || (filters.calendar === 'true' && user.total_calendars > 0) || (filters.calendar === 'false' && user.total_calendars === 0)) &&
// //       (filters.product === 'all' || (filters.product === 'true' && user.total_products > 0) || (filters.product === 'false' && user.total_products === 0)) &&
// //       (filters.firstTransaction === 'all' || (filters.firstTransaction === 'true' && user.has_had_first_transaction) || (filters.firstTransaction === 'false' && !user.has_had_first_transaction)) &&
// //       (filters.mailgun === 'all' || (filters.mailgun === 'true' && user.mailgun_connected) || (filters.mailgun === 'false' && !user.mailgun_connected)) &&
// //       (filters.paymentProcessor === 'all' || (filters.paymentProcessor === 'True' && user.payment_processor_integration)
// //   (filters.paymentProcessor === 'True' && user.payment_processor_integration) ||
// //   (filters.paymentProcessor === 'False' && !user.payment_processor_integration)) &&
// //   (filters.demoScheduled === 'all' ||
// //     (filters.demoScheduled === 'true' && user.demo_call?.scheduled_call) ||
// //     (filters.demoScheduled === 'false' && (!user.demo_call || !user.demo_call.scheduled_call))) &&
// //   (filters.onboardingScheduled === 'all' ||
// //     (filters.onboardingScheduled === 'true' && user.onboarding_call?.scheduled_call) ||
// //     (filters.onboardingScheduled === 'false' && (!user.onboarding_call || !user.onboarding_call.scheduled_call))) &&
// //   (filters.demoCompleted === 'all' ||
// //     (filters.demoCompleted === 'true' && user.demo_call?.completed_call === true) ||
// //     (filters.demoCompleted === 'false' && user.demo_call?.completed_call === false)) &&
// //   (filters.onboardingCompleted === 'all' ||
// //     (filters.onboardingCompleted === 'true' && user.onboarding_call?.completed_call === true) ||
// //     (filters.onboardingCompleted === 'false' && user.onboarding_call?.completed_call === false)) &&
// //   planMatch &&
// //   statusMatch;
// //   });
// //   setFilteredUsers(filteredUsers);
// //   updateCards(filteredUsers);
  
// //   // Recalculate Total Revenue, Daily MRR, and MRR Trajectory
// //   const totalRevenue = calculateTotalRevenue(filteredUsers);
// //   const { avgDailyMRR, mrrTrajectory } = calculateMRR(totalRevenue, startDate, endDate);
// //   setTotalRevenue(totalRevenue);
// //   setAvgDailyMRR(avgDailyMRR);
// //   setMrrTrajectory(mrrTrajectory);
// //   };
  
// //   return (
// //     <>
// //       <div className="py-12 sm:py-16 bg-white">
// //         <div className="mx-auto max-w-7xl px-4 lg:px-6">
// //           <div className="text-left">
// //             <Heading className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">User Data</Heading>
// //             <p className="mt-4 text-lg leading-8 text-gray-600">Overview of user data based on the selected date range.</p>
// //             <hr className="mt-4 mb-8 border-t border-gray-300" />
// //           </div>
// //           <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
// //             <div className="flex flex-col sm:flex-row sm:flex-grow sm:space-x-4">
// //               <div className="hidden sm:block">
// //                 <SalesDatePicker
// //                   startDate={startDate}
// //                   setStartDate={setStartDate}
// //                   endDate={endDate}
// //                   setEndDate={setEndDate}
// //                   fetchSalesData={fetchData}
// //                 />
// //               </div>
// //             </div>
// //             <Button className="hidden sm:block sm:ml-auto" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
// //             <div className="block sm:hidden w-full">
// //               <Button className="mt-4 w-full" onClick={() => setIsFilterPanelOpen(true)}>Filters</Button>
// //               <SalesDatePicker
// //                 startDate={startDate}
// //                 setStartDate={setStartDate}
// //                 endDate={endDate}
// //                 setEndDate={setEndDate}
// //                 fetchSalesData={fetchData}
// //               />
// //             </div>
// //           </div>
// //           <dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
// //             <StatCard title="MailGun Connected" value={stats.mailgunPercentage} subtitle={stats.mailgunCount} trendData={aggregateDataByDay(filteredUsers, 'mailgun_connected')} showGraph={true} isPercentage={true} />
// //             <StatCard title="Payment Processor Connected" value={stats.paymentProcessorPercentage} subtitle={stats.paymentProcessorCount} trendData={aggregateDataByDay(filteredUsers, 'payment_processor_integration')} showGraph={true} isPercentage={true} />
// //             <CombinedStatusCard stats={stats} />
// //             <TotalRevenueCard totalRevenue={totalRevenue} revenueTrendData={aggregateCumulativeRevenueByDay(filteredUsers)} />
// //             <DailyMRRCard avgDailyMRR={avgDailyMRR} trendData={revenueTrendData} />
// //             <MRRTrajectoryCard mrrTrajectory={mrrTrajectory} trendData={revenueTrendData} showGraph={true} isPercentage={false} />
// //             <StatCard title="Demo Call Scheduled" value={stats.demoCallPercentage} subtitle={stats.demoCallCount} trendData={aggregateDataByDay(filteredUsers, 'demo_call')} showGraph={true} isPercentage={true} />
// //             <StatCard title="Onboarding Call Scheduled" value={stats.onboardingCallPercentage} subtitle={stats.onboardingCallCount} trendData={aggregateDataByDay(filteredUsers, 'onboarding_call')} showGraph={true} isPercentage={true} />
// //           </dl>
// //         </div>
// //       </div>
// //       <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 bg-white-100">
// //         <div className="mx-auto max-w-7xl bg-white-100">
// //           <Table className="table-auto w-full bg-white-100">
// //             <CallReportingModal
// //               isOpen={isModalOpen}
// //               onClose={closeReportModal}
// //               callType={modalCallType}
// //               user={modalUser}
// //             />
// //             <TableHead>
// //               <TableRow>
// //                 <TableHeader>Location Name</TableHeader>
// //                 <TableHeader className="cursor-pointer" onClick={() => handleSort('demo_call')}>Demo<br />Scheduled</TableHeader>
// //                 <TableHeader>Demo<br />Completed</TableHeader>
// //                 <TableHeader className="cursor-pointer" onClick={() => handleSort('onboarding_call')}>Onboarding<br />Scheduled</TableHeader>
// //                 <TableHeader>Onboarding<br />Completed</TableHeader>
// //                 <TableHeader className="cursor-pointer" onClick={() => handleSort('mailgun_connected')}>Mailgun</TableHeader>
// //                 <TableHeader className="cursor-pointer" onClick={() => handleSort('payment_processor_integration')}>Pay<br />Int</TableHeader>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {renderTable()}
// //             </TableBody>
// //           </Table>
// //         </div>
// //       </div>
// //       {isFilterPanelOpen && (
// //         <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-end">
// //           <div className="bg-white w-64 p-4 shadow-lg">
// //             <button onClick={() => setIsFilterPanelOpen(false)} className="mb-4">Close</button>
// //             <Filters
// //               onFilterChange={handleFilterChange}
// //               users={users}
// //               filterState={filterState}
// //               setIsFilterPanelOpen={setIsFilterPanelOpen}
// //             />
// //           </div>
// //         </div>
// //       )}
// //       <style jsx>{`
// //         th, td {
// //           padding: 0.5rem 0.75rem;
// //         }
// //         th {
// //           font-size: 0.5rem;
// //           white-space: normal;
// //         }
// //         .location-name {
// //           font-size: 0.875rem;
// //         }
// //         .status-dot {
// //           display: inline-block;
// //           width: 0.5rem;
// //           height: 0.5rem;
// //           border-radius: 50%;
// //           margin-right: 0.5rem;
// //         }
// //         .text-green-600 {
// //           color: #16a34a;
// //         }
// //         .text-yellow-700 {
// //           font-size: 0.875rem;
// //         }
// //         .bg-yellow-100 {
// //           background-color: #fef3c7;
// //         }
// //         .border-yellow-700 {
// //           border-color: #d97706;
// //         }
// //         @media (max-width: 640px) {
// //           .flex-col {
// //             flex-direction: column;
// //           }
// //           .table-auto {
// //             display: block;
// //             overflow-x: auto;
// //             white-space: nowrap;
// //           }
// //           .table-auto th, .table-auto td {
// //             display: inline-block;
// //             width: auto;
// //           }
// //           th, td {
// //             font-size: 0.75rem;
// //           }
// //           .hidden {
// //             display: none;
// //           }
// //         }
// //         button {
// //           position: relative;
// //           z-index: 10;
// //         }
// //       `}</style>
// //     </>
// //   );};