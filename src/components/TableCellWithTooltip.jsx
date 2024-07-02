import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
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
const TableCellWithTooltip = ({ user, openReportModal }) => {
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

export default TableCellWithTooltip;