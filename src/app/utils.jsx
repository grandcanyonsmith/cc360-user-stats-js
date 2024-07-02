import React from 'react';
import StatusBadge from '@/components/StatusBadge';
import ReportButton from '@/components/ReportButton';
import { Tooltip as ReactTooltip } from 'react-tooltip';
export const formatDemoCompleted = (user, openReportModal) => {
  const demoCall = user.demo_call;
  if (!demoCall || demoCall.scheduled_call === false) {
    return <StatusBadge status="No" color="red" />;
  } else if (demoCall.completed_call === true) {
    return <StatusBadge status="Yes" color="green" />;
  } else {
    return <ReportButton callType="Demo" user={user} openReportModal={openReportModal} />;
  }
};

// Ensure other utility functions are also exported
export const formatIncome = (income) => {
  const parsedIncome = parseFloat(income);
  if (isNaN(parsedIncome)) {
    return <span className="text-gray-500">$0</span>;
  } else if (parsedIncome === 0) {
    return <span className="text-gray-500">${parsedIncome.toLocaleString()}</span>;
  } else {
    return <strong>${parsedIncome.toLocaleString()}</strong>;
  }
};


export const openReportModal = (callType, user) => {
    setModalCallType(callType);
    setModalUser(user);
    setIsModalOpen(true);
  };
const formatStatus = (condition, trueText, falseText) => (
  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${condition ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
    {condition ? trueText : falseText}
  </span>
);

export const formatHasCalendar = (totalCalendars) => formatStatus(totalCalendars > 0, 'Has Calendar', 'No Calendar');
export const formatHasProduct = (totalProducts) => formatStatus(totalProducts > 0, 'Has Product', 'No Product');
export const formatFirstTransaction = (hasTransaction) => formatStatus(hasTransaction, 'Yes', 'No');
export const formatMailgunConnected = (isConnected) => formatStatus(isConnected, 'Yes', 'No');
export const formatPaymentProcessor = (isIntegrated) => formatStatus(isIntegrated, 'Yes', 'No');

export const formatHasDemoCallScheduled = (demoCall) => {
  if (demoCall?.scheduled_call) {
    const date = new Date(demoCall.appointment_time);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return (
      <>
        <span data-tip={formattedDate} className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20">
          Yes
        </span>
        <ReactTooltip place="top" type="dark" effect="solid" />
      </>
    );
  }
  return formatStatus(false, '', 'No');
};

export const formatHasOnboardingCallScheduled = (onboardingCall) => formatStatus(onboardingCall?.scheduled_call, 'Yes', 'No');

export function formatAccountStatus(status) {
  const statusMap = {
    active: 'Active',
    trialing: 'Trialing',
    past_due: 'Past Due',
    canceled: 'Canceled',
  };
  const statusText = statusMap[status] || 'Unknown';
  const statusColor = {
    active: 'green',
    trialing: 'blue',
    past_due: 'yellow',
    canceled: 'red',
    unknown: 'gray',
  }[status] || 'gray';
  return (
    <span className={`inline-flex items-center rounded-md bg-${statusColor}-50 px-2 py-1 text-xs font-medium text-${statusColor}-700 ring-1 ring-inset ring-${statusColor}-600/20`}>
      {statusText}
    </span>
  );
}

export const formatDate = (date) => {
  const parsedDate = date instanceof Date ? date : new Date(date);
  return parsedDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatCurrency = (value) => {
  return value >= 1000 ? `$${(value / 1000).toFixed(1)}K` : `$${value.toLocaleString()}`;
};

export const getStatusBgColor = (status) => {
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

export const formatDemoClosed = (user) => {
  const demoCall = user.demo_call;
  if (demoCall && (demoCall.joined_higher_plan_after_call || demoCall.paid_early_after_call || demoCall.sale_upgrade_after_call)) {
    return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20">Yes</span>;
  } else {
    return <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-red-50 text-red-700 ring-red-600/20">No</span>;
  }
};

