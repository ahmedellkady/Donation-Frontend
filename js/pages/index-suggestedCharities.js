import { fetchRecommendedCharitiesForDonor } from "../api/charityApi.js";
import { renderCharityCard } from "../components/charityRenderer.js";

window.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".charity-cards");
    if (!container) return;

    const userJson = localStorage.getItem("user");
    container.innerHTML = "";

    try {
        let charities = [];

        if (userJson) {
            const user = JSON.parse(userJson);
            const donorId = user.id;

            if (donorId) {
                try {
                    charities = await fetchRecommendedCharitiesForDonor(donorId);
                    charities = charities.slice(0, 7);
                } catch (err) {
                    console.warn("AI charity model failed. Falling back to static charities.");
                }
            }
        }

        if (!charities.length) {
            container.innerHTML = "<p>No recommended charities available.</p>";
            return;
        }

        charities.forEach(charity => {
            const card = renderCharityCard(charity);
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading charities:", err);
        container.innerHTML = "<p>Failed to load recommended charities. Please try again later.</p>";
    }
});
