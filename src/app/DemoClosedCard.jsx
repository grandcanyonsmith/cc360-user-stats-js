import React from 'react';
import StatCard from '@/components/StatCard';

const DemoClosedCard = ({ filteredUsers }) => {
  const demoClosedPercentage = calculateDemoClosedPercentage(filteredUsers);
  const trendData = aggregateDemoClosedByDay(filteredUsers);
  const { totalNotClosed, totalNoShow, totalClosed } = calculateDemoStats(filteredUsers);

  return (
    <div>
      <StatCard
        title="Demo Closed"
        value={`${demoClosedPercentage}%`}
        subtitle={`Percentage of demo calls closed`}
        trendData={trendData}
        showGraph={true}
        isPercentage={true}
        maxValue={100} // Ensure the graph displays up to 100%
      />
      <div className="mt-4 text-left">
        <p>Total Not Closed: {totalNotClosed}</p>
        <p>Total No Show (Not Completed): {totalNoShow}</p>
        <p>Total Closed: {totalClosed}</p>
      </div>
    </div>
  );
};

const calculateDemoClosedPercentage = (users) => {
  const totalDemos = users.filter(user => user.demo_call && user.demo_call.scheduled_call).length;
  const demoClosedCount = users.filter(user => {
    const demoCall = user.demo_call;
    return demoCall && (demoCall.joined_higher_plan_after_call || demoCall.paid_early_after_call || demoCall.sale_upgrade_after_call);
  }).length;
  return totalDemos ? (demoClosedCount / totalDemos * 100).toFixed(2) : 0;
};

const aggregateDemoClosedByDay = (users) => {
  const aggregatedData = {};
  const totalDemosByDay = {};

  users.forEach(user => {
    const date = new Date(user.timestamp).toISOString().split('T')[0];
    const demoCall = user.demo_call;

    if (!aggregatedData[date]) {
      aggregatedData[date] = 0;
      totalDemosByDay[date] = 0;
    }

    if (demoCall && demoCall.scheduled_call) {
      totalDemosByDay[date] += 1;
      if (demoCall.joined_higher_plan_after_call || demoCall.paid_early_after_call || demoCall.sale_upgrade_after_call) {
        aggregatedData[date] += 1;
      }
    }
  });

  return Object.keys(aggregatedData)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(date => ({
      date: new Date(date),
      value: totalDemosByDay[date] ? (aggregatedData[date] / totalDemosByDay[date] * 100).toFixed(2) : 0,
    }));
};

const calculateDemoStats = (users) => {
  let totalNotClosed = 0;
  let totalNoShow = 0;
  let totalClosed = 0;

  users.forEach(user => {
    const demoCall = user.demo_call;
    if (demoCall && demoCall.scheduled_call) {
      if (demoCall.completed_call) {
        if (demoCall.joined_higher_plan_after_call || demoCall.paid_early_after_call || demoCall.sale_upgrade_after_call) {
          totalClosed += 1;
        } else {
          totalNotClosed += 1;
        }
      } else {
        totalNoShow += 1;
      }
    }
  });

  return { totalNotClosed, totalNoShow, totalClosed };
};

export default DemoClosedCard;