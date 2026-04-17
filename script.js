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

// ---------------- Firebase Setup ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqlO8xiRy4m0-Y3__eM77j7Biup4cJctw",
  authDomain: "lefto-259a9.firebaseapp.com",
  projectId: "lefto-259a9",
  storageBucket: "lefto-259a9.firebasestorage.app",
  messagingSenderId: "369693551767",
  appId: "1:369693551767:web:5542cd993de6a8ec77cdd2",
  measurementId: "G-79MVE0ZJ26"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let currentUser = null;
let selectedRole = null;

// ---------------- Role Selection ----------------
function handleRoleSelection(role, formId) {
  selectedRole = role;
  loginWithGoogle(formId);
}

// ---------------- Firebase Login ----------------
function loginWithGoogle(formId) {
  signInWithPopup(auth, provider)
    .then((result) => {
      currentUser = result.user;

      console.log("Logged in:", currentUser.email);
      console.log("Role:", selectedRole);

      showForm(formId);
    })
    .catch((error) => {
      console.log(error);
    });
}

// ---------------- Show Forms ----------------
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

// ---------------- Submit Functions ----------------
function submitRestaurant(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const data = {
    email: currentUser.email,
    role: selectedRole,
    name: event.target[0].value,
    address: event.target[1].value,
    phone: event.target[2].value,
    image: event.target[3].files[0]
  };

  console.log("Restaurant:", data);
}

function submitNGO(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const data = {
    email: currentUser.email,
    role: selectedRole,
    name: event.target[0].value,
    address: event.target[1].value,
    phone: event.target[2].value,
    image: event.target[3].files[0]
  };

  console.log("NGO:", data);
}

function submitVolunteer(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const data = {
    email: currentUser.email,
    role: selectedRole,
    name: event.target[0].value,
    phone: event.target[1].value,
    driverImage: event.target[2].files[0],
    license: event.target[3].files[0],
    vehicleType: event.target[4].value,
    capacity: event.target[5].value,
    vehicleImage: event.target[6].files[0]
  };

  console.log("Volunteer:", data);
}

window.handleRoleSelection = handleRoleSelection;
window.showForm = showForm;
window.showSelection = showSelection;
window.submitRestaurant = submitRestaurant;
window.submitNGO = submitNGO;
window.submitVolunteer = submitVolunteer;