import { getDonationCount, getUpcomingPickup, getDonationHistory, cancelDonation } from "../api/donationApi.js";
import { getDonorId, getDonorName } from "../components/userSession.js";
import { fetchSuggestedNeedsForDonor } from "../api/needApi.js";
import { redirectToDonationDetails, redirectToDonate } from "../utils/navigation.js";

document.addEventListener("DOMContentLoaded", async () => {
    const donorId = getDonorId();
    const userName = getDonorName();

    if (!donorId || !userName) return;

    document.querySelector(".welcome h1").textContent = `Welcome, ${userName} 👋`;

    try {
        const count = await getDonationCount(donorId);
        document.querySelector(".summary-combined .summary-number").textContent = count;

        const pickup = await getUpcomingPickup(donorId);
        document.querySelector(".summary-combined .summary-date").textContent =
            formatDateTime(pickup.scheduledDate);
    } catch (err) {
        console.error("Dashboard summary fetch error:", err.message);
        document.querySelector(".summary-combined .summary-date").textContent = "No pickup found";
    }

    try {
        const donations = await getDonationHistory(donorId);
        renderDonationHistory(donations);
    } catch (e) {
        console.error("Failed to fetch donation history:", e.message);
    }

    try {
        const needs = await fetchSuggestedNeedsForDonor(donorId);
        renderSuggestedNeedsTable(needs);
    } catch (e) {
        console.error("Failed to fetch needs:", e.message);
    }
});

function renderDonationHistory(donations) {
    const tbody = document.getElementById("donations-table-body");
    tbody.innerHTML = "";

    if (!donations.length) {
        tbody.innerHTML = "<tr><td colspan='5'>No donations found.</td></tr>";
        return;
    }

    donations.forEach(donation => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${donation.type}</td>
          <td>${donation.quantity}</td>
          <td class="status-cell"><span class="status ${getStatusClass(donation.status)}">${donation.status}</span></td>
          <td>${formatDateTime(donation.pickup?.scheduledDate)}</td>
        `;

        const actionCell = document.createElement("td");

        const viewLink = document.createElement("a");
        viewLink.href = "#";
        viewLink.textContent = "View";
        viewLink.addEventListener("click", () => redirectToDonationDetails(donation));
        actionCell.appendChild(viewLink);

        if (donation.donorFeedback === null && donation.status === "DELIVERED") {
            const feedbackLink = document.createElement("a");
            feedbackLink.href = `feedback.html?id=${donation.id}`;
            feedbackLink.textContent = " Feedback";
            actionCell.appendChild(feedbackLink);
        }

        const status = donation.status?.toUpperCase();
        if (status === "PENDING" || status === "SCHEDULED") {
            const cancelLink = document.createElement("a");
            cancelLink.href = "#";
            cancelLink.className = "cancel";
            cancelLink.textContent = " Cancel";
            cancelLink.addEventListener("click", () => openModal(donation));
            actionCell.appendChild(cancelLink);
        }

        row.appendChild(actionCell);
        tbody.appendChild(row);
    });

}

function renderSuggestedNeedsTable(needs, tableSelector = "#suggested-needs-table tbody") {
    const tbody = document.querySelector(tableSelector);
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!needs.length) {
        tbody.innerHTML = "<tr><td colspan='6'>No suggested needs available.</td></tr>";
        return;
    }

    needs.forEach(need => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${need.type}</td>
          <td>${need.quantity}</td>
          <td class="status-cell"><span class="status ${getUrgencyClass(need.urgency)}">${need.urgency}</span></td>
          <td>${need.charityName}</td>
          <td>${need.city}</td>
        `;

        const actionCell = document.createElement("td");

        const donateButton = document.createElement("a");
        donateButton.href = "#";
        donateButton.textContent = "Donate";
        donateButton.addEventListener("click", () => redirectToDonate(need));

        actionCell.appendChild(donateButton);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

let donationToCancel = null;

window.openModal = function (donation) {
    donationToCancel = donation;

    document.getElementById("modalDonationType").textContent = donation.type;
    document.getElementById("modalPickupDate").textContent = formatDateTime(donation.pickup?.scheduledDate);

    document.getElementById("cancelModal").style.display = "flex";
};

window.closeModal = function () {
    document.getElementById("cancelModal").style.display = "none";
    donationToCancel = null;
};

window.confirmCancel = async function () {
    if (!donationToCancel) return;

    try {
        await cancelDonation(donationToCancel.id);
        alert("Donation canceled successfully.");
        window.location.reload();
    } catch (error) {
        alert("Failed to cancel donation.");
        console.error(error);
    } finally {
        closeModal();
    }
};

function getUrgencyClass(urgency) {
    switch (urgency.toLowerCase()) {
        case "critical": return "critical";
        case "medium": return "medium";
        case "low": return "low";
        default: return "";
    }
}

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
        year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "2-digit"
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
