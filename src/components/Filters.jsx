import React, { useState, useEffect, useRef } from 'react';

const Filters = ({ onFilterChange, filterState, setIsFilterPanelOpen }) => {
  const closeButtonRef = useRef(null);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    let updatedFilters = { ...filterState };

    if (type === 'checkbox') {
      if (!Array.isArray(updatedFilters[name])) {
        updatedFilters[name] = [];
      }
      if (checked) {
        updatedFilters[name] = [...updatedFilters[name], value];
      } else {
        updatedFilters[name] = updatedFilters[name].filter(item => item !== value);
      }
    } else {
      updatedFilters[name] = value;
    }

    if (name === 'filterStatus') {
      updatedFilters.status = Array.from(document.querySelectorAll('input[name="filterStatus"]:checked')).map(checkbox => checkbox.value);
    }

    onFilterChange(updatedFilters);
  };

  useEffect(() => {
    const closeFilterPanel = () => {
      setIsFilterPanelOpen(false);
    };

    const closeButton = closeButtonRef.current;
    if (closeButton) {
      closeButton.addEventListener('click', closeFilterPanel);
    }

    return () => {
      if (closeButton) {
        closeButton.removeEventListener('click', closeFilterPanel);
      }
    };
  }, [setIsFilterPanelOpen]);

  const renderRadioGroup = (name, options) => (
    <div className="space-y-6">
      {options.map(option => (
        <div className="flex items-center" key={option.value}>
          <input
            id={`${name}${option.value}`}
            name={name}
            value={option.value}
            type="radio"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            checked={filterState[name] === option.value}
            onChange={handleFilterChange}
          />
          <label htmlFor={`${name}${option.value}`} className="ml-3 text-sm text-gray-500">{option.label}</label>
        </div>
      ))}
    </div>
  );

  const renderCheckboxGroup = (name, options) => (
    <div className="space-y-6">
      {options.map(option => (
        <div className="flex items-center" key={option.value}>
          <input
            id={`${name}${option.value}`}
            name={name}
            value={option.value}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            checked={Array.isArray(filterState[name]) && filterState[name].includes(option.value)}
            onChange={handleFilterChange}
          />
          <label htmlFor={`${name}${option.value}`} className="ml-3 text-sm text-gray-500">{option.label}</label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black bg-opacity-25"></div>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-xl">
                <div className="p-6 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <h2 className="text-base font-semibold leading-6 text-gray-900" id="slide-over-title">Filters</h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                        ref={closeButtonRef}
                      >
                        <span className="absolute -inset-2.5"></span>
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <form className="mt-4">
                    {/* Calendar Filter */}
                    <FilterSection title="Calendar">
                      {renderRadioGroup('calendar', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Product Filter */}
                    <FilterSection title="Product">
                      {renderRadioGroup('product', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* First Transaction Filter */}
                    <FilterSection title="First Transaction">
                      {renderRadioGroup('firstTransaction', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Mailgun Connected Filter */}
                    <FilterSection title="Mailgun Connected">
                      {renderRadioGroup('mailgun', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Status Filter */}
                    <FilterSection title="Status">
                      {renderCheckboxGroup('status', [
                        { value: 'active', label: 'Active' },
                        { value: 'trialing', label: 'Trialing' },
                        { value: 'past_due', label: 'Past Due' },
                        { value: 'canceled', label: 'Canceled' },
                        { value: 'Unknown', label: 'Unknown' },
                      ])}
                    </FilterSection>
                    {/* Payment Processor Integration Filter */}
                    <FilterSection title="Payment Processor Integration">
                      {renderRadioGroup('paymentProcessor', [
                        { value: 'all', label: 'All' },
                        { value: 'True', label: 'True' },
                        { value: 'False', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Demo Scheduled Filter */}
                    <FilterSection title="Demo Scheduled">
                      {renderRadioGroup('demoScheduled', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Onboarding Scheduled Filter */}
                    <FilterSection title="Onboarding Scheduled">
                      {renderRadioGroup('onboardingScheduled', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Demo Call Completed Filter */}
                    <FilterSection title="Demo Call Completed">
                      {renderRadioGroup('demoCompleted', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Onboarding Call Completed Filter */}
                    <FilterSection title="Onboarding Call Completed">
                      {renderRadioGroup('onboardingCompleted', [
                        { value: 'all', label: 'All' },
                        { value: 'true', label: 'True' },
                        { value: 'false', label: 'False' },
                      ])}
                    </FilterSection>
                    {/* Plan Filter */}
                    <FilterSection title="Plan">
                      {renderRadioGroup('plan', [
                        { value: 'all', label: 'All' },
                        { value: 'platinum', label: 'Platinum ($1500)' },
                        { value: 'prod_PpFYdvqmj38F2I', label: 'Elite ($297)' },
                        { value: 'prod_PpFXqy79vlGOIE', label: 'Premium ($147)' },
                        { value: 'prod_OvDkzhKINbc38T', label: 'Starter ($97)' },
                        { value: 'prod_M6Iy3zjRHbDmm8', label: 'Basic ($47)' },
                      ])}
                    </FilterSection>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, children }) => (
  <div className="border-t border-gray-200 px-4 py-6">
    <h3 className="-mx-2 -my-3 flow-root">
      <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
        <span className="font-medium text-gray-900">{title}</span>
        <span className="ml-6 flex items-center">
          <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
    </h3>
    <div className="pt-6">
      {children}
    </div>
  </div>
);

export default Filters;