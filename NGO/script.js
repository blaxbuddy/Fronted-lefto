const requestDonationBtn = document.getElementById('requestDonationBtn');
const actionContainer = document.getElementById('actionContainer');
const mainViewContainer = document.getElementById('mainViewContainer');

const popupOverlay = document.getElementById('popupOverlay');
const closePopupBtn = document.getElementById('closePopupBtn');

const packageDistanceText = document.getElementById('packageDistance');
const packageDetailsText = document.getElementById('packageDetailsText');
const generatedOtpText = document.getElementById('generatedOtp');
const mapContainer = document.getElementById('mapContainer');
const fullscreenIcon = document.getElementById('fullscreenIcon');

let trackingInterval;

// Open Pop-up Menu
requestDonationBtn.addEventListener('click', () => {
    document.getElementById('foodQuantity').value = ''; 
    popupOverlay.classList.add('active');
});

// Close Pop-up Menu
closePopupBtn.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
});

// Submit Requirement & Show Map/OTP
function submitRequirement() {
    const setQuantity = document.getElementById('foodQuantity').value;
    const setUnit = document.getElementById('foodUnit').value;

    if (setQuantity === "") {
        alert("Please specify food quantity.");
        return;
    }

    // 1. Hide Overlay and the Central Action Button
    popupOverlay.classList.remove('active');
    actionContainer.style.display = 'none';

    // 2. Show the Main Map and Info View
    mainViewContainer.classList.add('visible');
    
    // 3. Update the details text
    packageDetailsText.innerText = `Requesting: ${setQuantity} ${setUnit}`;
    
    // 4. Generate Long-lasting OTP
    generateDriverOTP();
    
    // 5. Start Mock Tracking
    setTimeout(() => {
        startMockTracking();
    }, 1500);
}

// Generate the Static PIN
function generateDriverOTP() {
    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    generatedOtpText.innerText = randomOtp;
}

// Mock Tracking Logic
function startMockTracking() {
    packageDistanceText.innerText = "Distance: 2.1 km";
    clearInterval(trackingInterval);
    let distance = 2.1;
    
    trackingInterval = setInterval(() => {
        if(distance > 0.05) {
            distance -= 0.05;
            packageDistanceText.innerText = `Distance: ${distance.toFixed(2)} km`;
        } else {
            packageDistanceText.innerText = "Distance: Driver is at location! Please provide PIN.";
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

// Subtle Mouse Parallax for Background Doodles
document.addEventListener("DOMContentLoaded", () => {
    const doodles = document.querySelectorAll('.doodle');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        doodles.forEach((doodle, index) => {
            const speed = (index + 1) * 15; 
            const xOffset = (x * speed) - (speed / 2);
            doodle.style.transform = `translateX(${xOffset}px)`;
        });
    });
});
