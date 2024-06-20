'use client'
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/button';

const dateRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'Last 4 weeks', value: 'last4weeks' },
  { label: 'Last 3 months', value: 'last3months' },
  { label: 'Last 12 months', value: 'last12months' },
  { label: 'Month to date', value: 'monthtodate' },
  { label: 'Quarter to date', value: 'quartertodate' },
  { label: 'Year to date', value: 'yeartodate' },
  { label: 'All time', value: 'alltime' },
];

const SalesDatePicker = ({ startDate, setStartDate, endDate, setEndDate, fetchSalesData }) => {
  const [selectedRange, setSelectedRange] = useState('monthtodate');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    handleRangeChange('monthtodate');
  }, []);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    // Set the dates based on the selected range
    const today = new Date();
    let start, end;

    switch (range) {
      case 'today':
        start = end = today;
        break;
      case 'last7days':
        start = new Date(today.setDate(today.getDate() - 7));
        end = new Date();
        break;
      case 'last4weeks':
        start = new Date(today.setDate(today.getDate() - 28));
        end = new Date();
        break;
      case 'last3months':
        start = new Date(today.setMonth(today.getMonth() - 3));
        end = new Date();
        break;
      case 'last12months':
        start = new Date(today.setFullYear(today.getFullYear() - 1));
        end = new Date();
        break;
      case 'monthtodate':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case 'quartertodate':
        start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        end = new Date();
        break;
      case 'yeartodate':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date();
        break;
      case 'alltime':
        start = new Date(2000, 0, 1); // Arbitrary old date
        end = new Date();
        break;
      default:
        start = end = new Date();
    }

    setStartDate(start);
    setEndDate(end);
    fetchSalesData(start, end);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="menu-button"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            onClick={toggleDropdown}
          >
            {dateRanges.find(range => range.value === selectedRange)?.label}
            <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
            <div className="py-1" role="none">
              {dateRanges.map((range) => (
                <a
                  href="#"
                  key={range.value}
                  className={`block px-4 py-2 text-sm ${selectedRange === range.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                  role="menuitem"
                  tabIndex="-1"
                  onClick={() => {
                    handleRangeChange(range.value);
                    setDropdownOpen(false);
                  }}
                >
                  {range.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="border rounded-md px-3 py-2"
        />
        <span className="text-gray-900">to</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="border rounded-md px-3 py-2"
        />
      </div>
    </div>
  );
};

export default SalesDatePicker;
