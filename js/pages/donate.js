import { submitDonation } from "../api/donationApi.js";
import { trackActivity } from "../components/activityTracker.js";
import { getDonorId } from "../components/userSession.js";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const charityName = decodeURIComponent(params.get("charityName"));
    const needType = decodeURIComponent(params.get("needType"));
    const needQuantity = decodeURIComponent(params.get("needQuantity"));
    const urgency = decodeURIComponent(params.get("urgency"));
    const city = decodeURIComponent(params.get("city"));
    const description = decodeURIComponent(params.get("description"));
    const charityId = decodeURIComponent(params.get("charityId"));
    const createdAt = decodeURIComponent(params.get("createdAt"));
    const needId = decodeURIComponent(params.get("needId"));

    renderLeftSection({ charityName, needType, needQuantity, urgency, city, description, createdAt });

    const quantityInput = document.getElementById("quantity");
    if (needQuantity) quantityInput.max = parseInt(needQuantity);

    const pickupDateInput = document.getElementById("pickupDate");
    pickupDateInput.min = new Date().toISOString().split("T")[0];

    document.getElementById("donationForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSubmitDonation({ needType, charityId, city, needId });
    });
});

function renderLeftSection({ charityName, needType, needQuantity, urgency, city, description, createdAt }) {
    const section = document.querySelector(".left-section");
    section.innerHTML = `
    <h2>${charityName}</h2>
    <p><strong>Category:</strong> ${needType}</p>
    <p><strong>Quantity:</strong> ${needQuantity}</p>
    <p><strong>Urgency:</strong> ${urgency}</p>
    <p><strong>City:</strong> ${city}</p>
    <p><strong>Created At:</strong> ${createdAt} </p>
    <p class="description">${description}</p>
  `;
}

async function handleSubmitDonation({ needType, charityId, city, needId }) {
    const quantity = document.getElementById("quantity").value;
    const pickupDate = document.getElementById("pickupDate").value;
    const pickupTime = document.getElementById("pickupTime").value;

    const donorId = getDonorId();
    if (!donorId) {
        alert("Donor not logged in. Please log in first.");
        return;
    }

    const pickup = {
        scheduledDate: generateFullDateTime(pickupDate, pickupTime),
        location: city
    };

    const donationPayload = {
        type: needType,
        quantity: parseInt(quantity),
        pickup,
        charityId: parseInt(charityId), 
        needId: parseInt(needId),
        description: document.getElementById("donationItem").value
    };

    try {
        await submitDonation(donorId, donationPayload);

        await trackActivity("DONATE", parseInt(charityId));
        alert("Donation submitted successfully!");
        window.location.href = "charities.html";
    } catch (err) {
        alert("An error occurred while submitting your donation.");
        console.error(err);
    }
}

export function generateFullDateTime(datePart, timePart) {
    const seconds = "00";
    return `${datePart}T${timePart}:${seconds}`;
}