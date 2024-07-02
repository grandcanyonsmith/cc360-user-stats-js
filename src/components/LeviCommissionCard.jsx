import React from 'react';
import { formatCurrency } from '../app/utils'; // Ensure this utility function is available

const getProductPriceAndStyle = (productId) => {
  const productMap = {
    'prod_NC25k0PnePTpDK': { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' },
    'prod_PuhtpFfKP74tSq': { price: '$1,500', style: 'bg-gray-800 border-blue-500 text-white font-bold' },
    'prod_PpFYdvqmj38F2I': { price: '$297', style: 'bg-yellow-200 border-yellow-400 text-yellow-800' },
    'prod_PpFXqy79vlGOIE': { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' },
    'prod_PdPwwouLLJod3b': { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' },
    'prod_M6IyZeJydN4vMn': { price: '$147', style: 'bg-gray-200 border-gray-400 text-gray-800' },
    'prod_OvDkzhKINbc38T': { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' },
    'prod_M6IyfUy0ONYSIw': { price: '$97', style: 'bg-orange-200 border-orange-400 text-orange-800' },
    'prod_M6Iy3zjRHbDmm8': { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' },
  };
  return productMap[productId] || { price: '$47', style: 'bg-orange-200 border-orange-400 text-orange-800' };
};

const calculateLeviCommission = (users) => {
  const filteredUsers = users.filter(user =>
    user.demo_call?.scheduled_call &&
    user.demo_call?.completed_call === true &&
    user.onboarding_call?.scheduled_call &&
    user.demo_call?.employee_name === 'Levi' &&
    (user.demo_call?.paid_early_after_call || user.demo_call?.sale_upgrade_after_call || user.demo_call?.joined_higher_plan_after_call)
  );

  const sortedUsers = filteredUsers.sort((a, b) => new Date(b.demo_call.appointment_time) - new Date(a.demo_call.appointment_time));
  const totalRevenue = sortedUsers.reduce((sum, user) => {
    const { price } = getProductPriceAndStyle(user.product_id);
    const basePrice = parseFloat(price.replace('$', '').replace(',', ''));
    const commission = ['prod_NC25k0PnePTpDK', 'prod_PuhtpFfKP74tSq'].includes(user.product_id) ? 500 : basePrice;
    return sum + commission;
  }, 0);

  return { totalRevenue, sortedUsers };
};

const formatDate = (dateString) => {
  const options = { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const LeviCommissionCard = ({ users }) => {
  const { totalRevenue, sortedUsers } = calculateLeviCommission(users);
  return (
    <div className="flex flex-col bg-white p-4 shadow rounded-md h-64 overflow-y-auto">
      <dt className="text-sm font-semibold leading-6 text-gray-600 text-left">Levi Commission</dt>
      <dd className="text-2xl font-bold tracking-tight text-gray-900 mt-1 text-left">{formatCurrency(totalRevenue)}</dd>
      <dd className="text-xs text-gray-600 mt-0 text-left">Total revenue from selected users</dd>
      <ul className="mt-2 text-left">
        {sortedUsers.map((user, index) => {
          const { price } = getProductPriceAndStyle(user.product_id);
          const basePrice = parseFloat(price.replace('$', '').replace(',', ''));
          const commission = ['prod_NC25k0PnePTpDK', 'prod_PuhtpFfKP74tSq'].includes(user.product_id) ? 500 : basePrice;
          const userName = user.location_name.replace("'s Account", '');
          return (
            <React.Fragment key={user.location_id}>
              {index > 0 && <hr className="my-2" />}
              <li className="text-sm text-gray-700">
                {formatDate(user.demo_call.appointment_time)} - {userName} - {user.demo_call.employee_name} - <span className="font-bold">{formatCurrency(commission)}</span>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default LeviCommissionCard;