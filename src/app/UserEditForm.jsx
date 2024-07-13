
import React, { useState } from 'react';
import axios from 'axios';

const UserEditForm = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e, nestedKey = null) => {
    const { name, value, type, checked } = e.target;
    if (nestedKey) {
      setFormData({
        ...formData,
        [nestedKey]: {
          ...formData[nestedKey],
          [name]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://your-api-endpoint', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const renderFields = (data, nestedKey = null) => {
    return Object.keys(data).map((key) => {
      const value = data[key];
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{key}</h3>
            {renderFields(value, key)}
          </div>
        );
      }
      return (
        <div key={key} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
            {key}
          </label>
          {typeof value === 'boolean' ? (
            <input
              type="checkbox"
              name={key}
              checked={value}
              onChange={(e) => handleChange(e, nestedKey)}
              className="mr-2 leading-tight"
            />
          ) : (
            <input
              type="text"
              name={key}
              value={value}
              onChange={(e) => handleChange(e, nestedKey)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg mx-4 my-8 overflow-y-auto max-h-full">
        <h2 className="text-xl mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          {renderFields(formData)}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditForm;