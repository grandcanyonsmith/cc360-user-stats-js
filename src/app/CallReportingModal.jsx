import React, { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

const CallReportingModal = ({ isOpen, onClose, callType, user }) => {
  console.log(callType, 'call type here');
  console.log(user, 'user here');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedWho, setSelectedWho] = useState('');
  const [zoomUrl, setZoomUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [whoDropdownOpen, setWhoDropdownOpen] = useState(false);
  const formatAppointmentTime = (appointmentTime) => {
    if (!appointmentTime) return 'N/A';
    const date = new Date(appointmentTime);
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  const handleSubmit = async () => {
    if (!selectedStatus || !selectedWho) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    const callTypeKey = callType === 'Demo' ? 'demo_call' : callType === 'Onboarding' ? 'onboarding_call' : callType;

    const formData = {
      location_id: user.location_id,
      call_type: callTypeKey,
      completed_call: selectedStatus === 'Completed',
      employee_name: selectedWho,
      zoomUrl: zoomUrl,
    };

    console.log(formData, 'form data here');

    try {
      const response = await axios.post('https://d7rlgxm43l4znqhydjb7wbxf5y0lruda.lambda-url.us-west-2.on.aws/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      setSelectedStatus('');
      setSelectedWho('');
      setZoomUrl('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        alert(`Error: ${error.response.data.message || 'An error occurred while submitting the data.'}`);
      } else if (error.request) {
        console.error('Request data:', error.request);
        alert('No response received from the server.');
      } else {
        console.error('Error message:', error.message);
        alert('An error occurred while setting up the request.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  const appointmentTime = callType === 'Onboarding' 
    ? user?.onboarding_call?.appointment_time 
    : user?.demo_call?.appointment_time;

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Report {callType} Call</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Reporting for user: {user?.location_name}</p>
                    <p className="text-sm text-gray-500">Call Time: {formatAppointmentTime(appointmentTime)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-3 sm:pb-4 flex flex-col">
              {/* Appointment Status Dropdown */}
              <div className="relative inline-block text-left mb-4 w-full">
                <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Appointment Status</label>
                <div className="mt-2">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  >
                    {selectedStatus || 'Select Status'}
                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {statusDropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                      <div className="py-1 flex flex-col" role="none">
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-0" onClick={() => { setSelectedStatus('Completed'); setStatusDropdownOpen(false); }}>
                          <CheckIcon className="mr-3 h-5 w-5 text-green-400 group-hover:text-green-500" aria-hidden="true" />
                          Completed
                        </a>
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="menu-item-1" onClick={() => { setSelectedStatus('No Show'); setStatusDropdownOpen(false); }}>
                          <XMarkIcon className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" aria-hidden="true" />
                          No Show
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Who Completed This Call Dropdown */}
              <div className="relative inline-block text-left mb-4 w-full">
                <label htmlFor="who" className="block text-sm font-medium leading-6 text-gray-900">Who completed this call</label>
                <div className="mt-2">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={() => setWhoDropdownOpen(!whoDropdownOpen)}
                  >
                    {selectedWho || 'Select Person'}
                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {whoDropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-40 overflow-y-auto" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                      <div className="py-1 flex flex-col" role="none">
                        {['Ken', 'James', 'Hamza', 'Levi', 'Canyon', 'Stockton', 'Jack'].map((person) => (
                          <a href="#" key={person} className="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id={`menu-item-${person}`} onClick={() => { setSelectedWho(person); setWhoDropdownOpen(false); }}>
                            <img src={`https://via.placeholder.com/20?text=${person[0]}`} alt={person} className="mr-3 h-5 w-5 rounded-full" />
                            {person}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Zoom Recording URL Input */}
              <div className="mb-4">
                <label htmlFor="zoom-url" className="block text-sm font-medium leading-6 text-gray-900">Zoom Recording URL (Optional)</label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">http://</span>
                    <input
                      type="text"
                      id="zoom-url"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="www.example.com"
                      value={zoomUrl}
                      onChange={(e) => setZoomUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="bg-gray-50 px-4 py-3 flex flex-col sm:px-6">
                <button
                  onClick={handleSubmit}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallReportingModal;