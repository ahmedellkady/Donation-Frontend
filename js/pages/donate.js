import { submitDonation } from "../api/donationApi.js";
import { trackActivity } from "../components/activityTracker.js";

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const charityName = decodeURIComponent(params.get("charityName"));
    const needType = decodeURIComponent(params.get("needType"));
    const needQuantity = decodeURIComponent(params.get("needQuantity"));
    const urgency = decodeURIComponent(params.get("urgency"));
    const city = decodeURIComponent(params.get("city"));
    const description = decodeURIComponent(params.get("description"));
    const charityId = decodeURIComponent(params.get("charityId"));

    const leftSection = document.querySelector(".left-section");
    leftSection.innerHTML = `
    <h2>${charityName}</h2>
    <p><strong>Category:</strong> ${needType}</p>
    <p><strong>Quantity:</strong> ${needQuantity}</p>
    <p><strong>Urgency:</strong> ${urgency}</p>
    <p><strong>City:</strong> ${city}</p>
    <p class="description">${description}</p>
  `;

    const quantityInput = document.getElementById("quantity");
    if (needQuantity) {
        quantityInput.max = parseInt(needQuantity);
    }

    const donationForm = document.getElementById("donationForm");
    donationForm.addEventListener("submit", function (event) {
        event.preventDefault();
        handleSubmitDonation(needType, charityId, city);
    });
});

async function handleSubmitDonation(needType, charityId, city) {
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
        pickup: pickup,
        charityId: parseInt(charityId)
    };

    console.log("Sending donation:", donationPayload);

    try {
        const response = await submitDonation(donorId, donationPayload);

        if (response.ok) {
            await trackActivity("DONATE", parseInt(charityId));
            alert("Donation submitted successfully!");
            window.location.href = "charities.html";
        } else {
            alert("Failed to submit donation.");
        }
    } catch (error) {
        alert("An error occurred while submitting your donation.");
    }
}


function getDonorId() {
    const userJson = localStorage.getItem("user");

    if (!userJson) {
        return null;
    }

    const user = JSON.parse(userJson);

    return user.id || null;
}

function generateFullDateTime(datePart, timePart) {
    const seconds = "00";

    return `${datePart}T${timePart}:${seconds}`;
}
