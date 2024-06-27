import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatDate } from '../app/utils';

const TrendGraph = ({ data, isPercentage }) => {
  // Ensure that the date is correctly parsed as a JavaScript Date object
  const parsedData = data.map(item => ({
    ...item,
    date: new Date(item.date)
  }));

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={parsedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => formatDate(tick)}
          ticks={[parsedData[0]?.date, parsedData[parsedData.length - 1]?.date]}
        />
        <YAxis
          tickFormatter={(tick) => isPercentage ? `${Math.round(tick)}%` : formatCurrency(tick)}
          tick={{ fontSize: 10 }}
        />
        <Tooltip
          formatter={(value) => isPercentage ? `${Math.round(value)}%` : formatCurrency(value)}
          labelFormatter={(label) => formatDate(label)}
        />
        <Line type="monotone" dataKey="value" stroke="#0072c6" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendGraph;