import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import CallReportingModal from '../app/CallReportingModal'; // Import the modal component
import ReportButton from '@/components/ReportButton'; // Import the ReportButton component
import {
  formatHasDemoCallScheduled,
  formatHasOnboardingCallScheduled,
  formatDemoCompleted, // Ensure correct import
  formatDemoClosed,
  formatMailgunConnected,
  formatPaymentProcessor,
  formatAccountStatus,
  formatDate,
  formatCurrency,
  getStatusBgColor,
} from '../app/utils';
const formatShortDate = (date) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
const TableCellWithTooltip = ({ user }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggleTooltip = () => {
    console.log(`Scheduled call time: ${user.demo_call.appointment_time}`);
    setShowTooltip(!showTooltip);
  };

  return (
    <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
      {user.demo_call && user.demo_call.scheduled_call ? (
        <>
          <span
            onClick={handleToggleTooltip}
            className="inline-flex items-center cursor-pointer rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20"
          >
            Yes
          </span>
          {showTooltip && (
            <div className="absolute mt-2 p-2 bg-gray-200 rounded shadow-lg">
              {new Date(user.demo_call.appointment_time).toLocaleString()}
            </div>
          )}
        </>
      ) : (
        formatHasDemoCallScheduled(user.demo_call)
      )}
    </TableCell>
  );
};

const UserTable = ({
  filteredUsers,
  handleSort,
  openReportModal,
  modalUser,
  isModalOpen,
  closeReportModal,
  modalCallType,
  getProductPriceAndStyle,
  activeTab, // Receive activeTab prop
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortField, setSortField] = useState('signup_date');

  useEffect(() => {
    sortUsers(filteredUsers);
  }, [sortField]);

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleEditClick = (user) => {
    openReportModal('Edit', user);
    setDropdownOpen(null);
  };

  const handleSortChange = (field) => {
    setSortField(field);
    setSortDropdownOpen(false);
  };

  const sortUsers = (users) => {
    if (sortField === 'signup_date') {
      return users.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortField === 'demo_date') {
      return users.sort((a, b) => new Date(b.demo_call?.appointment_time) - new Date(a.demo_call?.appointment_time));
    }
    return users;
  };

  const renderTable = (users) => {
    const sortedUsers = sortUsers(users);
    return sortedUsers.map((user, index) => {
      const { price, style } = getProductPriceAndStyle(user.product_id);
      const formattedDate = formatShortDate(user.timestamp);
      return (
        <TableRow key={user.location_id}>
          <TableCell className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
            <div className="flex items-center">
              <a href={user.contact_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </a>
              <a href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`} className="text-indigo-600 hover:text-indigo-900 location-name">
                {user.location_name.replace("'s Account", '').replace('Account', '').trim().length > 15 ? `${user.location_name.replace("'s Account", '').replace('Account', '').trim().substring(0, 15)}...` : user.location_name.replace("'s Account", '').replace('Account', '').trim()}
              </a>
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <div className={`flex-none rounded-full p-1 ${getStatusBgColor(user.account_status)}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
              </div>
              <time className="text-gray-400 sm:hidden" dateTime={user.timestamp}>{formattedDate}</time>
              <div className="hidden sm:block ml-2">{formatAccountStatus(user.account_status)}</div>
              <div className="hidden sm:block ml-2">{formattedDate}</div>
              <div className={`ml-2 px-2 py-1 rounded-md border ${style}`}>{price}</div>
            </div>
          </TableCell>
          <TableCellWithTooltip user={user} />
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            {user.demo_call && user.demo_call.scheduled_call && user.demo_call.completed_call === 'unknown' ? (
              <ReportButton callType="Demo" user={user} openReportModal={openReportModal} />
            ) : user.demo_call && user.demo_call.scheduled_call === false ? (
              <span>No</span>
            ) : formatDemoCompleted(user, openReportModal)}
          </TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{formatDemoClosed(user)}</TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{formatHasOnboardingCallScheduled(user.onboarding_call)}</TableCell>
          {activeTab !== 'Sales' && (
            <>
              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <span className={`text-xs font-semibold ${user.mailgun_connected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}></span>
                {formatMailgunConnected(user.mailgun_connected)}
              </TableCell>
              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <span className={`text-xs font-semibold ${user.payment_processor_integration ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} rounded-full`}></span>
                {formatPaymentProcessor(user.payment_processor_integration)}
              </TableCell>
            </>
          )}
          <TableCell className="relative whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <button
              type="button"
              className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900"
              onClick={() => handleDropdownToggle(index)}
              aria-expanded={dropdownOpen === index}
              aria-haspopup="true"
            >
              <span className="sr-only">Open options</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
              </svg>
            </button>
            {dropdownOpen === index && (
              <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby={`options-menu-${index}-button`} tabIndex="-1">
                <a
                  href={`https://app.coursecreator360.com/v2/location/${user.location_id}/dashboard`}
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                  role="menuitem"
                  tabIndex="-1"
                  id={`options-menu-${index}-item-0`}
                >
                  View contact<span className="sr-only">, {user.location_name}</span>
                </a>
                <button
                  onClick={() => handleEditClick(user)}
                  className="block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900"
                  role="menuitem"
                  tabIndex="-1"
                  id={`options-menu-${index}-item-1`}
                >
                  Edit<span className="sr-only">, {user.location_name}</span>
                </button>
              </div>
            )}
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">User Data</h1>
          <p className="mt-2 text-sm text-gray-700">Overview of user data based on the selected date range.</p>
        </div>
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            Sort
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {sortDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  onClick={() => handleSortChange('signup_date')}
                >
                  Sort by Signup Date
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  onClick={() => handleSortChange('demo_date')}
                >
                  Sort by Scheduled Demo Date
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Location Name</th>
                  <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('demo_call')}>Demo Scheduled</th>
                  <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Demo Completed</th>
                  <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Demo Closed</th>
                  <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('onboarding_call')}>Onboarding Scheduled</th>
                  {activeTab !== 'Sales' && (
                    <>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('mailgun_connected')}>Mailgun</th>
                      <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('payment_processor_integration')}>Pay Int</th>
                    </>
                  )}
                  <th scope="col" className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Options</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {activeTab === 'Sales' && (
                  <>
                    {/* Category rows and rendering */}
                    {renderTable(filteredUsers)}
                  </>
                )}
                {activeTab !== 'Sales' && renderTable(filteredUsers)}
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