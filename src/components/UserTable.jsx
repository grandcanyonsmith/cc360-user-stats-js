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
  formatAccountStatus,
  activeTab // Receive activeTab prop
}) => {

  const categorizeUsers = (users) => {
    const categories = {
      closed: [],
      notClosed: [],
      noShow: [],
      noOnboardingScheduled: [],
      needsReporting: []
    };

    users.forEach(user => {
      const demoCall = user.demo_call;
      const onboardingCall = user.onboarding_call;

      if (demoCall && demoCall.scheduled_call && demoCall.employee_name !== 'Canyon' && demoCall.employee_name !== 'Stockton') {
        if (demoCall.completed_call === true) {
          if (demoCall.joined_higher_plan_after_call || demoCall.paid_early_after_call || demoCall.sale_upgrade_after_call) {
            if (onboardingCall && onboardingCall.scheduled_call) {
              categories.closed.push(user);
            } else {
              categories.noOnboardingScheduled.push(user);
            }
          } else {
            categories.notClosed.push(user);
          }
        } else if (demoCall.completed_call === false) {
          categories.noShow.push(user);
        } else {
          categories.needsReporting.push(user);
        }
      }
    });

    return categories;
  };

  const calculateTotalRevenue = (users) => {
    return users.reduce((sum, user) => {
      const { price } = getProductPriceAndStyle(user.product_id);
      return sum + parseFloat(price.replace('$', '').replace(',', ''));
    }, 0);
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatShortDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const renderTable = (users) => {
    return users.map(user => {
      const { price, style } = getProductPriceAndStyle(user.product_id);
      const formattedDate = formatShortDate(user.timestamp);

      return (
        <TableRow key={user.location_id}>
          <TableCell className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
            <div className="flex items-center">
              <a href={user.contact_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 1 0-11.963 0m11.963 0A8.966 8.966 0 1 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{formatHasDemoCallScheduled(user.demo_call)}</TableCell>
          <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            {user.demo_call && user.demo_call.scheduled_call && user.demo_call.completed_call === 'unknown' ? (
              <button onClick={() => openReportModal('Demo', user)} className="text-yellow-700 bg-yellow-100 border border-yellow-700 rounded px-2 py-1">Report</button>
            ) : user.demo_call && user.demo_call.scheduled_call === false ? (
              <span>No</span>
            ) : formatDemoCompleted(user)}
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
        </TableRow>
      );
    });
  };

  const categorizedUsers = categorizeUsers(filteredUsers);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">User Data</h1>
          <p className="mt-2 text-sm text-gray-700">Overview of user data based on the selected date range.</p>
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
                </tr>
              </thead>
              <tbody className="bg-white">
                {activeTab === 'Sales' && (
                  <>
                    <tr className="border-t border-gray-200">
                      <th colSpan="6" scope="colgroup" className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        Closed ({formatCurrency(calculateTotalRevenue(categorizedUsers.closed))} - Total {categorizedUsers.closed.length})
                      </th>
                    </tr>
                    {renderTable(categorizedUsers.closed)}
                    <tr className="border-t border-gray-200">
                      <th colSpan="6" scope="colgroup" className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        Not Closed ({formatCurrency(calculateTotalRevenue(categorizedUsers.notClosed))} - Total {categorizedUsers.notClosed.length})
                      </th>
                    </tr>
                    {renderTable(categorizedUsers.notClosed)}
                    <tr className="border-t border-gray-200">
                      <th colSpan="6" scope="colgroup" className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        No Show ({formatCurrency(calculateTotalRevenue(categorizedUsers.noShow))} - Total {categorizedUsers.noShow.length})
                      </th>
                    </tr>
                    {renderTable(categorizedUsers.noShow)}
                    <tr className="border-t border-gray-200">
                      <th colSpan="6" scope="colgroup" className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        No Onboarding Scheduled ({formatCurrency(calculateTotalRevenue(categorizedUsers.noOnboardingScheduled))} - Total {categorizedUsers.noOnboardingScheduled.length})
                      </th>
                    </tr>
                    {renderTable(categorizedUsers.noOnboardingScheduled)}
                    <tr className="border-t border-gray-200">
                      <th colSpan="6" scope="colgroup" className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                        Needs Reporting ({formatCurrency(calculateTotalRevenue(categorizedUsers.needsReporting))} - Total {categorizedUsers.needsReporting.length})
                      </th>
                    </tr>
                    {renderTable(categorizedUsers.needsReporting)}
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