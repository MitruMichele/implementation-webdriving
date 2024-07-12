const Siginbtn = document.getElementById("signinbtn")

// Modal
const modal = document.getElementById("modal")
const openModalBtn = document.getElementById("openModal")
const closeModalBtn = document.querySelector(".close")
const modalOverlay = document.querySelector(".modal-overlay")
const yesBtn = document.getElementById("yesBtn")
const noBtn = document.getElementById("noBtn")

openModalBtn.addEventListener("click", function () {
  modal.style.display = "block"
})

closeModalBtn.addEventListener("click", function () {
  closeModal()
})

modalOverlay.addEventListener("click", function () {
  closeModal()
})

yesBtn.addEventListener("click", function () {
  // Perform action on yes button click
  console.log("Yes clicked")
  closeModal() // Close modal after action
})

noBtn.addEventListener("click", function () {
  closeModal()
  window.location.href = "/pages/new-license-form.html"
})

function closeModal() {
  modal.style.display = "none"
  modal.classList.remove("show")
}
const userId = window.localStorage.getItem("userId")
const userDetails = window.localStorage.getItem("userDetails")
const user = JSON.parse(userDetails)
function checkIsLogin() {
  console.log("Check Is Login")
  console.log({ userId, userDetails })
  if (userId) {
    Siginbtn.textContent = user.role === "admin" ? "Go to dashboard" : "Log Out"
    Siginbtn.addEventListener("click", () => {
      window.location.href =
        user.role === "admin" ? "/pages/admin.html" : "/pages/login.html"
    })
  } else {
    Siginbtn.textContent = "Sign In"
    Siginbtn.addEventListener("click", () => {
      window.location.href = "/pages/login.html"
    })
  }
}
export function goToLogin() {
  if (!userId) {
    window.location.href = "/pages/login.html"
  }
}
checkIsLogin()

// NAV ITEMS
const allNavItems = document.querySelectorAll(".nav-item")
function focusNavItem(item) {
  allNavItems.forEach(item => {
    item.classList.remove("active-link")
  })
  item.classList.add("active-link")
}

allNavItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    focusNavItem(item)
  })
})

// default
export function focusActiveNavItem(index) {
  allNavItems[index].classList.add("active-link")
}
