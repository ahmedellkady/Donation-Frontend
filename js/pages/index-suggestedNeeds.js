import { fetchSuggestedNeedsForDonor, fetchNeeds } from "../api/needApi.js";
import { renderNeedCard } from "../components/needRenderer.js";
import { redirectToDonate } from "../utils/navigation.js";

window.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".needs-container");
    if (!container) return;

    const userJson = localStorage.getItem("user");

    try {
        container.innerHTML = "";

        let needs = [];
        let showMatch = false;

        if (userJson) {
            const user = JSON.parse(userJson);
            const donorId = user.id;

            if (donorId) {
                try {
                    needs = await fetchSuggestedNeedsForDonor(donorId);
                    showMatch = true;
                } catch (err) {
                    console.warn("AI model failed. Falling back to public needs.");
                }
            }
        }

        if (!needs || !needs.length) {
            const publicNeeds = await fetchNeeds();
            needs = publicNeeds.slice(0, 7);
            showMatch = false;
        }

        if (!needs.length) {
            container.innerHTML = "<p>No suggested or public needs available.</p>";
            return;
        }

        needs.forEach(need => {
            const card = renderNeedCard(need, {
                showMatch,
                onDonate: redirectToDonate
            });
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading needs:", err);
        container.innerHTML = "<p>Failed to load needs. Please try again later.</p>";
    }
});
