import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { showToast } from "./toast.js"
import { app } from "./firebase.js"
import { focusActiveNavItem, goToLogin } from "../js/nav.js"

// Initialize Firebase
const userId = window.localStorage.getItem("userId")

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)
// get all form variables
document.addEventListener("DOMContentLoaded", function () {
  // focus default
  focusActiveNavItem(1)
  goToLogin()
  // variables
  const licenseForm = document.getElementById("new-license-form")
  const firstName = document.getElementById("first-name")
  const lastName = document.getElementById("last-name")
  const email = document.getElementById("email")
  const phone = document.getElementById("phone")
  const address = document.getElementById("address")
  const drivingCert = document.getElementById("driving-cert")
  const dateOfBirth = document.getElementById("date-of-birth")
  const privacy = document.getElementById("privacy")
  const isDisable = document.getElementById("disability")
  const isOfAge = document.getElementById("is-of-age")
  const notOfAge = document.getElementById("not-of-age")
  const notDisable = document.getElementById("noDisability")
  const lastNameError = document.getElementById("lastNameError")
  const drivingCertError = document.getElementById("certNumberError")
  const dateOfBirthError = document.getElementById("dateOfBirthError")
  const firstNameError = document.getElementById("firstNameError")
  const emailError = document.getElementById("emailError")
  const phoneError = document.getElementById("phoneError")
  const ageError = document.getElementById("ageError")
  const addressError = document.getElementById("addressError")
  const disablityError = document.getElementById("disabilityError")
  const privacyError = document.getElementById("privacyError")
  const licenseDuration = document.getElementById("licence-duration")
  const submitBtn = document.querySelector("button[type=submit]")

  licenseForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    clearErrors()

    // input values
    const firstNameValue = firstName.value.trim()
    const lastNameValue = lastName.value.trim()
    const emailValue = email.value.trim()
    const phoneValue = phone.value.trim()
    const addressValue = address.value.trim()
    const drivingCertValue = drivingCert.value.trim()
    const dateOfBirthValue = dateOfBirth.value.trim()
    const privacyValue = privacy.checked
    const isOfAgeValue = isOfAge.checked
    const notOfAgeValue = notOfAge.checked
    const isDisableValue = isDisable.checked
    const notDisableValue = notDisable.checked
    const durationValue = licenseDuration.value

    // input fields validation
    if (firstNameValue === "") {
      showError(firstNameError, "First name is required")
    }
    if (lastNameValue === "") {
      showError(lastNameError, "Last name is required")
    }
    if (!isValidEmail(emailValue)) {
      showError(emailError, "Please enter a valid email address")
    }
    function isValidEmail(email) {
      // Basic email validation using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    if (phoneValue === "") {
      showError(phoneError, "Phone number is required")
    }
    if (addressValue === "") {
      showError(addressError, "Address is required")
    }
    if (!(drivingCertValue.length === 8)) {
      showError(
        drivingCertError,
        "Provide a valid driving certificate number, should be 8 characters long"
      )
    }

    if (dateOfBirthValue === "") {
      showError(dateOfBirthError, "Provide your date of birth")
    }

    if (!(isOfAgeValue || notOfAgeValue)) {
      showError(ageError, "Age is not valid")
    }
    if (!(isDisableValue || notDisableValue)) {
      showError(disablityError, "Disability status is not valid")
    }
    if (!privacyValue) {
      showError(privacyError, "You must agree to the privacy")
    }

    // validate submission
    // Set the expiration time in minutes
    let expirationTimeInMinutes = durationValue ? durationValue : 2 // 30 minutes

    // Get the current time
    let currentTime = new Date()
    let expirationDate = new Date(
      currentTime.getTime() + expirationTimeInMinutes * 60000
    )
    if (
      drivingCertValue.length === 8 &&
      firstNameValue &&
      lastNameValue &&
      isValidEmail(emailValue) &&
      isAdult(dateOfBirthValue) &&
      (isDisableValue || notDisableValue) &&
      phoneValue &&
      addressValue &&
      privacyValue
    ) {
      var now = new Date()
      const data = {
        fullname: firstNameValue + " " + lastNameValue,
        drivingCertificateNumber: drivingCertValue,
        email: emailValue,
        phone: phoneValue,
        address: addressValue,
        isAdult: isAdult(dateOfBirthValue),
        dateOfBirth: dateOfBirthValue,
        isDisable: isDisableValue ? true : false,
        isNew: true,
        expiryDate: expirationDate,
        isExpired: now > expirationDate,
      }
      try {
        submitBtn.textContent = "Submitting Application..."
        const licenseRef = doc(db, "licenses", userId)
        // check if the data is existing before
        const docSnap = await getDoc(licenseRef)
        if (docSnap.exists()) {
          showToast("License already exists for this user", false)
          console.log("Document data:", docSnap.data())
          return
        } else {
          const license = await setDoc(licenseRef, data)
          showToast("License application submitted successful!", true)
          const response = await emailjs.send(
            "service_gj4ymrn",
            "template_bbuvt7l",
            {
              license_id: userId,
              user_name: data.fullname,
              user_email: data.email,
            }
          )

          console.log(response)

          if (response.status === 200) {
            showToast(
              "An email has been sent to your email containing your License ID",
              true
            )
          } else {
            showToast("Unable to send email", false)
          }
          licenseForm.reset()
        }
      } catch (error) {
        console.log(error)
      } finally {
        submitBtn.textContent = "Submit Application"
      }
    }

    function showError(element, message) {
      element.textContent = message
    }

    function isAdult(dateOfBirth) {
      let today = new Date()
      let eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      )

      let age = new Date(dateOfBirth)
      return age <= eighteenYearsAgo
    }

    function clearErrors() {
      firstNameError.textContent = ""
      lastNameError.textContent = ""
      phoneError.textContent = ""
      emailError.textContent = ""
      addressError.textContent = ""
      privacyError.textContent = ""
      ageError.textContent = ""
      drivingCertError.textContent = ""
      dateOfBirthError.textContent = ""
      disablityError.textContent = ""
    }
  })
  // download the form
  const downloadForm = document.getElementById("download-form")
  downloadForm.addEventListener("click", () => {
    html2canvas(licenseForm).then(canvas => {
      let base64Image = canvas.toDataURL("image/png")
      // console.log(base64Image);
      let pdf = new jsPDF("p", "px", [600, 890])
      pdf.addImage(base64Image, "PNG", 15, 15, 570, 860)
      pdf.save("license.pdf")
    })
  })
})
