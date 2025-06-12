import { fetchCharities, fetchRecommendedCharitiesForDonor } from "../api/charityApi.js";
import { renderCharityCard } from "../components/charityRenderer.js";

window.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".charity-cards");
    if (!container) return;

    const userJson = localStorage.getItem("user");
    container.innerHTML = "";

    let charities = [];

    try {
        if (userJson) {
            const user = JSON.parse(userJson);
            const donorId = user.id;

            if (donorId) {
                try {
                    charities = await fetchRecommendedCharitiesForDonor(donorId);
                } catch (err) {
                    console.warn("⚠️ AI recommendation failed. Falling back to general charities.");
                }
            }
        }

        // If AI response is empty or donor not logged in, fallback to general charities (first 7)
        if (!Array.isArray(charities) || !charities.length) {
            try {
                console.log("🔄 Fetching fallback charities (first 7)...");
                const response = await fetchCharities("", "", 0, 7);
                charities = response.content; // ✅ Extract the actual list
                console.log("✅ Fallback charities loaded:", charities);
            } catch (err) {
                console.error("❌ Fallback fetchCharities() failed:", err);
                container.innerHTML = "<p>Failed to load charities.</p>";
                return;
            }
        }

        charities.forEach(charity => {
            const card = renderCharityCard(charity);
            container.appendChild(card);
        });

    } catch (err) {
        console.error("🔥 Unexpected error loading charities:", err);
        container.innerHTML = "<p>Failed to load charities. Please try again later.</p>";
    }
});
