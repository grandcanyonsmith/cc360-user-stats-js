import React, { useState } from 'react';

const CallReportingModal = ({ isOpen, onClose, callType, user }) => {
  console.log(callType,'call type here')
  console.log(user,'user here')
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedWho, setSelectedWho] = useState('');
  const [zoomUrl, setZoomUrl] = useState('');

  const handleSubmit = () => {
    
    if (!selectedStatus || !selectedWho) {
      alert('Please fill out all required fields.');
      return;
    }
    const formData = {
      status: selectedStatus,
      who: selectedWho,
      zoomUrl: zoomUrl,
    };
    console.log(formData, 'form data here');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button onClick={onClose} type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span className="sr-only">Close</span>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <i className="fas fa-check text-green-600"></i>
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Report {callType} Call</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Reporting for user: {user?.location_name}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          {/* Appointment Status Dropdown */}
          <div className="sm:col-span-3 mb-4">
            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Appointment Status</label>
            <div className="mt-2 relative inline-block text-left w-full">
              <select
                id="status"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="" disabled>Select Status</option>
                <option value="Completed">Completed</option>
                <option value="No Show">No Show</option>
              </select>
            </div>
          </div>
          {/* Who Completed This Call Dropdown */}
          <div className="sm:col-span-3 mb-4">
            <label htmlFor="who" className="block text-sm font-medium leading-6 text-gray-900">Who completed this call</label>
            <div className="mt-2 relative inline-block text-left w-full">
              <select
                id="who"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                value={selectedWho}
                onChange={(e) => setSelectedWho(e.target.value)}
              >
                <option value="" disabled>Select Person</option>
                <option value="Ken">Ken</option>
                <option value="James">James</option>
                <option value="Hamza">Hamza</option>
                <option value="Levi">Levi</option>
                <option value="Canyon">Canyon</option>
                <option value="Stockton">Stockton</option>
                <option value="Jack">Jack</option>
              </select>
            </div>
          </div>
          {/* Zoom Recording URL Input */}
          <div className="mb-4">
            <label htmlFor="zoom-url" className="block text-sm font-medium leading-6 text-gray-900">Zoom Recording URL (Optional)</label>
            <div className="mt-2">
              <input
                type="text"
                id="zoom-url"
                className="block w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                placeholder="Enter URL"
                value={zoomUrl}
                onChange={(e) => setZoomUrl(e.target.value)}
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              onClick={handleSubmit}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallReportingModal;