import { getDonorFeedback, submitFeedback } from "../api/feedbackApi.js";
import { getDonationDetails } from "../api/donationApi.js";

const donationId = localStorage.getItem("donationId");
const storedDonation = localStorage.getItem("selectedDonation");
const feedbackSection = document.getElementById("feedback-section");

let donation = storedDonation ? JSON.parse(storedDonation) : null;

async function loadDonation() {
    try {
        if (!donation && donationId) {
            donation = await getDonationDetails(donationId);
        }

        if (!donation) {
            document.body.innerHTML = "<p>Donation data not found.</p>";
            return;
        }

        renderDonationDetails(donation);
        await loadDonorFeedback(donation.id);
        setupCharityFeedbackSubmission(donation.id);

        // Cleanup storage
        localStorage.removeItem("selectedDonation");
        localStorage.removeItem("donationId");
    } catch (err) {
        console.error("Error loading donation or feedback:", err);
        document.body.innerHTML = "<p>Error loading donation information.</p>";
    }
}

function renderDonationDetails(d) {
    document.querySelector(".type-badge").textContent = d.type;
    const statusElem = document.querySelector(".status");
    statusElem.textContent = d.status;
    statusElem.classList.add(d.status.toLowerCase());
    document.querySelector(".description").textContent = d.description || "N/A";
    document.querySelector(".quantity").textContent = d.quantity || "N/A";

    const dateText = new Date(d.pickup.scheduledDate).toLocaleString("en-US", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
    document.getElementById("pickup-time").textContent = `Scheduled Time: ${dateText}`;
    document.getElementById("pickup-location").textContent = `Address: ${d.pickup.location}`;
    document.getElementById("donor-name").textContent = d.donorName || "Unknown";
}

async function loadDonorFeedback(donationId) {
    try {
        const data = await getDonorFeedback(donationId);
        if (!data || !data.comment) {
            feedbackSection.innerHTML = "<p>No feedback submitted yet.</p>";
            return;
        }

        const starContainer = document.getElementById("feedback-stars");
        starContainer.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("i");
            star.className = i <= data.rating ? "fas fa-star" : "far fa-star";
            star.style.color = "#ffcc00";
            starContainer.appendChild(star);
        }
        document.getElementById("feedback-comment").textContent = data.comment;
    } catch (err) {
        console.error("Feedback fetch error:", err);
        feedbackSection.innerHTML = "<p>Error loading feedback.</p>";
    }
}

function setupCharityFeedbackSubmission(donationId) {
    let charityRating = 0;
    const charityStars = document.querySelectorAll("#charity-stars i");
    const commentInput = document.getElementById("charity-comment");
    const submitBtn = document.getElementById("submit-charity-feedback");

    charityStars.forEach(star => {
        star.addEventListener("click", () => {
            charityRating = parseInt(star.getAttribute("data-value"));
            charityStars.forEach((s, index) => {
                s.classList.toggle("fas", index < charityRating);
                s.classList.toggle("far", index >= charityRating);
            });
        });
    });

    submitBtn.addEventListener("click", async () => {
        const comment = commentInput.value.trim();
        if (charityRating === 0) {
            alert("Please select a rating.");
            return;
        }
        if (!comment) {
            alert("Please enter a comment.");
            return;
        }

        const payload = {
            donationId,
            rating: charityRating,
            comment,
            forRole: "CHARITY"
        };

        try {
            await submitFeedback(payload);
            alert("Charity feedback submitted successfully.");
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitted";
        } catch (err) {
            console.error("Submit error:", err);
            alert("Error submitting feedback.");
        }
    });
}

loadDonation();
