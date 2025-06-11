import { getDonationDetails } from "../api/donationApi.js";

const selectedDonation = localStorage.getItem("selectedDonation");
const donationId = localStorage.getItem("donationId");

let donation;

async function loadDonation() {
    if (selectedDonation) {
        donation = JSON.parse(selectedDonation);
    } else if (donationId) {
        try {
            donation = await getDonationDetails(donationId);
        } catch (err) {
            console.error("Failed to fetch donation by ID:", err);
            document.body.innerHTML = "<p>Error loading donation data.</p>";
            return;
        }
    } else {
        document.body.innerHTML = "<p>No donation selected or ID provided.</p>";
        return;
    }

    renderDonationDetails(donation);
    localStorage.removeItem("selectedDonation");
    localStorage.removeItem("donationId");
}

function renderDonationDetails(donation) {
    document.querySelector(".type-badge").textContent = donation.type;

    const statusElem = document.querySelector(".status");
    statusElem.textContent = donation.status;
    statusElem.classList.add(donation.status.toLowerCase());

    const dateText = new Date(donation.pickup.scheduledDate).toLocaleString("en-US", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });

    document.querySelector(".description").textContent = donation.description;
    const pickupBox = document.querySelector(".section.box + .section.box");
    pickupBox.querySelector("p:nth-of-type(1)").textContent = `Scheduled Time: ${dateText}`;
    pickupBox.querySelector("p:nth-of-type(2)").textContent = `Address: ${donation.pickup.location}`;

    document.querySelector(".charity-info p strong").textContent = donation.charityName;
}

loadDonation();
