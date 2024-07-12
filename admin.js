import {
  getFirestore,
  getDocs,
  collection,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app } from "./firebase.js";
import { showToast } from "./toast.js";

const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const userId = window.localStorage.getItem("userId");
  const userDetails = window.localStorage.getItem("userDetails");
  const user = JSON.parse(userDetails);

  if (!userId) {
    window.location.href = "/pages/login.html";
  }

  if (user.role !== "admin") {
    window.location.href = "/index.html";
  }

  document.querySelector(".userName").textContent = user.firstName;

  const tableData = {
    usersTable: [],
    licenseTable: [],
  };

  const logoutBtn = document.querySelector(".logoutBtn");
  logoutBtn.addEventListener("click", () => {
    window.localStorage.removeItem("userId");
    window.location.href = "/pages/login.html";
  });

  const backBtn = document.querySelector(".backBtn");
  backBtn.addEventListener("click", () => {
    window.location.href = "/index.html";
  });

  async function getResource(resource) {
    try {
      const querySnapshot = await getDocs(collection(db, resource));
      const resources = [];

      querySnapshot.forEach((doc) => {
        resources.push({ id: doc.id, ...doc.data() });
      });

      return resources;
    } catch (error) {
      console.error("Error getting users:", error.message);
    }
  }

  // Update Users Table
  getResource("users").then((resource) => {
    tableData.usersTable = resource.map((user) => {
      const newUser = {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      };
      return newUser;
    });
  });

  // Update License Table
  getResource("licenses").then((resource) => {
    const licenses = resource.map((license) => {
      return {
        "License ID": license.id,
        email: license.email,
        fullname: license.fullname,
        dateOfBirth: license.dateOfBirth,
        drivingCertificateId: license.drivingCertificateNumber,
        isAdult: license.isAdult,
        isDisabled: license.isDisable,
        isExpired: license.isExpired,
        phone: license.phone,
        isNew: license.isNew,
        approved: license.approve,
      };
    });
    tableData.licenseTable = licenses;
    showTable("licenseTable");
  });

  function showTable(tableId) {
    // Hide all table containers
    let tableContainers = document.querySelectorAll(".table-container");
    tableContainers.forEach(function (container) {
      container.style.display = "none";
    });

    // Show the selected table container
    let selectedContainer = document.getElementById(tableId);
    if (selectedContainer) {
      selectedContainer.style.display = "block";
    }

    // Populate the table with data
    let table = selectedContainer.querySelector("table");
    let data = tableData[tableId];
    if (table && data && data.length > 0) {
      table.innerHTML = ""; // Clear existing table content

      // Add table caption
      let caption = `<caption>${tableId.slice(0, -5)} Table</caption>`;

      // Create table header
      const approveHeader =
        tableId === "licenseTable" ? "<th>Update Record</th>" : "";
      let headers = Object.keys(data[0]);
      let headerRow =
        "<tr>" +
        headers.map((header) => "<th>" + header + "</th>").join("") +
        approveHeader +
        "</tr>";

      // Create table rows
      const updateButton = (row) =>
        tableId === "licenseTable"
          ? `<td>
              <button class="update-record-btn" data-id="${row["License ID"]}">Update Record</button>
            </td>`
          : "";
      let rows = data
        .map(
          (row) =>
            "<tr>" +
            headers.map((header) => "<td>" + row[header] + "</td>").join("") +
            updateButton(row) +
            "</tr>"
        )
        .join("");

      // Populate table
      table.innerHTML = caption + headerRow + rows;

      // Attach event listeners to the update buttons
      const updateRecordButtons =
        document.querySelectorAll(".update-record-btn");
      updateRecordButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const licenseId = event.target.dataset.id;
          showUpdateModal(licenseId);
        });
      });
    } else if (table) {
      table.innerHTML =
        "<h2 style='text-align:center; padding-top:2rem;'> No Record Available. </h2>"; // Clear existing table content
    }

    // Highlight the active button
    var sidebarButtons = document.querySelectorAll(".sidebar-btn");
    sidebarButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    var activeBtn = document.querySelector(
      'span[data-table="' + tableId + '"]'
    );
    if (activeBtn) {
      activeBtn.classList.add("active");
    }
  }

  function showUpdateModal(licenseId) {
    const modalHtml = `
      <div class="modal" id="updateModal">
        <div class="modal-content">
          <h4>Update Record</h4>
          <p>Do you want to approve or deny this license?</p>
          <button id="approveBtn" class="modal-btn" data-id="${licenseId}">Approve</button>
          <button id="denyBtn" class="modal-btn" data-id="${licenseId}">Deny</button>
          <button id="closeModalBtn" class="modal-btn">Close</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const updateModal = document.getElementById("updateModal");
    const approveBtn = document.getElementById("approveBtn");
    const denyBtn = document.getElementById("denyBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");

    approveBtn.addEventListener("click", async () => {
      await updateLicenseStatus(licenseId, "Approved");
      updateModal.remove();
    });

    denyBtn.addEventListener("click", async () => {
      await updateLicenseStatus(licenseId, "Denied");
      updateModal.remove();
    });

    closeModalBtn.addEventListener("click", () => {
      updateModal.remove();
    });
  }

  async function updateLicenseStatus(licenseId, status) {
    try {
      const licenseRef = doc(db, "licenses", licenseId);
      await updateDoc(licenseRef, { approve: status });

      // Update the local tableData
      tableData.licenseTable = tableData.licenseTable.map((license) =>
        license["License ID"] === licenseId
          ? { ...license, approved: status }
          : license
      );

      showTable("licenseTable");
      showToast(`License has been ${status.toLowerCase()}.`, true);

      // Send approval/denial email
      const license = tableData.licenseTable.find(
        (lic) => lic["License ID"] === licenseId
      );
      if (status === "Approved") {
        sendApprovalEmail(license);
      } else if (status === "Denied") {
        sendDenialEmail(license);
      }
    } catch (error) {
      console.error(`Error updating license status to ${status}:`, error);
      showToast(`Unable to update license status to ${status}.`, false);
    }
  }

  const showUserTableBtn = document.querySelector("#usersTableBtn");
  const showLicenseTableBtn = document.querySelector("#licenseTableBtn");

  showUserTableBtn.addEventListener("click", () => showTable("usersTable"));
  showLicenseTableBtn.addEventListener("click", () =>
    showTable("licenseTable")
  );
});

async function sendApprovalEmail(license) {
  console.log(license);
  try {
    const response = await emailjs.send("service_c3zdjwc", "template_tmi9avd", {
      license_id: license["License ID"],
      user_name: license.fullname,
      user_email: license.email,
      official_contact: "+2349119073498",
    });

    console.log(response);

    if (response.status === 200) {
      showToast("An approval email has been sent to the license owner.", true);
    } else {
      showToast("Unable to send approval email.", false);
    }
  } catch (error) {
    console.error("Error sending approval email:", error);
    showToast("Unable to send approval email.", false);
  }
}

async function sendDenialEmail(license) {
  console.log(license);
  try {
    const response = await emailjs.send("service_c3zdjwc", "template_o25h7tj", {
      license_id: license["License ID"],
      user_name: license.fullname,
      user_email: license.email,
      official_contact: "+2349119073498",
    });

    console.log(response);

    if (response.status === 200) {
      showToast("A denial email has been sent to the license owner.", true);
    } else {
      showToast("Unable to send denial email.", false);
    }
  } catch (error) {
    console.error("Error sending denial email:", error);
    showToast("Unable to send denial email.", false);
  }
}
