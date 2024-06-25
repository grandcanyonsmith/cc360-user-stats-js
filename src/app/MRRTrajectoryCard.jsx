import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency, formatDate } from './utils'; // Ensure these utility functions are available

const MRRTrajectoryCard = ({ mrrTrajectory, revenueTrendData }) => (
  <div className="flex flex-col bg-white p-4 shadow rounded-md">
    <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">MRR Trajectory</dt>
    <dd className="text-2xl font-bold tracking-tight text-gray-900 mt-1 text-left">{formatCurrency(mrrTrajectory)}</dd>
    <dd className="text-xs text-gray-600 mt-0 text-left">Projected monthly increase</dd>
    <div className="flex-grow w-full">
    {/* //         <ResponsiveContainer width="100%" height={100}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="date"
//               tickFormatter={(tick) => formatDate(tick)}
//               ticks={[data[0]?.date, data[data.length - 1]?.date]}
//             />
//             <YAxis
//               tickFormatter={(tick) => isPercentage ? `${Math.round(tick)}%` : formatCurrency(tick)}
//               tick={{ fontSize: 10 }} // Make the numbers smaller
//             />
//             <Tooltip
//               formatter={(value) => isPercentage ? `${Math.round(value)}%` : formatCurrency(value)}
//               labelFormatter={(label) => formatDate(label)}
//             />
//             <Line type="monotone" dataKey="value" stroke="#0072c6" dot={false} />
//           </LineChart>
//         </ResponsiveContainer> */}
    </div>
  </div>
);

export default MRRTrajectoryCard;