const form = document.getElementById("donationForm");
const otpBox = document.getElementById("otpBox");
const otpText = document.getElementById("otp");

// OTP generator
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // collect data
  const restaurantName = document.getElementById("restaurantName").value;
  const foodItem = document.getElementById("foodItem").value;
  const quantity = document.getElementById("quantity").value;
  const image = document.getElementById("foodImage").files[0];
  const pickupTime = document.getElementById("pickupTime").value;

  const otp = generateOTP();

  // show OTP
  otpText.innerText = otp;
  otpBox.classList.remove("hidden");

  // prepare formData (for backend later)
  const formData = new FormData();
  formData.append("restaurantName", restaurantName);
  formData.append("foodItem", foodItem);
  formData.append("quantity", quantity);
  formData.append("image", image);
  formData.append("pickupTime", pickupTime);
  formData.append("otp", otp);

  console.log("Form Data Ready:", {
    restaurantName,
    foodItem,
    quantity,
    pickupTime,
    otp
  });

  /*
  🔥 BACKEND CONNECTION (later)
  
  fetch("http://localhost:3000/donate", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
  */
});
    
