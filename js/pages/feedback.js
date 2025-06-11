import { submitFeedback } from "../api/feedbackApi.js";

const params = new URLSearchParams(window.location.search);
const donationId = parseInt(params.get("id"));

if (isNaN(donationId)) {
    alert("Invalid donation ID");
    throw new Error("Missing or invalid donation ID in URL.");
}

let rating = 0;

const stars = document.querySelectorAll('.stars i');
stars.forEach(star => {
    star.addEventListener('click', () => {
        rating = parseInt(star.getAttribute('data-value'));
        stars.forEach((s, index) => {
            s.classList.toggle('fas', index < rating);
            s.classList.toggle('far', index >= rating);
        });
    });
});

document.querySelector(".submit-btn").addEventListener("click", async () => {
    const comment = document.querySelector("#comment").value.trim();

    if (rating === 0) {
        alert("Please select a rating.");
        return;
    }

    if (comment.length === 0) {
        alert("Please enter a comment.");
        return;
    }

    const feedbackData = {
        donationId,
        rating,
        comment,
        forRole: "DONOR"
    };

    try {
        await submitFeedback(feedbackData);
        alert("Feedback submitted successfully.");
        window.location.href = "donor-dashboard.html";
    } catch (error) {
        console.error("Feedback submission failed:", error);
        alert("Something went wrong. Please try again.");
    }
});
