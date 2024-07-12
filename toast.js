export function showToast(message, isSuccess) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "toast";
  if (isSuccess) {
    toast.classList.add("toast-success");
  } else {
    toast.classList.add("toast-failure");
  }

  toastContainer.appendChild(toast);

  // Show toast
  setTimeout(function () {
    toast.style.display = "block";
    setTimeout(function () {
      toast.style.opacity = 1;
    }, 100);
  }, 300);

  // Hide toast after 3 seconds
  setTimeout(function () {
    toast.style.opacity = 0;
    setTimeout(function () {
      toast.style.display = "none";
      toastContainer.removeChild(toast);
    }, 600);
  }, 3000);
}
