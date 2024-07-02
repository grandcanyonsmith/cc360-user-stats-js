'use client'
import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse, isValid, addDays } from 'date-fns';
import { CalendarIcon } from '@heroicons/react/24/solid'; // Updated import for Heroicons v2
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
  { label: 'Custom', value: 'custom' },
];

const SalesDatePicker = ({ startDate, setStartDate, endDate, setEndDate, fetchSalesData }) => {
  const [selectedRange, setSelectedRange] = useState('monthtodate');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [focus, setFocus] = useState(null); // To track which input is focused
  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);

  const timeZoneOffset = -7 * 60; // MST (UTC-7)

  useEffect(() => {
    handleRangeChange('monthtodate');
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarOpen, dropdownOpen]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    if (range === 'custom') return; // Skip setting dates for custom range

    const today = new Date();
    let start, end;
    switch (range) {
      case 'today':
        start = end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'last7days':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'last4weeks':
        start = new Date(today);
        start.setDate(today.getDate() - 28);
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'last3months':
        start = new Date(today);
        start.setMonth(today.getMonth() - 3);
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'last12months':
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'monthtodate':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'quartertodate':
        start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'yeartodate':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      case 'alltime':
        start = new Date(2000, 0, 1); // Arbitrary old date
        end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
        break;
      default:
        start = end = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
    }

    // Include the day being selected
    end = addDays(end, 1);

    console.log('Selected Range:', range);
    console.log('Start Date:', start);
    console.log('End Date:', end);
    setStartDate(start);
    setEndDate(end);
    fetchSalesData(start, end);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCalendar = () => {
    setCalendarOpen(!calendarOpen);
  };

  const handleDateChange = (date) => {
    if (focus === 'start' && date instanceof Date && !isNaN(date)) {
      setStartDate(date);
      if (isValid(date) && isValid(endDate) && date > endDate) {
        setEndDate(date);
      }
      setFocus('end');
    } else if (focus === 'end' && date instanceof Date && !isNaN(date)) {
      setEndDate(date);
    }
    if (isValid(startDate) && isValid(endDate)) {
      fetchSalesData(startDate, endDate);
    } else if (isValid(startDate)) {
      fetchSalesData(startDate, startDate);
    } else if (isValid(endDate)) {
      fetchSalesData(endDate, endDate);
    }
    setSelectedRange('custom'); // Automatically switch to custom
  };

  const handleInputChange = (e, type) => {
    const parsedDate = parse(e.target.value, 'MM/dd/yyyy', new Date());
    if (isValid(parsedDate)) {
      if (type === 'start') {
        setStartDate(parsedDate);
        if (isValid(parsedDate) && isValid(endDate) && parsedDate > endDate) {
          setEndDate(parsedDate);
        }
      } else if (type === 'end') {
        setEndDate(parsedDate);
        if (isValid(parsedDate) && isValid(startDate) && parsedDate < startDate) {
          setStartDate(parsedDate);
        }
      }
      fetchSalesData(startDate, endDate);
      setSelectedRange('custom'); // Automatically switch to custom
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
      <div className="relative inline-block text-left w-full md:w-auto" ref={dropdownRef}>
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
      <div className="relative inline-block text-left w-full md:w-auto" ref={calendarRef}>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={toggleCalendar}
        >
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="text-gray-900">
            {isValid(startDate) && isValid(endDate) ? `${format(startDate, 'MMM d')}–${format(endDate, 'MMM d')}` : 'Select Date'}
          </span>
        </button>
        {calendarOpen && (
          <div className="absolute z-10 mt-2 bg-white p-4 rounded-md shadow-lg">
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={isValid(startDate) ? format(startDate, 'MM/dd/yyyy') : ''}
                onFocus={() => setFocus('start')}
                onChange={(e) => handleInputChange(e, 'start')}
                className={`border rounded-md px-3 py-2 w-full ${focus === 'start' ? 'border-blue-500' : 'border-gray-300'}`}
                placeholder="Start Date"
              />
              <span className="text-gray-900">to</span>
              <input
                type="text"
                value={isValid(endDate) ? format(endDate, 'MM/dd/yyyy') : ''}
                onFocus={() => setFocus('end')}
                onChange={(e) => handleInputChange(e, 'end')}
                className={`border rounded-md px-3 py-2 w-full ${focus === 'end' ? 'border-blue-500' : 'border-gray-300'}`}
                placeholder="End Date"
              />
            </div>
            <DatePicker
              selected={focus === 'start' ? startDate : endDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsStart={focus === 'start'}
              selectsEnd={focus === 'end'}
              inline
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDatePicker;
