import React from 'react';
import TrendGraph from './TrendGraph';

const StatCard = ({ title, value, subtitle, trendData, showGraph, isPercentage }) => {
  const statusClasses = {
    'Active': 'bg-green-600',
    'Canceled': 'bg-red-600',
    'Past Due': 'bg-yellow-600',
    'Trialing': 'bg-blue-600',
    'Unknown': 'bg-gray-600'
  };

  const formattedTitle = statusClasses[title] ? (
    <div className="flex items-center">
      <span className={`inline-block w-2 h-2 mr-2 rounded-full ${statusClasses[title]}`}></span>
      <span>{title}</span>
    </div>
  ) : (
    title
  );

  const textColor = (title === 'MailGun Connected' || title === 'Payment Processor Connected') ? 'text-green-600' : 'text-gray-900';

  return (
    <div className="flex flex-col bg-white p-4 shadow rounded-md">
      <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">{formattedTitle}</dt>
      <dd className={`text-2xl font-bold tracking-tight ${textColor} mt-1 text-left`}>{value}</dd>
      {subtitle && <dd className="text-xs text-gray-600 mt-0 text-left">{subtitle}</dd>}
      {showGraph && (
        <div className="flex-grow w-full">
          <TrendGraph data={trendData} isPercentage={isPercentage} />
        </div>
      )}
    </div>
  );
};

export default StatCard;