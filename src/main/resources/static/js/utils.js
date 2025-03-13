//utils.js
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




// Add to utility functions
function clearContent() {
    document.getElementById('content').innerHTML = '';
}

function handleNavigationError(error) {
    console.error('Navigation error:', error);
    showError('Failed to load section');
}

// Make functions available globally
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showError = showError;
window.closeModal = closeModal;
window.clearForm = clearForm;