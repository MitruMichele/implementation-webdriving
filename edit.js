import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { showToast } from "./toast.js";
import { app } from "./firebase.js";
import { goToLogin, focusActiveNavItem } from "../js/nav.js";

const db = getFirestore(app);

console.log("Starting");

document.addEventListener("DOMContentLoaded", function () {
  // focus default
  focusActiveNavItem(2);
});

goToLogin();

const EditForm = document.getElementById("edit-form");
const LicenseNumber = document.getElementById("license-number");
const DOB = document.getElementById("date-of-birth");
const LicenseError = document.getElementById("licenseError");
const DOBError = document.getElementById("DOBError");

const userId = window.localStorage.getItem("userId");
console.log(userId);

const userDetails = window.localStorage.getItem("userDetails");
const user = JSON.parse(userDetails);

console.log(user.role);

console.log(user.role !== "admin");

EditForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearErrors();
  const LicenseNumberValue = LicenseNumber.value.trim();
  const DOBValue = DOB.value.trim();
  // input fields validation
  if (LicenseNumberValue === "") {
    showError(LicenseError, "Provide a valid license number");
  }
  if (DOBValue === "") {
    console.log(DOBValue);
    showError(DOBError, "Provide your date of birth");
  }

  if (LicenseNumberValue && DOBValue) {
    const data = {
      licenseNumber: LicenseNumberValue,
      dateOfBirth: DOBValue,
    };

    if (data.licenseNumber === userId || user.role === "admin") {
      document.getElementById("submitBtn").textContent = "Please Wait...";
      window.location.href = "/pages/renew.html";
      window.localStorage.setItem("licenseId", data.licenseNumber);
      // showToast("License application submitted successful!", true);
    } else {
      showToast("License number not found!", false);
    }
  }
  function showError(element, message) {
    element.textContent = message;
  }
  console.log("run");

  function clearErrors() {
    DOBError.textContent = "";
    LicenseError.textContent = "";
  }
});
