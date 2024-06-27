import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import CallReportingModal from '../app/CallReportingModal'; // Import the modal component

const UserTable = ({
  filteredUsers,
  handleSort,
  openReportModal,
  formatDemoCompleted,
  formatDemoClosed,
  formatHasDemoCallScheduled,
  formatHasOnboardingCallScheduled,
  formatOnboardingCompleted,
  formatMailgunConnected,
  formatPaymentProcessor,
  modalUser,
  isModalOpen,
  closeReportModal,
  modalCallType,
  getProductPriceAndStyle,
  formatDate,
  getStatusBgColor,
  formatAccountStatus
}) => {
  const renderTable = () => {
    if (!Array.isArray(filteredUsers)) {
      console.error('Expected filteredUsers to be an array, but got:', filteredUsers);
      return null;
    }
    return filteredUsers.map(user => {
      const { price, style } = getProductPriceAndStyle(user.product_id);
      const formattedDate = formatDate(user.timestamp);
      console.log('User:', user, 'Timestamp:', user.timestamp, 'Formatted Date:', formattedDate);
      return (
        <TableRow key={user.location_id}>
          <TableCell className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
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
              <time className="text-gray-400 sm:hidden" dateTime={user.timestamp}>{formattedDate}</time>
              <div className="hidden sm:block ml-2">{formatAccountStatus(user.account_status)}</div>
              <div className={`ml-2 px-2 py-1 rounded-md border ${style}`}>{price}</div>
            </div>
          </TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{formatHasDemoCallScheduled(user.demo_call)}</TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            {user.demo_call && user.demo_call.scheduled_call && user.demo_call.completed_call === 'unknown' ? (
              <button onClick={() => openReportModal('Demo', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
            ) : formatDemoCompleted(user)}
          </TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{formatDemoClosed(user)}</TableCell> {/* New Demo Closed Column */}
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{formatHasOnboardingCallScheduled(user.onboarding_call)}</TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            {user.onboarding_call && user.onboarding_call.scheduled_call && user.onboarding_call.completed_call === 'unknown' ? (
              <button onClick={() => openReportModal('Onboarding', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
            ) : formatOnboardingCompleted(user)}
          </TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"><span className={`text-xs font-semibold ${user.mailgun_connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}></span>{formatMailgunConnected(user.mailgun_connected)}</TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"><span className={`text-xs font-semibold ${user.payment_processor_integration ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}></span>{formatPaymentProcessor(user.payment_processor_integration)}</TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">User Data</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of user data based on the selected date range.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <div className="max-h-[96rem] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-white sticky top-0 z-10">
                <tr>
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-0">Location Name</TableHeader>
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter cursor-pointer" onClick={() => handleSort('demo_call')}>Demo Scheduled</TableHeader>
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Demo Completed</TableHeader>
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Demo Closed</TableHeader> {/* New Demo Closed Column Header */}
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter cursor-pointer" onClick={() => handleSort('onboarding_call')}>Onboarding Scheduled</TableHeader>
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">Onboarding Completed</TableHeader>
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter cursor-pointer" onClick={() => handleSort('mailgun_connected')}>Mailgun</TableHeader>
                  <TableHeader className="border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter cursor-pointer" onClick={() => handleSort('payment_processor_integration')}>Pay Int</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {renderTable()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CallReportingModal
        isOpen={isModalOpen}
        onClose={closeReportModal}
        callType={modalCallType}
        user={modalUser}
      />
    </div>
  );
};

export default UserTable;