// DOM Elements
const toggle = document.getElementById('requestToggle');
const statusLabel = document.getElementById('statusLabel');
const actionStatus = document.getElementById('actionStatus');
const editDetailsLink = document.getElementById('editDetailsLink');
const mapContainer = document.getElementById('mapContainer');
const fullscreenIcon = document.getElementById('fullscreenIcon');
const mainViewContainer = document.getElementById('mainViewContainer');

const popupOverlay = document.getElementById('popupOverlay');
const popupRequirement = document.getElementById('popupRequirement');
const popupConfirmOTP = document.getElementById('popupConfirmOTP');
const popupOnTheWay = document.getElementById('popupOnTheWay');
const confirmText = document.getElementById('confirmText');
const packageDistanceText = document.getElementById('packageDistance');

let isEditing = false;
let setQuantity = "";
let setUnit = "";

// Toggle logic
toggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        // If main map is visible, just say request is active
        if(mainViewContainer.classList.contains('visible')) {
            statusLabel.innerText = "Online";
            statusLabel.style.color = "var(--primary)";
            actionStatus.innerText = "Food supply request is active.";
        } else {
            // Flow begins: show requirement form
            popupOverlay.classList.add('active');
            statusLabel.innerText = "Online";
            statusLabel.style.color = "var(--primary)";
            actionStatus.innerText = "Setting up food request flow...";
        }
    } else {
        statusLabel.innerText = "Offline";
        statusLabel.style.color = "var(--text-main)";
        actionStatus.innerText = "Ready to receive? Go online to request food.";
        // In a real app, this would deactivate tracking. Here, we just keep the map but change status.
        mainViewContainer.classList.add('visible'); // keep map visible if once it was
        actionStatus.innerText = "Food request deactivated. Driver tracking paused.";
    }
});

// OTP inputs auto-advance
document.querySelectorAll('.otp-box').forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < 3) {
            document.querySelectorAll('.otp-box')[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && input.value === '') {
            document.querySelectorAll('.otp-box')[index - 1].focus();
        }
    });
});

// Flow Step 1: Submit Requirement
function submitRequirement() {
    setQuantity = document.getElementById('foodQuantity').value;
    setUnit = document.getElementById('foodUnit').value;

    if (setQuantity === "") {
        alert("Please specify food quantity.");
        return;
    }

    // In mock, submitting the requirement while editing just updates the main view.
    if(isEditing) {
        alert(`Details Updated: ${setQuantity} ${setUnit}`);
        popupOverlay.classList.remove('active');
        // Could update a field here if we had set one for quantity display.
        isEditing = false;
        actionStatus.innerText = "Details updated. Delivery flow adjusted.";
        return;
    }

    // Normal flow: close requirement form, show OTP confirm
    popupRequirement.style.display = 'none';
    popupConfirmOTP.style.display = 'flex';
    confirmText.innerText = `Delivery will arrive soon for: ${setQuantity} ${setUnit}`;
}

// Flow Step 2: Confirm OTP
function confirmOTP() {
    const inputs = document.querySelectorAll('.otp-box');
    let otpVal = "";
    inputs.forEach(input => otpVal += input.value);

    if (otpVal.length !== 4) {
        alert("Please enter the 4-digit OTP.");
        return;
    }

    // Mock check: any 4 digits work.
    popupConfirmOTP.style.display = 'none';
    popupOnTheWay.style.display = 'flex';
}

// Flow Step 3: Click OK and Show Map View
function closeAllAndShowMap() {
    // Clear inputs for next flow
    document.getElementById('foodQuantity').value = '';
    document.querySelectorAll('.otp-box').forEach(input => input.value = '');
    
    // Hide all popups
    popupOverlay.classList.remove('active');
    popupOnTheWay.style.display = 'none';
    // Also reset displays in case flow is re-triggered
    popupRequirement.style.display = 'flex';
    
    // Show main map/info view
    mainViewContainer.classList.add('visible');
    editDetailsLink.classList.add('active'); // Activate 'Edit' link
    actionStatus.innerText = "Food is on the way. Live driver tracking active.";
    
    // Update mock tracking info
    startMockTracking();
}

// Edit details link logic
editDetailsLink.addEventListener('click', (e) => {
    e.preventDefault();
    isEditing = true;
    popupOverlay.classList.add('active');
    popupRequirement.style.display = 'flex';
    popupConfirmOTP.style.display = 'none';
    popupOnTheWay.style.display = 'none';
    // Clear inputs to prompt new setting. In real app, might pre-fill.
    document.getElementById('foodQuantity').value = '';
});

// Mock tracking logic to show movement sense
let trackingInterval;
function startMockTracking() {
    packageDistanceText.innerText = "Distance: 2.1 km";
    clearInterval(trackingInterval);
    let distance = 2.1;
    trackingInterval = setInterval(() => {
        if(distance > 0.05) {
            distance -= 0.05;
            packageDistanceText.innerText = `Distance: ${distance.toFixed(2)} km`;
        } else {
            packageDistanceText.innerText = "Distance: Driver is at location!";
            clearInterval(trackingInterval);
        }
    }, 1000);
}

// Map Fullscreen Toggle
function toggleFullscreen() {
    mapContainer.classList.toggle('fullscreen');
    if (mapContainer.classList.contains('fullscreen')) {
        fullscreenIcon.innerText = "fullscreen_exit";
    } else {
        fullscreenIcon.innerText = "fullscreen";
    }
}
