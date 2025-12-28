// Get references to DOM elements
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDateInput');
const dueTimeInput = document.getElementById('dueTimeInput');
const prioritySelect = document.getElementById('prioritySelect');
const reminderDateInput = document.getElementById('reminderDateInput');
const reminderTimeInput = document.getElementById('reminderTimeInput');
const notesInput = document.getElementById('notesInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const cancelBtn = document.getElementById('cancelBtn');
const taskListContainer = document.querySelector('.task-list-container');

// Modal elements
const deleteModal = document.getElementById('deleteModal');
const editModal = document.getElementById('editModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Edit modal input fields
const editTaskInput = document.getElementById('editTaskInput');
const editCategorySelect = document.getElementById('editCategorySelect');
const editDueDateInput = document.getElementById('editDueDateInput');
const editDueTimeInput = document.getElementById('editDueTimeInput');
const editPrioritySelect = document.getElementById('editPrioritySelect');
const editReminderDateInput = document.getElementById('editReminderDateInput');
const editReminderTimeInput = document.getElementById('editReminderTimeInput');
const editNotesInput = document.getElementById('editNotesInput');

// Reminder modal elements
const reminderModal = document.getElementById('reminderModal');
const reminderMessage = document.getElementById('reminderMessage');
const reminderOkBtn = document.getElementById('reminderOkBtn');

// PIN modal elements
const pinLoginModal = document.getElementById('pinLoginModal');
const pinSetupModal = document.getElementById('pinSetupModal');
const pinLoginInput = document.getElementById('pinLoginInput');
const pinLoginBtn = document.getElementById('pinLoginBtn');
const pinSetupInput = document.getElementById('pinSetupInput');
const pinConfirmInput = document.getElementById('pinConfirmInput');
const pinSetupBtn = document.getElementById('pinSetupBtn');
const pinSkipBtn = document.getElementById('pinSkipBtn');
const pinError = document.getElementById('pinError');
const pinSetupError = document.getElementById('pinSetupError');

// Settings modal elements
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const changePinBtn = document.getElementById('changePinBtn');
const removePinBtn = document.getElementById('removePinBtn');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');

// API Configuration - Supports both local development and Railway production
// Priority: window.API_BASE_URL (set in index.html) > config.js > auto-detection
const API_BASE_URL = window.API_BASE_URL || 
                      (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 
                      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                        ? 'http://localhost:3000/api'  // Local development
                        : `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/api`); // Same origin

// Log API URL for debugging (helpful to verify which URL is being used)
console.log('API Base URL:', API_BASE_URL);

const USER_ID_KEY = (window.APP_CONFIG && window.APP_CONFIG.USER_ID_KEY) || 'todoUserId';
const PIN_STORAGE_KEY = (window.APP_CONFIG && window.APP_CONFIG.PIN_STORAGE_KEY) || 'todoPin';

// Main container
const mainContainer = document.getElementById('mainContainer');

// Current user ID
let currentUserId = null;

// Variable to track which task is being edited (null if not editing)
let editingTaskId = null;

// Variable to track which task is being deleted
let deletingTaskId = null;

// Set to track which reminders have been shown (to avoid duplicates)
let shownReminders = new Set();

// Interval ID for reminder checking
let reminderCheckInterval = null;

// Function to format date for display
function formatDate(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to format time for display
function formatTime(timeString) {
    if (!timeString) return 'No time';
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Function to format createdAt timestamp for display
function formatCreatedAt(timestamp) {
    if (!timestamp) return 'Unknown';
    
    // Convert timestamp to Date object
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return 'Unknown';
    }
    
    // Format: "Dec 27, 2025 16:00"
    const datePart = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const timePart = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    return `${datePart} ${timePart}`;
}

// Function to get priority weight for sorting (Higher number = higher priority)
function getPriorityWeight(priority) {
    if (priority === 'High') return 3;
    if (priority === 'Medium') return 2;
    if (priority === 'Low') return 1;
    return 0; // No priority
}

// Function to sort tasks by due date, time, and priority
function sortTasksByDueDate(tasks) {
    // Create a copy of the tasks array to avoid modifying the original
    const sortedTasks = [...tasks];
    
    // Sort the tasks
    sortedTasks.sort(function(taskA, taskB) {
        // Get due dates
        const dateA = taskA.dueDate || '';
        const dateB = taskB.dueDate || '';
        
        // If both tasks have dates, compare them
        if (dateA && dateB) {
            // Compare dates (YYYY-MM-DD format can be compared as strings)
            if (dateA !== dateB) {
                return dateA.localeCompare(dateB);
            }
            
            // If dates are the same, compare times
            const timeA = taskA.dueTime || '';
            const timeB = taskB.dueTime || '';
            
            if (timeA && timeB) {
                // Compare times (HH:MM format can be compared as strings)
                if (timeA !== timeB) {
                    return timeA.localeCompare(timeB);
                }
            } else {
                // If one has time and the other doesn't, prioritize the one with time
                if (timeA && !timeB) {
                    return -1; // taskA comes first
                }
                if (!timeA && timeB) {
                    return 1; // taskB comes first
                }
            }
            
            // If dates and times are the same (or both have no time), compare by priority
            const priorityA = getPriorityWeight(taskA.priority || '');
            const priorityB = getPriorityWeight(taskB.priority || '');
            
            // Higher priority comes first (descending order)
            return priorityB - priorityA;
        }
        
        // If one task has a date and the other doesn't, prioritize the one with date
        if (dateA && !dateB) {
            return -1; // taskA comes first
        }
        if (!dateA && dateB) {
            return 1; // taskB comes first
        }
        
        // Neither task has a date, compare by priority
        const priorityA = getPriorityWeight(taskA.priority || '');
        const priorityB = getPriorityWeight(taskB.priority || '');
        
        // Higher priority comes first (descending order)
        return priorityB - priorityA;
    });
    
    return sortedTasks;
}

// API Functions
async function apiRequest(url, options = {}) {
    try {
        const fullUrl = `${API_BASE_URL}${url}`;
        console.log('API Request:', options.method || 'GET', fullUrl, options.body ? JSON.parse(options.body) : '');
        
        const response = await fetch(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('API Error response:', error);
            throw new Error(error.error || 'API request failed');
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        // Add more details for network/CORS errors
        if (error.message === 'Failed to fetch' || error.message.includes('CORS') || error.message.includes('network')) {
            throw new Error(`Network error: Cannot connect to backend at ${API_BASE_URL}. Check if backend is running and CORS is configured.`);
        }
        throw error;
    }
}

// Get current user ID or create one
async function getOrCreateUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);
    
    if (!userId) {
        // Register a new user without PIN
        try {
            const result = await apiRequest('/register', {
                method: 'POST',
                body: JSON.stringify({})
            });
            userId = result.userId.toString();
            localStorage.setItem(USER_ID_KEY, userId);
        } catch (error) {
            console.error('Failed to create user:', error);
            alert('Failed to connect to server. Please make sure the backend is running.');
            return null;
        }
    }
    
    return userId;
}

// Get tasks from API
async function getTasksFromAPI() {
    if (!currentUserId) {
        currentUserId = await getOrCreateUserId();
        if (!currentUserId) {
            console.error('No user ID available');
            return [];
        }
    }
    
    try {
        console.log('Fetching tasks for userId:', currentUserId);
        const tasks = await apiRequest(`/tasks/${currentUserId}`);
        console.log('Tasks fetched:', tasks);
        return tasks || [];
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        alert('Failed to load tasks. Error: ' + error.message);
        return [];
    }
}

// Function to toggle task completion status
async function toggleTaskComplete(taskId) {
    try {
        // Get current task to toggle completed status
        const tasks = await getTasksFromAPI();
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            const updated = await apiRequest(`/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    completed: !task.completed
                })
            });
            
            // Refresh the display
            await displayTasks();
        }
    } catch (error) {
        console.error('Failed to toggle task:', error);
        alert('Failed to update task. Please try again.');
    }
}

// Function to show delete confirmation modal
function showDeleteModal(taskId) {
    deletingTaskId = taskId;
    deleteModal.classList.add('show');
}

// Function to hide delete confirmation modal
function hideDeleteModal() {
    deleteModal.classList.remove('show');
    deletingTaskId = null;
}

// Function to confirm and delete a task
async function confirmDelete() {
    if (deletingTaskId === null) {
        return;
    }
    
    const taskId = deletingTaskId;
    
    try {
        await apiRequest(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        // If we were editing this task, cancel edit mode
        if (editingTaskId === taskId) {
            cancelEdit();
        }
        
        // Hide the modal
        hideDeleteModal();
        
        // Refresh the display
        await displayTasks();
    } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task. Please try again.');
        hideDeleteModal();
    }
}

// Function to delete a task (triggers modal)
function deleteTask(taskId) {
    showDeleteModal(taskId);
}

// Function to cancel edit mode
function cancelEdit() {
    editingTaskId = null;
    addTaskBtn.textContent = 'Add Task';
    cancelBtn.style.display = 'none';
    
    // Clear all input fields
    taskInput.value = '';
    categorySelect.value = '';
    dueDateInput.value = '';
    dueTimeInput.value = '';
    prioritySelect.value = '';
    reminderDateInput.value = '';
    reminderTimeInput.value = '';
    notesInput.value = '';
}

// Function to show edit modal
async function showEditModal(taskId) {
    try {
        const tasks = await getTasksFromAPI();
        const task = tasks.find(t => t.id === taskId);
        
        // If task is found, populate the modal form fields
        if (task) {
            // Set the editing task ID
            editingTaskId = taskId;
            
            // Populate modal input fields with task data
            editTaskInput.value = task.title;
            editCategorySelect.value = task.category || '';
            editDueDateInput.value = task.dueDate || '';
            editDueTimeInput.value = task.dueTime || '';
            editPrioritySelect.value = task.priority || '';
            editReminderDateInput.value = task.reminderDate || '';
            editReminderTimeInput.value = task.reminderTime || '';
            editNotesInput.value = task.notes || '';
            
            // Show the modal
            editModal.classList.add('show');
            
            // Focus on the first input
            editTaskInput.focus();
        }
    } catch (error) {
        console.error('Failed to load task for editing:', error);
        alert('Failed to load task. Please try again.');
    }
}

// Function to hide edit modal
function hideEditModal() {
    editModal.classList.remove('show');
    editingTaskId = null;
    
    // Clear modal input fields
    editTaskInput.value = '';
    editCategorySelect.value = '';
    editDueDateInput.value = '';
    editDueTimeInput.value = '';
    editPrioritySelect.value = '';
    editReminderDateInput.value = '';
    editReminderTimeInput.value = '';
    editNotesInput.value = '';
}

// Function to save edited task
async function saveEditedTask() {
    if (editingTaskId === null) {
        return;
    }
    
    // Get values from modal input fields
    const taskTitle = editTaskInput.value.trim();
    const category = editCategorySelect.value;
    const dueDate = editDueDateInput.value;
    const dueTime = editDueTimeInput.value;
    const priority = editPrioritySelect.value;
    const reminderDate = editReminderDateInput.value;
    const reminderTime = editReminderTimeInput.value;
    const notes = editNotesInput.value.trim();
    
    // Check if task title is not empty
    if (taskTitle === '') {
        alert('Please enter a task name!');
        return;
    }
    
    try {
        await apiRequest(`/tasks/${editingTaskId}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: taskTitle,
                category: category,
                dueDate: dueDate,
                dueTime: dueTime,
                priority: priority,
                reminderDate: reminderDate,
                reminderTime: reminderTime,
                notes: notes
            })
        });
        
        // If reminder changed, remove from shown reminders set
        const reminderKey = `${editingTaskId}-${reminderDate}-${reminderTime}`;
        shownReminders.delete(reminderKey);
        
        // Hide the modal
        hideEditModal();
        
        // Display all tasks (with the updated one)
        await displayTasks();
    } catch (error) {
        console.error('Failed to update task:', error);
        alert('Failed to update task. Please try again.');
    }
}

// Function to edit a task (triggers modal)
async function editTask(taskId) {
    await showEditModal(taskId);
}

// Function to render a single task in the DOM
function renderTask(task) {
    // Create a new task item element
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    
    // Add priority data attribute for glow effects
    if (task.priority) {
        taskItem.setAttribute('data-priority', task.priority);
    }
    
    // Add completed class if task is completed
    if (task.completed) {
        taskItem.classList.add('completed');
    }
    
    // Get priority class for color coding
    const priorityClass = task.priority ? `priority-${task.priority.toLowerCase()}` : '';
    
    // Check if task has an active reminder (reminder time has passed but not too far in the past)
    const hasActiveReminder = checkIfReminderActive(task);
    if (hasActiveReminder) {
        taskItem.classList.add('has-reminder');
    }
    
    // Create task content structure with checkbox and delete button
    taskItem.innerHTML = `
        <div class="task-controls">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
        </div>
        <div class="task-content-wrapper">
            <div class="task-main">
                <div class="task-title-section">
                    <span class="task-title">${task.title}</span>
                    ${task.notes ? `<p class="task-notes">${task.notes}</p>` : ''}
                </div>
                <div class="task-badges">
                    <span class="task-category">${task.category || 'No category'}</span>
                    ${task.priority ? `<span class="task-priority ${priorityClass}">${task.priority}</span>` : ''}
                </div>
            </div>
            <div class="task-details">
                <span class="task-made">📝 Made: ${formatCreatedAt(task.createdAt)}</span>
                <span class="task-due">📅 Due: ${formatDate(task.dueDate)} ${formatTime(task.dueTime) !== 'No time' ? 'at ' + formatTime(task.dueTime) : ''}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    
    // Get references to the checkbox, edit button, and delete button
    const checkbox = taskItem.querySelector('.task-checkbox');
    const editBtn = taskItem.querySelector('.edit-btn');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    
    // Add event listener to checkbox
    checkbox.addEventListener('change', function() {
        toggleTaskComplete(task.id);
    });
    
    // Add event listener to edit button
    editBtn.addEventListener('click', function() {
        editTask(task.id);
    });
    
    // Add event listener to delete button
    deleteBtn.addEventListener('click', function() {
        deleteTask(task.id);
    });
    
    // Add the task item to the task list container
    taskListContainer.appendChild(taskItem);
}

// Function to display all tasks from the array
async function displayTasks() {
    // Clear the task list container first
    taskListContainer.innerHTML = '';
    
    // Get all tasks from API
    let tasks = await getTasksFromAPI();
    
    console.log('Displaying tasks:', tasks);
    
    if (tasks.length === 0) {
        console.log('No tasks found');
    }
    
    // Sort tasks by due date and time (earliest first)
    tasks = sortTasksByDueDate(tasks);
    
    // Display each task
    tasks.forEach(function(task) {
        renderTask(task);
    });
}

// Function to add a new task
async function addTask() {
    // Get the task title, category, due date, due time, priority, reminder, and notes from input fields
    const taskTitle = taskInput.value.trim();
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;
    const dueTime = dueTimeInput.value;
    const priority = prioritySelect.value;
    const reminderDate = reminderDateInput.value;
    const reminderTime = reminderTimeInput.value;
    const notes = notesInput.value.trim();
    
    // Check if task title is not empty
    if (taskTitle === '') {
        alert('Please enter a task name!');
        return;
    }
    
    // Ensure we have a user ID
    if (!currentUserId) {
        currentUserId = await getOrCreateUserId();
        if (!currentUserId) {
            alert('Failed to connect to server. Please make sure the backend is running.');
            return;
        }
    }
    
    try {
        console.log('Creating task with userId:', currentUserId);
        const taskData = {
            userId: currentUserId,
            title: taskTitle,
            category: category,
            dueDate: dueDate,
            dueTime: dueTime,
            priority: priority,
            reminderDate: reminderDate,
            reminderTime: reminderTime,
            notes: notes,
            completed: false
        };
        console.log('Task data:', taskData);
        
        const result = await apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
        
        console.log('Task created:', result);
        
        // Display all tasks (including the new one)
        await displayTasks();
        
        // Clear all input fields
        taskInput.value = '';
        categorySelect.value = '';
        dueDateInput.value = '';
        dueTimeInput.value = '';
        prioritySelect.value = '';
        reminderDateInput.value = '';
        reminderTimeInput.value = '';
        notesInput.value = '';
    } catch (error) {
        console.error('Failed to create task:', error);
        const errorMsg = API_BASE_URL.includes('localhost') 
            ? 'Failed to create task. Please make sure the backend is running on http://localhost:3000'
            : 'Failed to create task. Please check your backend connection.';
        alert(errorMsg);
    }
}

// Add event listener to the "Add Task" button
addTaskBtn.addEventListener('click', addTask);

// Add event listener to the "Cancel" button
cancelBtn.addEventListener('click', cancelEdit);

// Allow adding task by pressing Enter key in the input field
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Delete modal event listeners
confirmDeleteBtn.addEventListener('click', confirmDelete);
cancelDeleteBtn.addEventListener('click', hideDeleteModal);

// Close delete modal when clicking overlay
deleteModal.querySelector('.modal-overlay').addEventListener('click', hideDeleteModal);

// Edit modal event listeners
saveEditBtn.addEventListener('click', saveEditedTask);
cancelEditBtn.addEventListener('click', hideEditModal);

// Close edit modal when clicking overlay
editModal.querySelector('.modal-overlay').addEventListener('click', hideEditModal);

// Allow saving edited task by pressing Enter key in the edit modal input
editTaskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        saveEditedTask();
    }
});

// Function to check if a reminder time has been reached
function checkIfReminderActive(task) {
    // If task is completed, no reminder needed
    if (task.completed) {
        return false;
    }
    
    // If no reminder date/time set, no reminder
    if (!task.reminderDate || !task.reminderTime) {
        return false;
    }
    
    // Get current date and time
    const now = new Date();
    
    // Combine reminder date and time
    const reminderDateTime = new Date(`${task.reminderDate}T${task.reminderTime}`);
    
    // Check if reminder time has passed (within last 24 hours to show as active)
    const timeDiff = now - reminderDateTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // Reminder is active if it's been triggered (past) but not more than 24 hours ago
    if (timeDiff >= 0 && hoursDiff <= 24) {
        return true;
    }
    
    return false;
}

// Function to check all tasks for reminders
async function checkReminders() {
    const tasks = await getTasksFromAPI();
    const now = new Date();
    
    tasks.forEach(function(task) {
        // Skip if task is completed or has no reminder
        if (task.completed || !task.reminderDate || !task.reminderTime) {
            return;
        }
        
        // Create reminder datetime
        const reminderDateTime = new Date(`${task.reminderDate}T${task.reminderTime}`);
        const reminderKey = `${task.id}-${task.reminderDate}-${task.reminderTime}`;
        
        // Check if reminder time has been reached and not shown yet
        if (now >= reminderDateTime && !shownReminders.has(reminderKey)) {
            // Mark as shown
            shownReminders.add(reminderKey);
            
            // Show notification
            showReminderNotification(task);
            
            // Refresh display to highlight the task
            displayTasks();
        }
    });
}

// Function to show reminder notification
function showReminderNotification(task) {
    // Set the reminder message
    const dueDateText = task.dueDate ? formatDate(task.dueDate) : 'No due date';
    const dueTimeText = task.dueTime ? formatTime(task.dueTime) : 'No due time';
    reminderMessage.textContent = `Reminder: "${task.title}"\nDue: ${dueDateText} at ${dueTimeText}`;
    
    // Show the modal
    reminderModal.classList.add('show');
}

// Function to hide reminder notification
function hideReminderNotification() {
    reminderModal.classList.remove('show');
}

// Start checking for reminders every minute
function startReminderChecking() {
    // Check immediately on load
    checkReminders();
    
    // Then check every minute
    reminderCheckInterval = setInterval(function() {
        checkReminders();
    }, 60000); // 60000 milliseconds = 1 minute
}

// Event listener for reminder modal OK button
reminderOkBtn.addEventListener('click', hideReminderNotification);

// Close reminder modal when clicking overlay
reminderModal.querySelector('.modal-overlay').addEventListener('click', hideReminderNotification);

// PIN Functions
function getPin() {
    return localStorage.getItem(PIN_STORAGE_KEY);
}

function setPin(pin) {
    localStorage.setItem(PIN_STORAGE_KEY, pin);
}

function removePin() {
    localStorage.removeItem(PIN_STORAGE_KEY);
}

async function verifyPin(enteredPin) {
    try {
        const result = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ pin: enteredPin })
        });
        
        if (result.userId) {
            currentUserId = result.userId.toString();
            localStorage.setItem(USER_ID_KEY, currentUserId);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

function isValidPin(pin) {
    return /^\d{4}$/.test(pin);
}

async function showMainApp() {
    mainContainer.style.display = 'block';
    pinLoginModal.classList.remove('show');
    pinSetupModal.classList.remove('show');
    await displayTasks();
    startReminderChecking();
}

function showPinLogin() {
    pinLoginModal.classList.add('show');
    pinLoginInput.value = '';
    pinError.style.display = 'none';
    pinLoginInput.focus();
}

function hidePinLogin() {
    pinLoginModal.classList.remove('show');
    pinError.style.display = 'none';
}

function showPinSetup() {
    pinSetupModal.classList.add('show');
    pinSetupInput.value = '';
    pinConfirmInput.value = '';
    pinSetupError.style.display = 'none';
    pinSetupInput.focus();
}

function hidePinSetup() {
    pinSetupModal.classList.remove('show');
    pinSetupError.style.display = 'none';
}

async function handlePinLogin() {
    const enteredPin = pinLoginInput.value;
    
    if (!isValidPin(enteredPin)) {
        pinError.textContent = 'Please enter a valid 4-digit PIN';
        pinError.style.display = 'block';
        pinLoginInput.value = '';
        pinLoginInput.focus();
        return;
    }
    
    try {
        if (await verifyPin(enteredPin)) {
            showMainApp();
        } else {
            pinError.textContent = 'PIN not found. Would you like to create a new account?';
            pinError.style.display = 'block';
            // Option: Clear stored PIN and show setup modal
            // Or just show error and let them try again
        }
    } catch (error) {
        // If PIN doesn't exist, offer to create new account
        if (error.message.includes('Invalid PIN')) {
            pinError.textContent = 'PIN not found. Click "Skip" below to create a new account without PIN, or close this modal to set up a new PIN.';
            pinError.style.display = 'block';
        } else {
            pinError.textContent = 'Login failed. Please try again.';
            pinError.style.display = 'block';
        }
        pinLoginInput.value = '';
        pinLoginInput.focus();
    }
}

async function handlePinSetup() {
    const pin = pinSetupInput.value;
    const confirmPin = pinConfirmInput.value;
    
    if (!isValidPin(pin)) {
        pinSetupError.textContent = 'PIN must be exactly 4 digits';
        pinSetupError.style.display = 'block';
        pinSetupInput.value = '';
        pinConfirmInput.value = '';
        pinSetupInput.focus();
        return;
    }
    
    if (pin !== confirmPin) {
        pinSetupError.textContent = 'PINs do not match. Please try again.';
        pinSetupError.style.display = 'block';
        pinConfirmInput.value = '';
        pinConfirmInput.focus();
        return;
    }
    
    try {
        // Register user with PIN
        const result = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({ pin: pin })
        });
        
        if (result.userId) {
            currentUserId = result.userId.toString();
            localStorage.setItem(USER_ID_KEY, currentUserId);
            setPin(pin);
            hidePinSetup();
            showMainApp();
        }
    } catch (error) {
        console.error('PIN setup error:', error);
        pinSetupError.textContent = `Failed to set PIN: ${error.message}. Check console for details.`;
        pinSetupError.style.display = 'block';
    }
}

async function handleSkipPin() {
    try {
        // Register user without PIN
        const result = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({})
        });
        
        if (result.userId) {
            currentUserId = result.userId.toString();
            localStorage.setItem(USER_ID_KEY, currentUserId);
            hidePinSetup();
            showMainApp();
        }
    } catch (error) {
        console.error('Skip PIN error:', error);
        alert(`Failed to initialize: ${error.message}\n\nCheck browser console (F12) for details.\n\nMake sure:\n1. Backend is running on Railway\n2. API URL is correct\n3. CORS is configured`);
    }
}

function handleChangePin() {
    settingsModal.classList.remove('show');
    showPinSetup();
}

function handleRemovePin() {
    if (confirm('Are you sure you want to remove the PIN? Your tasks will no longer be protected.')) {
        removePin();
        settingsModal.classList.remove('show');
        alert('PIN removed successfully!');
    }
}

function showSettings() {
    settingsModal.classList.add('show');
}

function hideSettings() {
    settingsModal.classList.remove('show');
}

// PIN Event Listeners
pinLoginBtn.addEventListener('click', handlePinLogin);
pinSetupBtn.addEventListener('click', handlePinSetup);
pinSkipBtn.addEventListener('click', handleSkipPin);
changePinBtn.addEventListener('click', handleChangePin);
removePinBtn.addEventListener('click', handleRemovePin);
settingsBtn.addEventListener('click', showSettings);
settingsCloseBtn.addEventListener('click', hideSettings);

// Allow Enter key in PIN inputs
pinLoginInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handlePinLogin();
    }
});

pinSetupInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        pinConfirmInput.focus();
    }
});

pinConfirmInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handlePinSetup();
    }
});

// Close modals when clicking overlay
pinLoginModal.querySelector('.modal-overlay').addEventListener('click', function() {
    // Don't allow closing login modal by clicking overlay (security)
});

pinSetupModal.querySelector('.modal-overlay').addEventListener('click', hidePinSetup);
settingsModal.querySelector('.modal-overlay').addEventListener('click', hideSettings);

// Restrict PIN inputs to numbers only
pinLoginInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
});

pinSetupInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
});

pinConfirmInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
});

// Initialize app - check for PIN
async function initializeApp() {
    const pin = getPin();
    
    // Try to get existing user ID
    currentUserId = localStorage.getItem(USER_ID_KEY);
    console.log('Initializing app - PIN exists:', !!pin, 'User ID:', currentUserId);
    
    // For fresh Railway deployment, clear old localStorage if needed
    // Check if we're on production (Railway) vs localhost
    const isProduction = API_BASE_URL.includes('railway.app');
    
    if (pin && currentUserId && !isProduction) {
        // PIN exists and user ID exists (local development), show login modal
        console.log('Showing PIN login (user ID exists - local)');
        showPinLogin();
    } else if (pin && !isProduction) {
        // PIN exists but no user ID (local development), show login modal
        console.log('Showing PIN login (no user ID - local)');
        showPinLogin();
    } else {
        // No PIN or production environment - show setup modal (fresh start)
        console.log('Showing PIN setup (fresh start or production)');
        // Clear any old localStorage for fresh start
        if (isProduction) {
            removePin();
            localStorage.removeItem(USER_ID_KEY);
        }
        showPinSetup();
    }
}

// Initialize the app
initializeApp();
