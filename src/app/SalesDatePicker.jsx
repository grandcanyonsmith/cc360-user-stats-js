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


// stat card
// <div class="⚙   asab as12 as3 ⚙v9783b"><div class="db-chrome-fill ⚙  as12 as3 ⚙1n08mni"><div class="⚙ rs0 rs2 asz as8i as11 asa0 as7 ⚙131gqfr"><div class="⚙ rs0 as15 as6j as1s asaz asb0 asb1 as8b asb2 asb3 asb4 asb5 ⚙xha511"><div class="⚙ rs0 asz as5y as8f ⚙1faltl2"><div class="⚙ rs2 rs0 asb6 as1b as15 as1s as6i ⚙utlgcl"><span class="⚙">MRR</span><span class="⚙  asb7 asb8 asb9 ⚙mwdan0"><a tabindex="0" role="button" class="⚙ rs1 rs2 rsq as1p as1q as1r as3l as7k asba asbb asbc asbd asbe asbf asbg asbh asbi ⚙6m7vms" style="isolation: isolate;"><svg aria-hidden="false" aria-label="Info" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="⚙   as18 as19 as1a as1b as1c as68 as69 asbj ⚙fe4c0r"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 1.75h-5.5a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h5.5a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-1.5-1.5ZM3.25.25a3 3 0 0 0-3 3v5.5a3 3 0 0 0 3 3h5.5a3 3 0 0 0 3-3v-5.5a3 3 0 0 0-3-3h-5.5Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.482 6.5a.7.7 0 0 1 .7-.7h1.09a.7.7 0 0 1 .7.7v2a.7.7 0 1 1-1.4 0V7.2h-.39a.7.7 0 0 1-.7-.7Z"></path><path d="M5 4a1.001 1.001 0 0 1 2 0 1.001 1.001 0 0 1-2 0Z"></path></svg></a></span><span class="⚙  asb7 asbk ⚙m91mty"><span class="⚙ rs2 rs0 as18 as19 asc3 asa1 as1b asc4 as5y asc5 asc6 asc7 asc8 as15 as1t asc9 asca ascb ascc ascd ⚙l2s398">+12.8%</span></span></div><div class="⚙ as63 as1c ⚙1s7spu4"><div class="⚙ rs0 as15 asbl asaz as29 ⚙1ltf9on"><div data-testid="line-chart-summary-item-0" class="⚙ rs2 asce ascf as7 as1d ⚙vr5cph" title="$122,342.99">$122.3K</div><div data-testid="line-chart-summary-item-1" class="⚙ rs2 asa0 as63 ⚙13de05n" title="$108,463.99">$108.5K previous month</div></div></div></div></div><div class="⚙ rs0 asz as29 as6 ⚙1rc52zb"><div class="⚙ asbn ⚙1ywgu12"><div class="⚙"><div class="⚙ rs0 as8k asz as29 asbo asbp ⚙1ffpc"><div class="bento_line_chart_content ⚙  asbq as7q as3 as12 as8l asbs asbt asbu ⚙7xapyo"><figure data-testid="lineChart" class="sn-pcwvyt"><div class="sn-1kqq559 sn-129n2w1" style="--chart-height: 188px; --chart-width: 393.984375px; --chart-bottom: 20px; --chart-left: 40px; --chart-right: 20px; --chart-top: 16px;"><canvas class="sn-16izms4" width="787" height="376"></canvas><svg class="sn-1sq1xev sn-16kva33" viewBox="0 0 393.984375 188"><g transform="translate(0, 168)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle"><g class="tick" opacity="1" transform="translate(40,0)"><line stroke="currentColor" y2="0"></line><text fill="currentColor" y="10" dy="0.71em" text-anchor="start" style="font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">Jun 1</text></g><g class="tick" opacity="1" transform="translate(373.984375,0)"><line stroke="currentColor" y2="0"></line><text fill="currentColor" y="10" dy="0.71em" text-anchor="end" style="font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">Today</text></g></g><g transform="translate(0, -7)" fill="none" font-size="10" font-family="sans-serif" text-anchor="start"><g class="tick" opacity="1" transform="translate(0,168)"><line stroke="currentColor" x2="0"></line><text fill="currentColor" x="0" dy="0.32em" style="font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">$0.00</text></g><g class="tick" opacity="1" transform="translate(0,16)"><line stroke="currentColor" x2="0"></line><text fill="currentColor" x="0" dy="0.32em" style="font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;;">$122.5K</text></g></g></svg></div></figure></div></div><div data-testid="module-footer" class="⚙  asbq asbv asbw asbx as8i ⚙ncgw77"><a href="/billing#mrr" data-bento-action-target="footerLink" tabindex="0" class="⚙ rs1 rs2 rs2 as1p as1q as1r as3l as3m as46 as1z as20 asa1 as29 as2a as6x as6y as6z asa2 as71 as1t ⚙tfmm1x">View more</a><div class="⚙  asbq asbw as29 as75 ascg ⚙xdydsk"><span title="Updated Jun 23" class="⚙ as75 as1t as79 ⚙lrzv64">Updated Jun 23</span></div></div></div></div><div class="⚙ rs0 asm asch as3b asbz as3i asc0 as3c as3e as3f as3d as5z asc1 asc2 as1n as3a asaq as2 as1k as15 as16 as1s as36 ⚙6npupx"></div></div></div></div></div>