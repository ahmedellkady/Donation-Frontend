import { fetchSuggestedNeedsForDonor } from "../api/needApi.js";
import { renderNeedCard } from "../components/needRenderer.js";
import { redirectToDonate } from "../utils/navigation.js";

let currentPage = 0;
const pageSize = 10;

async function loadNeedsPage(donorId, page) {
    const container = document.querySelector(".needs-container");
    container.innerHTML = "Loading...";

    try {
        const response = await fetchSuggestedNeedsForDonor(donorId, page, pageSize);
        const { content, totalPages } = response;

        container.innerHTML = "";
        content.forEach(need => {
            const card = renderNeedCard(need, {
                showMatch: true,
                onDonate: redirectToDonate
            });
            container.appendChild(card);
        });

        renderPaginationControls(totalPages, page);
    } catch (err) {
        container.innerHTML = "<p>Failed to load needs.</p>";
        console.error(err);
    }
}

function renderPaginationControls(totalPages, current) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Clear existing buttons

    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.className = "pagination-button";
        if (i === current) btn.disabled = true;

        btn.addEventListener("click", () => {
            currentPage = i;
            const donor = JSON.parse(localStorage.getItem("user"));
            loadNeedsPage(donor.id, currentPage);
        });

        paginationContainer.appendChild(btn);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
        loadNeedsPage(user.id, currentPage);
    }
});
