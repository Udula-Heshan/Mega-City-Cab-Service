const API_BASE = 'http://localhost:8080/api';
let currentSection = 'dashboard';
let currentUserRole = 'GUEST';

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupNavigation();
});

// Authentication and role management
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user-role');
        if(!response.ok) throw new Error('Not authenticated');

        const data = await response.json();
        currentUserRole = data.role;
        updateNavigation();
        addLogoutButton();
        showSection('dashboard');

    } catch(error) {
        window.location.href = '/login.html';
    }
}

function setupNavigation() {
    document.querySelector('nav').addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            const section = e.target.textContent.toLowerCase();
            if(section === 'logout') return;
            showSection(section);
        }
    });
}

function updateNavigation() {
    document.querySelectorAll('nav button:not(.logout-btn)').forEach(button => {
        const section = button.textContent.toLowerCase();
        button.style.display = isSectionAllowed(section) ? 'block' : 'none';
    });
}

function isSectionAllowed(section) {
    const allowedSections = {
        'ADMIN': ['dashboard', 'customers', 'bookings', 'cars', 'drivers'],
        'USER': ['dashboard', 'customers', 'bookings']
    };
    return allowedSections[currentUserRole]?.includes(section) || false;
}

// Section management
function showSection(section) {
    try {
        if(!section || !isSectionAllowed(section)) return;

        currentSection = section;
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '';

        switch(section) {
            case 'dashboard':
                contentDiv.innerHTML = dashboardHTML();
                loadDashboardStats();
                break;
            case 'customers':
                contentDiv.innerHTML = customerSectionHTML();
                setupCustomerSection();
                break;
            case 'bookings':
                contentDiv.innerHTML = bookingSectionHTML();
                setupBookingSection();
                break;
            case 'cars':
                contentDiv.innerHTML = carSectionHTML();
                setupCarSection();
                break;
            case 'drivers':
                contentDiv.innerHTML = driverSectionHTML();
                setupDriverSection();
                break;
        }
    } catch(error) {
        console.error('Section load error:', error);
        showError('Failed to load section content');
    }
}

// HTML Templates
function dashboardHTML() {
    return `
        <div class="section">
            <h2>Dashboard</h2>
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Bookings</h3>
                    <p id="totalBookings">Loading...</p>
                </div>
                <div class="stat-card">
                    <h3>Active Drivers</h3>
                    <p id="activeDrivers">Loading...</p>
                </div>
            </div>
        </div>
    `;
}


function customerSectionHTML() {
    return `
        <div class="section">
            <h2>Customers</h2>
            
            <!-- Search Section -->
            <div class="search-section">
                <input type="text" id="searchCustomer" placeholder="Search by NIC">
                <button onclick="loadCustomers()">Search</button>
            </div>

            <!-- Registration Form -->
            <div class="creation-section">
                <h3>Register New Customer</h3>
                <form id="customerForm" onsubmit="event.preventDefault(); handleCustomerSubmit()">
                    <input type="text" id="customerName" placeholder="Name" required>
                    <input type="text" id="customerAddress" placeholder="Address" required>
                    <input type="text" id="customerNic" placeholder="NIC" required>
                    <input type="tel" id="customerPhone" placeholder="Phone Number" required>
                    <button type="submit">Create Customer</button>
                </form>
            </div>

            <!-- Customer Table -->
            <div class="customer-list" id="customerList">
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>NIC</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                    <!-- Dynamic content will be inserted here -->
                </table>
            </div>
        </div>
    `;
}



function bookingSectionHTML() {
    return `
        <div class="section">
            <h2>Bookings</h2>
            
            <!-- Create Booking Form -->
            <div class="creation-section">
                <h3>Create New Booking</h3>
                <form id="bookingForm" onsubmit="event.preventDefault(); handleBookingSubmit()">
                    <input type="text" id="customerNic" placeholder="Customer NIC" required>
                    <input type="text" id="carLicense" placeholder="Car License Plate" required>
                    <input type="text" id="driverLicense" placeholder="Driver License Number" required>
                    <input type="number" id="distance" placeholder="Distance (km)" step="0.1" required>
                    <button type="submit">Create Booking</button>
                </form>
            </div>

            <!-- Bookings Table -->
            <div class="search-section">
                <input type="text" id="searchBooking" placeholder="Search by Booking Number">
                <button onclick="loadBookings()">Search</button>
            </div>

            <div id="bookingList">
                <table>
                    <tr>
                        <th>Booking #</th>
                        <th>Customer NIC</th>
                        <th>Car License</th>
                        <th>Driver License</th>
                        <th>Distance (km)</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </table>
            </div>
        </div>
    `;
}




// Update carSectionHTML() in app.js
function carSectionHTML() {
    return `
        <div class="section">
            <h2>Cars</h2>
            
            <!-- Search Section -->
            <div class="search-section">
                <input type="text" id="searchCar" placeholder="Search by License Plate">
                <button onclick="searchCar()">Search</button>
                <button onclick="loadCars()">Show All</button>
            </div>

            <!-- Add New Car Form -->
            <div class="creation-section">
                <h3>Add New Car</h3>
                <form id="carForm" onsubmit="event.preventDefault(); handleCarSubmit()">
                    <input type="text" id="carModel" placeholder="Model" required>
                    <input type="text" id="carLicense" placeholder="License Plate" required>
                    <button type="submit">Add Car</button>
                </form>
            </div>

            <!-- Car Table -->
            <div id="carList"></div>
        </div>
    `;
}
// Add search function
async function searchCar() {
    const licensePlate = document.getElementById('searchCar').value;
    if(!licensePlate) return;

    showLoading();
    try {
        const car = await fetchData(`/api/cars/${licensePlate}`);
        const list = document.getElementById('carList');
        list.innerHTML = `
            <table>
                <tr>
                    <th>Model</th>
                    <th>License Plate</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <td>${car.model || 'N/A'}</td>
                    <td>${car.licensePlate}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteCar('${car.licensePlate}')">Delete</button>
                    </td>
                </tr>
            </table>
        `;
    } catch(error) {
        showError('Car not found');
    } finally {
        hideLoading();
    }
}


// Update driverSectionHTML() in app.js
function driverSectionHTML() {
    return `
        <div class="section">
            <h2>Drivers</h2>
            
            <!-- Search Section -->
            <div class="search-section">
                <input type="text" id="searchDriver" placeholder="Search by License Number">
                <button onclick="searchDriver()">Search</button>
                <button onclick="loadDrivers()">Show All</button>
            </div>

            <!-- Add New Driver Form -->
            <div class="creation-section">
                <h3>Add New Driver</h3>
                <form id="driverForm" onsubmit="event.preventDefault(); handleDriverSubmit()">
                    <input type="text" id="driverName" placeholder="Name" required>
                    <input type="text" id="driverLicense" placeholder="License Number" required>
                    <input type="tel" id="driverPhone" placeholder="Phone Number" required>
                    <button type="submit">Add Driver</button>
                </form>
            </div>

            <!-- Driver Table -->
            <div id="driverList"></div>
        </div>
    `;
}

// Add search function
async function searchDriver() {
    const licenseNumber = document.getElementById('searchDriver').value;
    if(!licenseNumber) return;

    showLoading();
    try {
        const driver = await fetchData(`/api/drivers/${licenseNumber}`);
        const list = document.getElementById('driverList');
        list.innerHTML = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>License Number</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.licenseNumber}</td>
                    <td>${driver.phoneNumber}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteDriver('${driver.licenseNumber}')">Delete</button>
                    </td>
                </tr>
            </table>
        `;
    } catch(error) {
        showError('Driver not found');
    } finally {
        hideLoading();
    }
}




// Section Setup Functions
function setupCustomerSection() {
    document.getElementById('searchCustomer').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') loadCustomers();
    });
    loadCustomers();
}

function setupBookingSection() {
    document.getElementById('searchBooking').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') loadBookings();
    });
    loadBookings();
}

function setupCarSection() {
    loadCars();
}

function setupDriverSection() {
    loadDrivers();
}


async function loadCustomers() {
    showLoading();
    try {
        const customers = await fetchData('/api/customers');
        const list = document.getElementById('customerList');
        list.innerHTML = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>NIC</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                ${customers.map(customer => `
                    <tr>
                        <td>${customer.name}</td>
                        <td>${customer.address}</td>  <!-- Address column added -->
                        <td>${customer.nic}</td>
                        <td>${customer.phoneNumber}</td>
                        <td>
                            <button class="delete-btn" onclick="deleteCustomer('${customer.nic}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    } catch(error) {
        showError('Failed to load customers');
    } finally {
        hideLoading();
    }
}


async function loadBookings() {
    showLoading();
    try {
        const bookings = await fetchData('/api/bookings');
        const list = document.getElementById('bookingList');
        list.innerHTML = `
            <table>
                <tr>
                    <th>Booking #</th>
                    <th>Customer NIC</th>
                    <th>Car License</th>
                    <th>Driver License</th>
                    <th>Distance (km)</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                ${bookings.map(booking => `
                    <tr>
                        <td>${booking.bookingNumber || 'N/A'}</td>
                        <td>${booking.customerId || 'N/A'}</td>
                        <td>${booking.carId || 'N/A'}</td>
                        <td>${booking.assignedDriverId || 'N/A'}</td>
                        <td>${booking.distanceKm?.toFixed(1) || '0.0'}</td>
                        <td>${new Date(booking.bookingDate).toLocaleDateString() || 'N/A'}</td>
                        <td>
                            <button class="calc-btn" onclick="calculateBill('${booking.bookingNumber}')">Calculate Bill</button>
                            <button class="delete-btn" onclick="deleteBooking('${booking.bookingNumber}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    } catch(error) {
        showError('Failed to load bookings');
    } finally {
        hideLoading();
    }
}


// Add to form handlers section
async function handleBookingSubmit() {
    showLoading();
    try {
        const booking = {
            customerId: document.getElementById('customerId').value,
            carId: document.getElementById('carId').value,
            assignedDriverId: document.getElementById('driverId').value,
            distanceKm: parseFloat(document.getElementById('distance').value),
            peakHour: document.getElementById('peakHour').checked
        };

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });

        if (!response.ok) throw new Error('Failed to create booking');

        clearForm('bookingForm');
        loadBookings();
    } catch(error) {
        showError('Failed to create booking: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function calculateBill(bookingNumber) {
    showLoading();
    try {
        const response = await fetch(`/api/bookings/${bookingNumber}/bill`);
        const data = await response.json();
        alert(`Total Bill: LKR ${data.total.toFixed(2)}`);
    } catch(error) {
        showError('Failed to calculate bill');
    } finally {
        hideLoading();
    }
}


async function loadCars() {
    showLoading();
    try {
        const cars = await fetchData('/api/cars');
        const list = document.getElementById('carList');
        list.innerHTML = `
            <table>
                <tr>
                    <th>Model</th>
                    <th>License Plate</th>
                    <th>Actions</th>
                </tr>
                ${cars.map(car => `
                    <tr>
                        <td>${car.model}</td>
                        <td>${car.licensePlate}</td>
                        <td>
                            <button class="delete-btn" onclick="deleteCar('${car.licensePlate}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    } catch(error) {
        showError('Failed to load cars');
    } finally {
        hideLoading();
    }
}

async function loadDrivers() {
    showLoading();
    try {
        const drivers = await fetchData('/api/drivers');
        const list = document.getElementById('driverList');
        list.innerHTML = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>License Number</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
                ${drivers.map(driver => `
                    <tr>
                        <td>${driver.name}</td>
                        <td>${driver.licenseNumber}</td>
                        <td>${driver.phoneNumber}</td>
                        <td>
                            <button class="delete-btn" onclick="deleteDriver('${driver.licenseNumber}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    } catch(error) {
        showError('Failed to load drivers');
    } finally {
        hideLoading();
    }
}

// Delete Functions
async function deleteCustomer(nic) {
    showLoading();
    try {
        await fetch(`/api/customers/${nic}`, { method: 'DELETE' });
        loadCustomers();
    } catch(error) {
        showError('Failed to delete customer');
    } finally {
        hideLoading();
    }
}

async function deleteBooking(bookingNumber) {
    showLoading();
    try {
        await fetch(`/api/bookings/${bookingNumber}`, { method: 'DELETE' });
        loadBookings();
    } catch(error) {
        showError('Failed to delete booking');
    } finally {
        hideLoading();
    }
}

async function deleteCar(licensePlate) {
    showLoading();
    try {
        await fetch(`/api/cars/${licensePlate}`, { method: 'DELETE' });
        loadCars();
    } catch(error) {
        showError('Failed to delete car');
    } finally {
        hideLoading();
    }
}

async function deleteDriver(licenseNumber) {
    showLoading();
    try {
        await fetch(`/api/drivers/${licenseNumber}`, { method: 'DELETE' });
        loadDrivers();
    } catch(error) {
        showError('Failed to delete driver');
    } finally {
        hideLoading();
    }
}

// Form Handlers
async function handleCustomerSubmit() {
    showLoading();
    try {
        const customer = {
            name: document.getElementById('customerName').value,
            address: document.getElementById('customerAddress').value,
            nic: document.getElementById('customerNic').value,
            phoneNumber: document.getElementById('customerPhone').value
        };

        await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        });

        clearForm('customerForm');
        loadCustomers();
    } catch(error) {
        showError('Failed to create customer');
    } finally {
        hideLoading();
    }
}

async function handleCarSubmit() {
    showLoading();
    try {
        const car = {
            model: document.getElementById('carModel').value,
            licensePlate: document.getElementById('carLicense').value
        };

        await fetch('/api/cars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        });

        clearForm('carForm');
        loadCars();
    } catch(error) {
        showError('Failed to create car');
    } finally {
        hideLoading();
    }
}

async function handleDriverSubmit() {
    showLoading();
    try {
        const driver = {
            name: document.getElementById('driverName').value,
            licenseNumber: document.getElementById('driverLicense').value,
            phoneNumber: document.getElementById('driverPhone').value
        };

        await fetch('/api/drivers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driver)
        });

        clearForm('driverForm');
        loadDrivers();
    } catch(error) {
        showError('Failed to create driver');
    } finally {
        hideLoading();
    }
}

// Dashboard Functions
async function loadDashboardStats() {
    try {
        const bookings = await fetchData('/api/bookings');
        const drivers = await fetchData('/api/drivers');

        document.getElementById('totalBookings').textContent = bookings.length;
        document.getElementById('activeDrivers').textContent = drivers.length;
    } catch(error) {
        showError('Failed to load dashboard stats');
    }
}

// Logout functionality
function addLogoutButton() {
    if(document.querySelector('.logout-btn')) return;

    const nav = document.querySelector('nav');
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'logout-btn';
    logoutBtn.onclick = () => {
        showLoading();
        fetch('/logout', { method: 'POST' })
            .then(() => window.location.href = '/login.html')
            .catch(err => showError('Logout failed: ' + err.message))
            .finally(hideLoading);
    };
    nav.appendChild(logoutBtn);
}

// Global exports for HTML event handlers
window.showSection = showSection;
window.deleteCustomer = deleteCustomer;
window.deleteBooking = deleteBooking;
window.deleteCar = deleteCar;
window.deleteDriver = deleteDriver;
window.loadCustomers = loadCustomers;
window.loadBookings = loadBookings;
window.loadCars = loadCars;
window.loadDrivers = loadDrivers;
window.handleCustomerSubmit = handleCustomerSubmit;
window.handleCarSubmit = handleCarSubmit;
window.handleDriverSubmit = handleDriverSubmit;

// Update window exports
window.handleBookingSubmit = handleBookingSubmit;

// Utility Functions
function showLoading() {
    document.getElementById('loadingModal').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingModal').style.display = 'none';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function clearForm(formId) {
    document.getElementById(formId).reset();
}

async function fetchData(url) {
    const response = await fetch(url);
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}