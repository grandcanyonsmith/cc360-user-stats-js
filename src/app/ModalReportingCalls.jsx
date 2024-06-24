// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Modal Example</title>
//   <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
//   <style>
//     .hidden { display: none; }
//   </style>
// </head>
// <body>

// <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//   <div class="mx-auto max-w-3xl">
//     <!-- Buttons for Demo Calls -->
//     <div class="mt-4">
//       <h2 class="text-lg font-semibold">Demo Calls</h2>
//       <div id="demo-calls" class="flex flex-wrap gap-4"></div>
//     </div>

//     <!-- Buttons for Onboarding Calls -->
//     <div class="mt-4">
//       <h2 class="text-lg font-semibold">Onboarding Calls</h2>
//       <div id="onboarding-calls" class="flex flex-wrap gap-4"></div>
//     </div>
//   </div>
// </div>

// <!-- Modal -->
// <div id="modal" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//   <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
//   <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
//     <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//       <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
//         <div class="absolute top-0 right-0 pt-4 pr-4">
//           <button id="close-button" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
//             <span class="sr-only">Close</span>
//             <i class="fas fa-times"></i>
//           </button>
//         </div>
//         <div>
//           <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
//             <i class="fas fa-check text-green-600"></i>
//           </div>
//           <div class="mt-3 text-center sm:mt-5">
//             <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Report</h3>
//             <div class="mt-2">
//               <p class="text-sm text-gray-500">Please fill out the details below.</p>
//             </div>
//           </div>
//         </div>
//         <div class="mt-5 sm:mt-6">
//           <!-- Appointment Status Dropdown -->
//           <div class="sm:col-span-3 mb-4">
//             <label for="status" class="block text-sm font-medium leading-6 text-gray-900">Appointment Status</label>
//             <div class="mt-2 relative inline-block text-left w-full">
//               <div>
//                 <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="status-button" aria-expanded="true" aria-haspopup="true">
//                   Appointment Status
//                   <i class="fas fa-chevron-down"></i>
//                 </button>
//               </div>
//               <div id="status-menu" class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="status-button" tabindex="-1">
//                 <div class="py-1" role="none">
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="status-completed">Completed</a>
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="status-no-show">No Show</a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!-- Who Completed This Call Dropdown -->
//           <div class="sm:col-span-3 mb-4">
//             <label for="who" class="block text-sm font-medium leading-6 text-gray-900">Who completed this call</label>
//             <div class="mt-2 relative inline-block text-left w-full">
//               <div>
//                 <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="who-button" aria-expanded="true" aria-haspopup="true">
//                   Who completed this call
//                   <i class="fas fa-chevron-down"></i>
//                 </button>
//               </div>
//               <div id="who-menu" class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical" aria-labelledby="who-button" tabindex="-1">
//                 <div class="py-1" role="none">
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="who-ken">Ken</a>
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="who-james">James</a>
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="who-hamza">Hamza</a>
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="who-levi">Levi</a>
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="who-canyon">Canyon</a>
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="who-stockton">Stockton</a>
//                   <a href="#" class="group flex items-center px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="who-jack">Jack</a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!-- Zoom Recording URL Input -->
//           <div class="mb-4">
//             <label for="zoom-url" class="block text-sm font-medium leading-6 text-gray-900">Zoom Recording URL (Optional)</label>
//             <div class="mt-2">
//               <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-600 sm:max-w-md">
//                 <input type="text" name="zoom-url" id="zoom-url" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Enter URL">
//               </div>
//             </div>
//           </div>

//           <!-- Buttons -->
//           <div class="sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
//             <button id="submit-button" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2">Submit</button>
//             <button id="cancel-button" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

// <script>
// document.addEventListener('DOMContentLoaded', function() {
//   var modal = document.getElementById('modal');
//   var statusButton = document.getElementById('status-button');
//   var statusMenu = document.getElementById('status-menu');
//   var whoButton = document.getElementById('who-button');
//   var whoMenu = document.getElementById('who-menu');
//   var submitButton = document.getElementById('submit-button');
//   var cancelButton = document.getElementById('cancel-button');
//   var closeButton = document.getElementById('close-button');
//   var zoomUrlInput = document.getElementById('zoom-url');

//   var selectedStatus = '';
//   var selectedWho = '';

//   var data = [
//     {
//       location_name: "Nelson Martinez's Account",
//       demo_call: {
//         appointment_time: "2024-06-28 13:00:00",
//         scheduled_call: true,
//         call_status: 'unknown',
//         employee_name: '',
//         zoom_url: ''
//       },
//       onboarding_call: {
//         appointment_time: null,
//         scheduled_call: false,
//         call_status: 'unknown',
//         employee_name: '',
//         zoom_url: ''
//       }
//     },
//     {
//       location_name: "Mande John's Account",
//       demo_call: {
//         appointment_time: "2024-06-24 12:00:00",
//         scheduled_call: true,
//         call_status: 'completed',
//         employee_name: 'Ken',
//         zoom_url: 'https://zoom.us/recording1'
//       },
//       onboarding_call: {
//         appointment_time: null,
//         scheduled_call: false,
//         call_status: 'unknown',
//         employee_name: '',
//         zoom_url: ''
//       }
//     },
//     {
//       location_name: "Tobias Steinherr's Account",
//       demo_call: {
//         appointment_time: "2024-06-24 12:00:00",
//         scheduled_call: true,
//         call_status: 'unknown',
//         employee_name: '',
//         zoom_url: ''
//       },
//       onboarding_call: {
//         appointment_time: null,
//         scheduled_call: false,
//         call_status: 'unknown',
//         employee_name: '',
//         zoom_url: ''
//       }
//     }
//   ];

//   var demoCallsContainer = document.getElementById('demo-calls');
//   var onboardingCallsContainer = document.getElementById('onboarding-calls');

//   data.forEach(function(account, index) {
//     // Demo Calls
//     var demoCallButton = document.createElement('button');
//     demoCallButton.className = 'inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
//     demoCallButton.textContent = account.demo_call.call_status === 'unknown' ? 'Report' : (account.demo_call.call_status === 'completed' ? 'Yes' : 'No');
//     demoCallButton.disabled = account.demo_call.call_status !== 'unknown';

//     if (account.demo_call.call_status === 'unknown') {
//       demoCallButton.classList.add('bg-yellow-100', 'border', 'border-yellow-600', 'text-yellow-900', 'hover:bg-yellow-200', 'focus:ring-yellow-600');
//     } else if (account.demo_call.call_status === 'completed') {
//       demoCallButton.classList.add('bg-green-100', 'border', 'border-green-600', 'text-green-900');
//     } else {
//       demoCallButton.classList.add('bg-red-100', 'border', 'border-red-600', 'text-red-900');
//     }

//     demoCallButton.dataset.index = index;
//     demoCallButton.dataset.type = 'demo';
//     demoCallsContainer.appendChild(demoCallButton);

//     // Onboarding Calls
//     var onboardingCallButton = document.createElement('button');
//     onboardingCallButton.className = 'inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
//     onboardingCallButton.textContent = account.onboarding_call.call_status === 'unknown' ? 'Report' : (account.onboarding_call.call_status === 'completed' ? 'Yes' : 'No');
//     onboardingCallButton.disabled = account.onboarding_call.call_status !== 'unknown';

//     if (account.onboarding_call.call_status === 'unknown') {
//       onboardingCallButton.classList.add('bg-yellow-100', 'border', 'border-yellow-600', 'text-yellow-900', 'hover:bg-yellow-200', 'focus:ring-yellow-600');
//     } else if (account.onboarding_call.call_status === 'completed') {
//       onboardingCallButton.classList.add('bg-green-100', 'border', 'border-green-600', 'text-green-900');
//     } else {
//       onboardingCallButton.classList.add('bg-red-100', 'border', 'border-red-600', 'text-red-900');
//     }

//     onboardingCallButton.dataset.index = index;
//     onboardingCallButton.dataset.type = 'onboarding';
//     onboardingCallsContainer.appendChild(onboardingCallButton);
//   });

//   document.querySelectorAll('button[data-type="demo"], button[data-type="onboarding"]').forEach(function(button) {
//     button.addEventListener('click', function(e) {
//       var index = e.target.dataset.index;
//       var type = e.target.dataset.type;
//       selectedStatus = '';
//       selectedWho = '';
//       zoomUrlInput.value = '';

//       statusButton.innerHTML = 'Appointment Status <i class="fas fa-chevron-down"></i>';
//       whoButton.innerHTML = 'Who completed this call <i class="fas fa-chevron-down"></i>';

//       submitButton.dataset.index = index;
//       submitButton.dataset.type = type;
//       modal.classList.remove('hidden');
//     });
//   });

//   statusButton.addEventListener('click', function() {
//     statusMenu.classList.toggle('hidden');
//   });

//   whoButton.addEventListener('click', function() {
//     whoMenu.classList.toggle('hidden');
//   });

//   statusMenu.querySelectorAll('a').forEach(function(item) {
//     item.addEventListener('click', function(e) {
//       e.preventDefault();
//       selectedStatus = item.textContent.trim();
//       statusButton.innerHTML = selectedStatus + ' <i class="fas fa-chevron-down"></i>';
//       statusMenu.classList.add('hidden');
//     });
//   });

//   whoMenu.querySelectorAll('a').forEach(function(item) {
//     item.addEventListener('click', function(e) {
//       e.preventDefault();
//       selectedWho = item.textContent.trim();
//       whoButton.innerHTML = selectedWho + ' <i class="fas fa-chevron-down"></i>';
//       whoMenu.classList.add('hidden');
//     });
//   });

//   submitButton.addEventListener('click', function() {
//     if (!selectedStatus || !selectedWho) {
//       alert('Please fill out all required fields.');
//       return;
//     }

//     var index = submitButton.dataset.index;
//     var type = submitButton.dataset.type;

//     data[index][type + '_call'].call_status = selectedStatus.toLowerCase();
//     data[index][type + '_call'].employee_name = selectedWho;
//     data[index][type + '_call'].zoom_url = zoomUrlInput.value;

//     console.log(data[index]);

//     submitButton.textContent = 'Submitting...';

//     setTimeout(function() {
//       modal.classList.add('hidden');
//       submitButton.textContent = 'Submit';

//       var button = document.querySelector('button[data-index="' + index + '"][data-type="' + type + '"]');
//       button.textContent = selectedStatus === 'Completed' ? 'Yes' : 'No';
//       button.disabled = true;
//       button.classList.remove('bg-yellow-100', 'border-yellow-600', 'text-yellow-900', 'hover:bg-yellow-200', 'focus:ring-yellow-600');
//       button.classList.add(selectedStatus === 'Completed' ? 'bg-green-100' : 'bg-red-100', selectedStatus === 'Completed' ? 'border-green-600' : 'border-red-600', selectedStatus === 'Completed' ? 'text-green-900' : 'text-red-900');

//       statusButton.innerHTML = 'Appointment Status <i class="fas fa-chevron-down"></i>';
//       whoButton.innerHTML = 'Who completed this call <i class="fas fa-chevron-down"></i>';
//       zoomUrlInput.value = '';
//       selectedStatus = '';
//       selectedWho = '';
//     }, 1000);
//   });

//   cancelButton.addEventListener('click', function() {
//     modal.classList.add('hidden');
//   });

//   closeButton.addEventListener('click', function() {
//     modal.classList.add('hidden');
//   });
// });
// </script>

// </body>
// </html>


