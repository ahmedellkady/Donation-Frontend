import { getDonationsForCharity } from "../api/donationApi.js";
import { redirectToDonationDetails } from "../utils/navigation.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const charityId = user?.id;
  if (!charityId) return;

  try {
    const donations = await getDonationsForCharity(charityId);
    renderDonationsTable(donations);
  } catch (err) {
    console.error("Failed to load donations:", err);
    document.getElementById("donations-table-body").innerHTML =
      "<tr><td colspan='6'>Failed to load donations.</td></tr>";
  }
});

function renderDonationsTable(donations) {
  const tbody = document.getElementById("donations-table-body");
  tbody.innerHTML = "";

  if (!donations.length) {
    tbody.innerHTML = "<tr><td colspan='6'>No donations found.</td></tr>";
    return;
  }

  donations.forEach(donation => {
    const pickupDate = donation.pickup?.scheduledDate
      ? new Date(donation.pickup.scheduledDate).toLocaleString()
      : "—";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${donation.donorName}</td>
      <td>${donation.type}</td>
      <td>${donation.quantity}</td>
      <td class="status-cell"><span class="status ${getStatusClass(donation.status)}">${donation.status}</span></td>
      <td>${pickupDate}</td>
    `;

    const actionCell = document.createElement("td");
    const viewLink = document.createElement("a");
    viewLink.href = "#";
    viewLink.textContent = "Details";
    viewLink.addEventListener("click", () => {
      localStorage.setItem("selectedDonation", JSON.stringify(donation));
      window.location.href = "donation-details-feedback.html";
    });
    actionCell.appendChild(viewLink);

    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "pending": return "pending";
    case "picked_up": return "picked-up";
    case "delivered": return "delivered";
    case "canceled": return "canceled";
    case "scheduled": return "scheduled";
    default: return "pending";
  }
}
