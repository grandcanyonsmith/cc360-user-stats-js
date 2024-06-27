import React from 'react';

const ReportButton = ({ callType, user, openReportModal }) => (
  <button
    className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
    onClick={() => openReportModal(callType, user)}
  >
    Report
  </button>
);

export default ReportButton;