import { fetchActiveNeeds, countActiveNeeds, deleteNeedById } from "../api/needApi.js";
import { fetchIncomingDonations, countIncomingDonations, pickupScheduled, pickupPickedUp, pickupDelivered } from "../api/donationApi.js";

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const charityId = user?.id;
    const charityName = user?.name;
    if (!charityId) return;

    await populateActiveNeeds(charityId);
    await populateActiveCount(charityId);
    await populateIncomingDonations(charityId);
    await populateDonationCount(charityId);
    document.getElementById("charity-name").textContent = `Welcome, ${charityName}`;
});

async function populateActiveNeeds(charityId) {
    try {
        const needs = await fetchActiveNeeds(charityId);
        const tbody = document.getElementById("needs-table-body");
        tbody.innerHTML = "";

        if (!needs.length) {
            tbody.innerHTML = `<tr><td colspan="6">No active needs found.</td></tr>`;
            return;
        }

        needs.forEach(need => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${need.id}</td>
            <td>${need.type}</td>
            <td>${need.quantity}</td>
            <td class="status-cell"><span class="status ${getUrgencyClass(need.urgency)}">${need.urgency}</span></td>
            <td>${need.city}</td>
            <td>${new Date(need.createdAt).toLocaleDateString()}</td>
            `;

            const actionCell = document.createElement("td");
            const deleteLink = document.createElement("a");
            deleteLink.href = "#";
            deleteLink.className = "cancel";
            deleteLink.textContent = "Delete";
            deleteLink.addEventListener("click", async () => {
                const confirmed = confirm(`Are you sure you want to delete need #${need.id}?`);
                if (!confirmed) return;

                try {
                    await deleteNeedById(need.id);
                    alert(`Need #${need.id} deleted successfully.`);
                    await populateActiveNeeds(need.charityId); // refresh list
                } catch (err) {
                    alert("Failed to delete need.");
                    console.error(err);
                }
            });

            actionCell.appendChild(deleteLink);
            row.appendChild(actionCell);
            tbody.appendChild(row);

        });
    } catch (err) {
        console.error("Error fetching active needs:", err);
    }
}

async function populateActiveCount(charityId) {
    try {
        const count = await countActiveNeeds(charityId);
        const countElement = document.querySelector(".summary-combined .summary-number");
        if (countElement) countElement.textContent = count;
    } catch (err) {
        console.error("Error fetching active need count:", err);
    }
}

async function populateIncomingDonations(charityId) {
    try {
        const donations = await fetchIncomingDonations(charityId);
        const tbody = document.getElementById("donations-table-body");
        tbody.innerHTML = "";

        if (!donations.length) {
            tbody.innerHTML = `<tr><td colspan="6">No incoming donations.</td></tr>`;
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

            // Conditional action links
            const status = donation.status.toUpperCase();

            if (status === "PENDING") {
                const scheduleLink = document.createElement("a");
                scheduleLink.href = "#";
                scheduleLink.textContent = " Schedule";
                scheduleLink.style.marginLeft = "8px";
                scheduleLink.addEventListener("click", () => handleSchedule(donation));
                actionCell.appendChild(scheduleLink);
            }

            if (status === "SCHEDULED") {
                const pickedUpLink = document.createElement("a");
                pickedUpLink.href = "#";
                pickedUpLink.textContent = " Picked Up";
                pickedUpLink.style.marginLeft = "8px";
                pickedUpLink.addEventListener("click", () => handlePickedUp(donation));
                actionCell.appendChild(pickedUpLink);
            }

            if (status === "PICKED_UP") {
                const deliveredLink = document.createElement("a");
                deliveredLink.href = "#";
                deliveredLink.textContent = " Delivered";
                deliveredLink.style.marginLeft = "8px";
                deliveredLink.addEventListener("click", () => handleDelivered(donation));
                actionCell.appendChild(deliveredLink);
            }

            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Error fetching incoming donations:", err);
    }
}

async function populateDonationCount(charityId) {
    try {
        const count = await countIncomingDonations(charityId);
        const dateSpan = document.querySelector(".summary-combined .summary-date");
        if (dateSpan) dateSpan.textContent = `${count} scheduled`;
    } catch (err) {
        console.error("Error fetching incoming donation count:", err);
    }
}

function getUrgencyClass(urgency) {
    switch (urgency.toLowerCase()) {
        case "critical": return "critical";
        case "medium": return "medium";
        case "low": return "low";
        default: return "";
    }
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

async function handleSchedule(donation) {
    try {
        await pickupScheduled(donation.id);
        alert(`Pickup for donation #${donation.id} has been scheduled.`);
        window.location.reload();
    } catch (err) {
        alert("Failed to schedule pickup.");
        console.error(err);
    }
}

async function handlePickedUp(donation) {
    try {
        await pickupPickedUp(donation.id);
        alert(`Donation #${donation.id} marked as picked up.`);
        window.location.reload();
    } catch (err) {
        alert("Failed to mark as picked up.");
        console.error(err);
    }
}

async function handleDelivered(donation) {
    try {
        await pickupDelivered(donation.id);
        alert(`Donation #${donation.id} marked as delivered.`);
        window.location.reload();
    } catch (err) {
        alert("Failed to mark as delivered.");
        console.error(err);
    }
}