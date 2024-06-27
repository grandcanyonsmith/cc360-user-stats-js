import React from 'react';

const StatusBadge = ({ status, color }) => (
  <span className={`inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-700 ring-1 ring-inset ring-${color}-600/20`}>
    {status}
  </span>
);

export default StatusBadge;