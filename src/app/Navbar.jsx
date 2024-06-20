'use client'

import React from 'react';

export function Navbar() {
  const navigateTo = (url) => {
    window.location.href = url;
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <a href="#" className="text-white border-b-2 border-white px-3 py-2 rounded-md text-sm font-medium">Customer Success</a>
          <a href="#" onClick={() => navigateTo('https://html-starter-coral.vercel.app/cc360-revenue-stats.html')} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sales</a>
          <a href="#" onClick={() => navigateTo('https://html-starter-coral.vercel.app/levi-commission-tracker.html')} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Levi Tracker</a>
        </div>
      </div>
    </nav>
  );
}