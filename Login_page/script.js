// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "YOUR_KEY",
//   authDomain: "YOUR_DOMAIN",
//   projectId: "YOUR_PROJECT_ID"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// let currentUser = null;

// function loginWithGoogle() {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       currentUser = result.user;

//       console.log("Logged in:", currentUser.email);

//       alert("Logged in as " + currentUser.email);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

// function submitNGO(event) {
//   event.preventDefault();

//   if (!currentUser) {
//     alert("Please login first!");
//     return;
//   }

//   const data = {
//     email: currentUser.email,
//     role: "ngo",
//     name: event.target[0].value,
//     address: event.target[1].value,
//     phone: event.target[2].value,
//     image: event.target[3].files[0] // file input
//   };

//   console.log("NGO Submitting:", data);
// }

// function submitRestaurant(event) {
//   event.preventDefault();

//   if (!currentUser) {
//     alert("Please login first!");
//     return;
//   }

//   const data = {
//     email: currentUser.email,
//     role: "provider",
//     name: event.target[0].value,
//     address: event.target[1].value,
//     phone: event.target[2].value
//   };

//   console.log("Submitting:", data);
// }

// function submitVolunteer(event) {
//   event.preventDefault();

//   if (!currentUser) {
//     alert("Please login first!");
//     return;
//   }

//   const data = {
//     email: currentUser.email,
//     role: "volunteer",
//     name: event.target[0].value,
//     phone: event.target[1].value,
//     driverImage: event.target[2].files[0],
//     license: event.target[3].files[0],
//     vehicleType: event.target[4].value,
//     capacity: event.target[5].value,
//     vehicleImage: event.target[6].files[0]
//   };

//   console.log("Volunteer Submitting:", data);
// }

// // Function to hide all sections and show the targeted form
// function showForm(formId) {
//   // Hide the selection menu
//   document.getElementById('role-selection').classList.add('hidden');
  
//   // Hide all forms first (to reset state)
//   document.getElementById('ngo-form').classList.add('hidden');
//   document.getElementById('restaurant-form').classList.add('hidden');
//   document.getElementById('volunteer-form').classList.add('hidden');

//   // Show the specific form the user clicked
//   document.getElementById(formId).classList.remove('hidden');
// }

// // Function to handle the "Back" button
// function showSelection() {
//   // Hide all forms
//   document.getElementById('ngo-form').classList.add('hidden');
//   document.getElementById('restaurant-form').classList.add('hidden');
//   document.getElementById('volunteer-form').classList.add('hidden');

//   // Show the main selection menu again
//   document.getElementById('role-selection').classList.remove('hidden');
// }

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ✅ FIX 1: Added databaseURL
// ✅ FIX 2: Corrected storageBucket to .appspot.com
const firebaseConfig = {
  apiKey: "AIzaSyDqlO8xiRy4m0-Y3__eM77j7Biup4cJctw",
  authDomain: "lefto-259a9.firebaseapp.com",
  databaseURL: "https://lefto-259a9-default-rtdb.firebaseio.com",
  projectId: "lefto-259a9",
  storageBucket: "lefto-259a9.appspot.com",
  messagingSenderId: "369693551767",
  appId: "1:369693551767:web:5542cd993de6a8ec77cdd2",
  measurementId: "G-79MVE0ZJ26"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
const storage = getStorage(app);

let currentUser = null;
let selectedRole = null;

// ---------- Helper: Upload image and return download URL ----------
async function uploadImageAndGetURL(file, folderPath) {
  if (!file) return null;
  const fileName = `${Date.now()}_${file.name}`;
  const fullPath = `${folderPath}/${fileName}`;
  const imageRef = storageRef(storage, fullPath);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

// ---------- Role Selection ----------
function handleRoleSelection(role, formId) {
  selectedRole = role;
  loginWithGoogle(formId);
}

// ---------- Google Login ----------
function loginWithGoogle(formId) {
  signInWithPopup(auth, provider)
    .then((result) => {
      currentUser = result.user;
      console.log("✅ Logged in:", currentUser.email);
      showForm(formId);
    })
    .catch((error) => {
      console.error("❌ Login error:", error.code, error.message);
      alert("Login failed: " + error.message);
    });
}

// ---------- Show/Hide Forms ----------
function showForm(formId) {
  document.getElementById('role-selection').classList.add('hidden');
  document.getElementById('ngo-form').classList.add('hidden');
  document.getElementById('restaurant-form').classList.add('hidden');
  document.getElementById('volunteer-form').classList.add('hidden');
  document.getElementById(formId).classList.remove('hidden');
}

function showSelection() {
  document.getElementById('ngo-form').classList.add('hidden');
  document.getElementById('restaurant-form').classList.add('hidden');
  document.getElementById('volunteer-form').classList.add('hidden');
  document.getElementById('role-selection').classList.remove('hidden');
}

// ---------- Submit Volunteer ----------
// ✅ FIX 3: Using querySelector by name instead of fragile form[index]
async function submitVolunteer(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const form = event.target;

  // Grab fields by name — reliable regardless of DOM nesting
  const fullName     = form.querySelector('[name="fullName"]').value;
  const phone        = form.querySelector('[name="phone"]').value;
  const vehicleType  = form.querySelector('[name="vehicleType"]').value;
  const capacity     = form.querySelector('[name="capacity"]').value;
  const driverImageFile  = form.querySelector('[name="driverImage"]').files[0];
  const licenseFile      = form.querySelector('[name="license"]').files[0];
  const vehicleImageFile = form.querySelector('[name="vehicleImage"]').files[0];

  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.innerText = "Uploading...";
  submitBtn.disabled = true;

  try {
    console.log("📤 Uploading volunteer images...");

    const driverImageURL  = await uploadImageAndGetURL(driverImageFile,  `volunteers/${currentUser.uid}/driver`);
    const licenseURL      = await uploadImageAndGetURL(licenseFile,       `volunteers/${currentUser.uid}/license`);
    const vehicleImageURL = await uploadImageAndGetURL(vehicleImageFile,  `volunteers/${currentUser.uid}/vehicle`);

    console.log("📝 Saving volunteer data to DB...");

    const volunteerRef = ref(database, `volunteers/${currentUser.uid}`);
    await set(volunteerRef, {
      uid: currentUser.uid,
      email: currentUser.email,
      role: selectedRole,
      fullName,
      phone,
      vehicleType,
      carryingCapacity: capacity,
      driverImageURL,
      licenseImageURL: licenseURL,
      vehicleImageURL,
      timestamp: Date.now()
    });

    console.log("✅ Volunteer saved successfully!");
    alert("Volunteer registration successful!");
    form.reset();
    showSelection();

  } catch (error) {
    console.error("❌ Volunteer submission error:", error.code, error.message);
    alert("Error: " + error.message);
  } finally {
    submitBtn.innerText = "Submit";
    submitBtn.disabled = false;
  }
}

// ---------- Submit Restaurant ----------
async function submitRestaurant(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const form = event.target;

  const name    = form.querySelector('[name="name"]').value;
  const address = form.querySelector('[name="address"]').value;
  const phone   = form.querySelector('[name="phone"]').value;
  const placeImageFile = form.querySelector('[name="placeImage"]').files[0];

  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.innerText = "Uploading...";
  submitBtn.disabled = true;

  try {
    console.log("📤 Uploading restaurant image...");
    const placeImageURL = await uploadImageAndGetURL(placeImageFile, `restaurants/${currentUser.uid}`);

    console.log("📝 Saving restaurant data...");
    const restaurantRef = ref(database, `restaurants/${currentUser.uid}`);
    await set(restaurantRef, {
      uid: currentUser.uid,
      email: currentUser.email,
      role: selectedRole,
      name,
      address,
      phone,
      placeImageURL,
      timestamp: Date.now()
    });

    console.log("✅ Restaurant saved!");
    alert("Restaurant registered successfully!");
    form.reset();
    showSelection();

  } catch (error) {
    console.error("❌ Restaurant submission error:", error.code, error.message);
    alert("Error: " + error.message);
  } finally {
    submitBtn.innerText = "Submit";
    submitBtn.disabled = false;
  }
}

// ---------- Submit NGO ----------
async function submitNGO(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const form = event.target;

  const name    = form.querySelector('[name="name"]').value;
  const address = form.querySelector('[name="address"]').value;
  const phone   = form.querySelector('[name="phone"]').value;
  const placeImageFile = form.querySelector('[name="placeImage"]').files[0];

  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.innerText = "Uploading...";
  submitBtn.disabled = true;

  try {
    console.log("📤 Uploading NGO image...");
    const placeImageURL = await uploadImageAndGetURL(placeImageFile, `ngos/${currentUser.uid}`);

    console.log("📝 Saving NGO data...");
    const ngoRef = ref(database, `ngos/${currentUser.uid}`);
    await set(ngoRef, {
      uid: currentUser.uid,
      email: currentUser.email,
      role: selectedRole,
      name,
      address,
      phone,
      placeImageURL,
      timestamp: Date.now()
    });

    console.log("✅ NGO saved!");
    alert("NGO registered successfully!");
    form.reset();
    showSelection();

  } catch (error) {
    console.error("❌ NGO submission error:", error.code, error.message);
    alert("Error: " + error.message);
  } finally {
    submitBtn.innerText = "Submit";
    submitBtn.disabled = false;
  }
}

// Expose to global scope (called from HTML onclick)
window.handleRoleSelection = handleRoleSelection;
window.showForm = showForm;
window.showSelection = showSelection;
window.submitRestaurant = submitRestaurant;
window.submitNGO = submitNGO;
window.submitVolunteer = submitVolunteer;
