import React, { useEffect, useRef } from 'react';

export function Filters({ onFilterChange, users, filterState, setIsFilterPanelOpen }) {
    const closeButtonRef = useRef(null);

    const handleFilterChange = () => {
        const filters = {
            calendar: document.querySelector('input[name="filterCalendar"]:checked').value,
            product: document.querySelector('input[name="filterProduct"]:checked').value,
            firstTransaction: document.querySelector('input[name="filterFirstTransaction"]:checked').value,
            mailgun: document.querySelector('input[name="filterMailgun"]:checked').value,
            paymentProcessor: document.querySelector('input[name="filterPaymentProcessor"]:checked').value,
            demoCompleted: document.querySelector('input[name="filterDemoCompleted"]:checked').value,
            onboardingCompleted: document.querySelector('input[name="filterOnboardingCompleted"]:checked').value,
            plan: document.querySelector('input[name="filterPlan"]:checked').value,
            status: Array.from(document.querySelectorAll('input[name="filterStatus"]:checked')).map(checkbox => checkbox.value)
        };

        const filteredUsers = users.filter(user => {
            const statusMatch = filters.status.includes(user.account_status);
            const planMatch = filters.plan === 'all' || filters.plan === user.product_id;
            return (filters.calendar === 'all' || (filters.calendar === 'true' && user.total_calendars > 0) || (filters.calendar === 'false' && user.total_calendars === 0)) &&
                (filters.product === 'all' || (filters.product === 'true' && user.total_products > 0) || (filters.product === 'false' && user.total_products === 0)) &&
                (filters.firstTransaction === 'all' || (filters.firstTransaction === 'true' && user.has_had_first_transaction) || (filters.firstTransaction === 'false' && !user.has_had_first_transaction)) &&
                (filters.mailgun === 'all' || (filters.mailgun === 'true' && user.mailgun_connected) || (filters.mailgun === 'false' && !user.mailgun_connected)) &&
                (filters.paymentProcessor === 'all' || (filters.paymentProcessor === 'True' && user.payment_processor_integration) || (filters.paymentProcessor === 'False' && !user.payment_processor_integration)) &&
                (filters.demoCompleted === 'all' || (filters.demoCompleted === 'true' && user.demo_call) || (filters.demoCompleted === 'false' && !user.demo_call)) &&
                (filters.onboardingCompleted === 'all' || (filters.onboardingCompleted === 'true' && user.onboarding_call) || (filters.onboardingCompleted === 'false' && !user.onboarding_call)) &&
                planMatch &&
                statusMatch;
        });

        onFilterChange(filters);
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

    return (
        <div className="relative z-40 sm:hidden" role="dialog" id="filterPanel" aria-modal="true" style={{ display: 'block' }}>
            <div className="fixed inset-0 bg-black bg-opacity-25"></div>
            <div className="fixed inset-0 z-40 flex">
                <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <button
                            type="button"
                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            id="closeFilterPanel"
                            ref={closeButtonRef}
                        >
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <form className="mt-4">
                        {/* Calendar Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-0" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Calendar</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-0">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterCalendarAll" name="filterCalendar" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.calendar === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterCalendarAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterCalendarTrue" name="filterCalendar" value="true" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.calendar === 'true'} onChange={handleFilterChange} />
                                        <label htmlFor="filterCalendarTrue" className="ml-3 text-sm text-gray-500">True</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterCalendarFalse" name="filterCalendar" value="false" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.calendar === 'false'} onChange={handleFilterChange} />
                                        <label htmlFor="filterCalendarFalse" className="ml-3 text-sm text-gray-500">False</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Product Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-1" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Product</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-1">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterProductAll" name="filterProduct" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.product === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterProductAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterProductTrue" name="filterProduct" value="true" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.product === 'true'} onChange={handleFilterChange} />
                                        <label htmlFor="filterProductTrue" className="ml-3 text-sm text-gray-500">True</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterProductFalse" name="filterProduct" value="false" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.product === 'false'} onChange={handleFilterChange} />
                                        <label htmlFor="filterProductFalse" className="ml-3 text-sm text-gray-500">False</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* First Transaction Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-2" aria-expanded="false">
                                    <span className="font-medium text-gray-900">First Transaction</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-2">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterFirstTransactionAll" name="filterFirstTransaction" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.firstTransaction === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterFirstTransactionAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterFirstTransactionTrue" name="filterFirstTransaction" value="true" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.firstTransaction === 'true'} onChange={handleFilterChange} />
                                        <label htmlFor="filterFirstTransactionTrue" className="ml-3 text-sm text-gray-500">True</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterFirstTransactionFalse" name="filterFirstTransaction" value="false" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.firstTransaction === 'false'} onChange={handleFilterChange} />
                                        <label htmlFor="filterFirstTransactionFalse" className="ml-3 text-sm text-gray-500">False</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Mailgun Connected Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-3" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Mailgun Connected</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-3">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterMailgunAll" name="filterMailgun" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.mailgun === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterMailgunAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterMailgunTrue" name="filterMailgun" value="true" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.mailgun === 'true'} onChange={handleFilterChange} />
                                        <label htmlFor="filterMailgunTrue" className="ml-3 text-sm text-gray-500">True</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterMailgunFalse" name="filterMailgun" value="false" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.mailgun === 'false'} onChange={handleFilterChange} />
                                        <label htmlFor="filterMailgunFalse" className="ml-3 text-sm text-gray-500">False</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Status Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-4" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Status</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-4">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterStatusAll" name="filterStatus" value="all" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.status.includes('all')} onChange={handleFilterChange} />
                                        <label htmlFor="filterStatusAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                    <input id="filterStatusActive" name="filterStatus" value="active" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo" checked={filterState.status.includes('active')} onChange={handleFilterChange} />
                                    <label htmlFor="filterStatusActive" className="ml-3 text-sm text-gray-500">Active</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterStatusTrialing" name="filterStatus" value="trialing" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.status.includes('trialing')} onChange={handleFilterChange} />
                                        <label htmlFor="filterStatusTrialing" className="ml-3 text-sm text-gray-500">Trialing</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterStatusPastDue" name="filterStatus" value="past_due" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.status.includes('past_due')} onChange={handleFilterChange} />
                                        <label htmlFor="filterStatusPastDue" className="ml-3 text-sm text-gray-500">Past Due</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterStatusCanceled" name="filterStatus" value="canceled" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.status.includes('canceled')} onChange={handleFilterChange} />
                                        <label htmlFor="filterStatusCanceled" className="ml-3 text-sm text-gray-500">Canceled</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterStatusUnknown" name="filterStatus" value="Unknown" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.status.includes('Unknown')} onChange={handleFilterChange} />
                                        <label htmlFor="filterStatusUnknown" className="ml-3 text-sm text-gray-500">Unknown</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Payment Processor Integration Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-5" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Payment Processor Integration</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-5">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterPaymentProcessorAll" name="filterPaymentProcessor" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.paymentProcessor === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterPaymentProcessorAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterPaymentProcessorTrue" name="filterPaymentProcessor" value="True" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.paymentProcessor === 'True'} onChange={handleFilterChange} />
                                        <label htmlFor="filterPaymentProcessorTrue" className="ml-3 text-sm text-gray-500">True</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterPaymentProcessorFalse" name="filterPaymentProcessor" value="False" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.paymentProcessor === 'False'} onChange={handleFilterChange} />
                                        <label htmlFor="filterPaymentProcessorFalse" className="ml-3 text-sm text-gray-500">False</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Demo Completed Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-6" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Demo Completed</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-6">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterDemoCompletedAll" name="filterDemoCompleted" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.demoCompleted === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterDemoCompletedAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterDemoCompletedTrue" name="filterDemoCompleted" value="true" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.demoCompleted === 'true'} onChange={handleFilterChange} />
                                        <label htmlFor="filterDemoCompletedTrue" className="ml-3 text-sm text-gray-500">True</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterDemoCompletedFalse" name="filterDemoCompleted" value="false" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.demoCompleted === 'false'} onChange={handleFilterChange} />
                                        <label htmlFor="filterDemoCompletedFalse" className="ml-3 text-sm text-gray-500">False</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Onboarding Completed Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-7" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Onboarding Completed</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-7">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterOnboardingCompletedAll" name="filterOnboardingCompleted" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.onboardingCompleted === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterOnboardingCompletedAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterOnboardingCompletedTrue" name="filterOnboardingCompleted" value="true" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.onboardingCompleted === 'true'} onChange={handleFilterChange} />
                                        <label htmlFor="filterOnboardingCompletedTrue" className="ml-3 text-sm text-gray-500">True</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input id="filterOnboardingCompletedFalse" name="filterOnboardingCompleted" value="false" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.onboardingCompleted === 'false'} onChange={handleFilterChange} />
                                        <label htmlFor="filterOnboardingCompletedFalse" className="ml-3 text-sm text-gray-500">False</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Plan Filter */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="-mx-2 -my-3 flow-root">
                                <button type="button" className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400" aria-controls="filter-section-8" aria-expanded="false">
                                    <span className="font-medium text-gray-900">Plan</span>
                                    <span className="ml-6 flex items-center">
                                        <svg className="rotate-0 h-5 w-5 transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                            </h3>
                            <div className="pt-6" id="filter-section-8">
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <input id="filterPlanAll" name="filterPlan" value="all" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.plan === 'all'} onChange={handleFilterChange} />
                                        <label htmlFor="filterPlanAll" className="ml-3 text-sm text-gray-500">All</label>
                                    </div>
                                    <div className="flex items-center">
    <input id="filterPlanPlatinum" name="filterPlan" value="platinum" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.plan === 'platinum'} onChange={handleFilterChange} />
    <label htmlFor="filterPlanPlatinum" className="ml-3 text-sm text-gray-500">Platinum ($1500)</label>
</div>
<div className="flex items-center">
    <input id="filterPlanElite" name="filterPlan" value="prod_PpFYdvqmj38F2I" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.plan === 'prod_PpFYdvqmj38F2I'} onChange={handleFilterChange} />
    <label htmlFor="filterPlanElite" className="ml-3 text-sm text-gray-500">Elite ($297)</label>
</div>
<div className="flex items-center">
    <input id="filterPlanPremium" name="filterPlan" value="prod_PpFXqy79vlGOIE" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.plan === 'prod_PpFXqy79vlGOIE' || filterState.plan === 'prod_PdPwwouLLJod3b' || filterState.plan === 'prod_M6IyZeJydN4vMn'} onChange={handleFilterChange} />
    <label htmlFor="filterPlanPremium" className="ml-3 text-sm text-gray-500">Premium ($147)</label>
</div>
<div className="flex items-center">
    <input id="filterPlanStarter" name="filterPlan" value="prod_OvDkzhKINbc38T" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.plan === 'prod_OvDkzhKINbc38T' || filterState.plan === 'prod_M6IyfUy0ONYSIw'} onChange={handleFilterChange} />
    <label htmlFor="filterPlanStarter" className="ml-3 text-sm text-gray-500">Starter ($97)</label>
</div>
<div className="flex items-center">
    <input id="filterPlanBasic" name="filterPlan" value="prod_M6Iy3zjRHbDmm8" type="radio" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={filterState.plan === 'prod_M6Iy3zjRHbDmm8'} onChange={handleFilterChange} />
    <label htmlFor="filterPlanBasic" className="ml-3 text-sm text-gray-500">Basic ($47)</label>
</div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}