import React from 'react';
import { Tooltip } from 'react-tooltip';

const CombinedStatusCard = ({ stats }) => {
  const statusClasses = {
    active: 'bg-green-600',
    trialing: 'bg-blue-600',
    canceled: 'bg-red-600',
    past_due: 'bg-yellow-600',
  };

  const statuses = [
    { name: 'Active', percentage: stats.activePercentage, count: stats.activeCount, color: statusClasses.active },
    { name: 'Trialing', percentage: stats.trialingPercentage, count: stats.trialingCount, color: statusClasses.trialing },
    { name: 'Canceled', percentage: stats.canceledPercentage, count: stats.canceledCount, color: statusClasses.canceled },
    { name: 'Past Due', percentage: stats.pastDuePercentage, count: stats.pastDueCount, color: statusClasses.past_due },
  ];

  return (
    <div className="flex flex-col bg-white p-4 shadow rounded-md">
      <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">Status</dt>
      <div className="relative mt-2 h-4 w-full rounded-full bg-gray-200">
        {statuses.map((status, index) => (
          <div
            key={status.name}
            className={`absolute h-full ${status.color}`}
            style={{
              width: `${parseFloat(status.percentage)}%`,
              left: `${statuses.slice(0, index).reduce((sum, s) => sum + parseFloat(s.percentage), 0)}%`,
            }}
            data-tooltip-id={`tooltip-${status.name}`}
            data-tooltip-content={`${status.name}: ${status.percentage} (${status.count})`}
          />
        ))}
      </div>
      <div className="mt-2 space-y-1">
        {statuses.map(status => (
          <div key={status.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 mr-2 rounded-full ${status.color}`}></span>
              <span className="text-sm text-gray-800 capitalize">{status.name}</span>
            </div>
            <div className="text-sm text-gray-800">
              {status.count}
            </div>
          </div>
        ))}
      </div>
      {statuses.map(status => (
        <Tooltip key={status.name} id={`tooltip-${status.name}`} />
      ))}
    </div>
  );
};

export default CombinedStatusCard;