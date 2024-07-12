import { focusActiveNavItem } from "./nav.js";
// get step variables
const detail = document.querySelector(".detail");
const allSteps = document.querySelectorAll(".step-item");

document.addEventListener("DOMContentLoaded", function () {
  const applyNew = `
        <h3>Apply for new driver's licence</h3>
            <p>Use this option if you are applying for a licence for the first time.</p>
            <h3>Prerequisite</h3>
            <div class="requirement">
                <ul>
                    <li>Applicant must be 18 years and above.</li>
                    <li>Applicant must have completed driving school.</li>
                </ul>
                <button class="apply-btn" onclick='(()=>{
                  console.log("clicked")
                  document.getElementById("modal").removeAttribute("style")
                  document.getElementById("modal").classList.add("show")

                })()'>Apply Now</button>
            </div>
`;
  const renew = `
<h3>Apply for renewal</h3>
<div style="display: flex; align-items: last baseline; gap: 1.5rem
;" >
    <p style="width: 80%;">The holder of a valid licence may apply for and obtain a renewal of the licence at any time from 30 days before the expiry date of the licence.
        Applicant apply and complete the form online, make payment, confirm payment at Board or Internal Revenue, proceed to VIO for test and visit FRSC 
        Drivers Licence Centre for Biometric Capture.</p>
<button class="apply-btn" onclick="window.location.href='/pages/edit.html' "> Apply Now   </button>
</div>
`;

  const reissue = `
<h3>Apply for reissue</h3>
           <p>A re-issue or replacement of licence can be issued if the licence is illegible, defaced, lost or stolen. The applicant shall apply to the authority after the following conditions have been met</p>
           <div class="requirement">
            <ul>
                <li>Obtain police extract stating particulars of the loss, damage or defacement.</li>
                <li>Swear an affidavit stating the fact of the loss, damage or defacement.</li>
                <li>Pay the prescribed fee.</li>
            </ul>
            <button class="apply-btn" onclick="window.location.href='/pages/edit.html' ">Apply Now</button>
        </div>
`;

  function changeStep(content) {
    detail.innerHTML = content;
  }

  // focus home
  focusActiveNavItem(0);

  // STEPS
  const steps = [applyNew, renew, reissue];
  // default
  changeStep(steps[0]);
  allSteps[0].classList.add("focus");

  function focusStep(step) {
    allSteps.forEach((step) => {
      step.classList.remove("focus");
    });
    step.classList.add("focus");
  }
  allSteps.forEach((step, index) => {
    step.addEventListener("click", () => {
      changeStep(steps[index]);
      focusStep(step);
    });
  });

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      // Get form values
      var firstName = document.getElementById("first-name").value;
      var lastName = document.getElementById("last-name").value;
      var message = document.getElementById("message").value;

      // Display submitted values (for demonstration)
      alert(
        "First Name: " +
          firstName +
          "\nLast Name: " +
          lastName +
          "\nMessage: " +
          message
      );

      // Reset form
      this.reset();
    });
});
