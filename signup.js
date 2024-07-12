import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { app } from "./firebase.js"
import { showToast } from "./toast.js"

const db = getFirestore(app)
const auth = getAuth()

document.addEventListener("DOMContentLoaded", function () {
  window.localStorage.removeItem("userId")
  const signupForm = document.getElementById("signupForm")
  const firstName = document.getElementById("first-name")
  const lastName = document.getElementById("last-name")
  const email = document.getElementById("email")
  const phone = document.getElementById("phone")
  const password = document.getElementById("password")
  const privacy = document.getElementById("privacy")
  const passwordConfirm = document.getElementById("password-confirm")
  const lastNameError = document.getElementById("lastNameError")
  const firstNameError = document.getElementById("firstNameError")
  const emailError = document.getElementById("emailError")
  const phoneError = document.getElementById("phoneError")
  const passwordError = document.getElementById("passwordError")
  const passwordConfirmError = document.getElementById("passwordConfirmError")
  const privacyError = document.getElementById("privacyError")
  const signUpBtn = document.querySelector("button[type=submit]")

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    clearErrors()

    const firstNameValue = firstName.value.trim()
    const lastNameValue = lastName.value.trim()
    const phoneValue = phone.value.trim()
    const emailValue = email.value.trim()
    const passwordValue = password.value.trim()
    const privacyValue = privacy.checked
    const passwordConfirmValue = passwordConfirm.value.trim()

    // Input fields validation
    if (firstNameValue === "") {
      showError(firstNameError, "First name is required")
      return
    } else if (firstNameValue.length < 2) {
      showError(firstNameError, "First name must be at least 2 characters")
      return
    }

    if (lastNameValue === "") {
      showError(lastNameError, "Last name is required")
      return
    } else if (lastNameValue.length < 2) {
      showError(lastNameError, "Last name must be at least 2 characters")
      return
    }

    if (phoneValue === "") {
      showError(phoneError, "Phone number is required")
      return
    } else if (phoneValue.length < 11) {
      showError(phoneError, "Please enter a valid phone number")
      return
    }

    if (emailValue === "") {
      showError(emailError, "Email is required")
      return
    } else if (!isValidEmail(emailValue)) {
      showError(emailError, "Please enter a valid email address")
      return
    }

    if (passwordValue === "") {
      showError(passwordError, "Password is required")
      return
    }

    if (passwordConfirmValue === "") {
      showError(passwordConfirmError, "Confirm password is required")
      return
    }
    if (passwordConfirmValue !== passwordValue) {
      showError(
        passwordConfirmError,
        "Password and Confirm Password must be the same"
      )
      return
    }

    if (!privacyValue) {
      showError(privacyError, "You must agree to the privacy policy")
      return
    }

    // Sign up user
    const isAdmin =
      emailValue === "adminuser@gmail.com" && passwordValue === "adminpassword"
    console.log(isAdmin)
    try {
      signUpBtn.textContent = "Sign Up..."
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      )
      const { user } = userCredentials

      // Store user details in Firestore
      const userRef = collection(db, "users")
      await setDoc(doc(userRef, user.uid), {
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        phone: phoneValue,
        role: isAdmin ? "admin" : "user",
      })

      showToast("Signup successful, please proceed to login.", true)
      signupForm.reset()
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorCode, errorMessage)
      showToast(errorCode.split("/")[1], false)
    } finally {
      signUpBtn.textContent = "Sign Up"
    }
  })

  function clearErrors() {
    firstNameError.textContent = ""
    lastNameError.textContent = ""
    phoneError.textContent = ""
    emailError.textContent = ""
    passwordError.textContent = ""
    passwordConfirmError.textContent = ""
    privacyError.textContent = ""
  }

  function showError(element, message) {
    element.textContent = message
  }

  function isValidEmail(email) {
    // Basic email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
})
