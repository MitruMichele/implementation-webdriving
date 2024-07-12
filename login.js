// Add Firebase products that you want to use
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

import { app } from "./firebase.js"
import { showToast } from "./toast.js"
// console.log(app)
const db = getFirestore(app)
const auth = getAuth()

// remove login user
window.localStorage.removeItem("userId")
window.localStorage.removeItem("userDetails")

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm")
  const email = document.getElementById("email")
  const password = document.getElementById("password")
  const emailError = document.getElementById("emailError")
  const passwordError = document.getElementById("passwordError")
  const loginBtn = document.querySelector("button[type=submit]")

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    clearErrors()

    const emailValue = email.value.trim()
    const passwordValue = password.value.trim()

    if (emailValue === "") {
      showError(emailError, "Email is required")
      return
    }

    if (passwordValue === "") {
      showError(passwordError, "Password is required")
      return
    }

    try {
      loginBtn.textContent = "Logging in..."
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      )

      const { user } = userCredentials
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        window.localStorage.setItem("userId", user.uid)
        window.localStorage.setItem("userDetails", JSON.stringify(userData))
        window.location.href = "/index.html"
      }
    } catch (error) {
      console.log(error)
      if (error.code === "auth/user-not-found") {
        showToast("No user found", false)
      } else if (error.code === "auth/invalid-credential") {
        showToast("Invalid credential", false)
      } else {
        showToast("Login failed", false)
      }
    } finally {
      loginBtn.textContent = "Login"
    }
  })

  function clearErrors() {
    emailError.textContent = ""
    passwordError.textContent = ""
  }

  function showError(element, message) {
    element.textContent = message
  }
})
