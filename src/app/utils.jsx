import React, { useState } from 'react';
import CallReportingModal from './CallReportingModal';


export function formatIncome(income) {
    if (isNaN(parseFloat(income))) {
        return <span className="text-gray-500">$0</span>;
    } else if (parseFloat(income) === 0) {
        return <span className="text-gray-500">${parseFloat(income).toLocaleString()}</span>;
    } else {
        return <strong>${parseFloat(income).toLocaleString()}</strong>;
    }
}

export function formatHasCalendar(totalCalendars) {
    if (totalCalendars > 0) {
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Has Calendar</span>;
    } else {
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No Calendar</span>;
    }
}

export function formatHasProduct(totalProducts) {
    if (totalProducts > 0) {
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Has Product</span>;
    } else {
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No Product</span>;
    }
}

export function formatFirstTransaction(hasTransaction) {
    if (hasTransaction) {
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
    } else {
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
    }
}

export function formatMailgunConnected(isConnected) {
    if (isConnected) {
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
    } else {
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
    }
}

export function formatPaymentProcessor(isIntegrated) {
    if (isIntegrated) {
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
    } else {
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
    }
}

export function formatAccountStatus(status) {
    switch (status) {
        case 'active':
            return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>;
        case 'trialing':
            return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">Trialing</span>;
        case 'past_due':
            return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">Past Due</span>;
        case 'canceled':
            return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Canceled</span>;
        default:
            return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">Unknown</span>;
    }
}

export function formatHasDemoCallScheduled(demoCall) {
    if (demoCall && demoCall.scheduled_call) {
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
    } else {
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
    }
}

export function formatHasOnboardingCallScheduled(onboardingCall) {
    if (onboardingCall && onboardingCall.scheduled_call) {
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Yes</span>;
    } else {
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">No</span>;
    }
}

export const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  export const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

// export const formatDemoCompleted = (user) => {
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

// export  const formatOnboardingCompleted = (user) => {
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