// js/pages/charity.js (Refactored)
import { fetchCharityById } from "../api/charityApi.js";
import { fetchNeedsByCharity } from "../api/needApi.js";
import { trackActivity } from "../components/activityTracker.js";
import { renderNeedCard } from "../components/needRenderer.js";
import { redirectToDonate } from "../utils/navigation.js";

let allNeeds = [];
let charityId = null;
let viewAlreadySent = false;
let viewTimer;

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    charityId = params.get("id");

    if (!charityId) {
        document.getElementById("needs-container").innerHTML = "<p>No charity ID provided.</p>";
        return;
    }

    localStorage.setItem("lastViewedCharityId", charityId);
    localStorage.setItem("charityInteraction", "false");

    viewTimer = setTimeout(async () => {
        if (!viewAlreadySent) await sendViewActivity();
        
    }, 60000);

    loadCharity(charityId);
    loadNeeds(charityId);

    document.querySelector(".filter-form")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!viewAlreadySent) await sendViewActivity();
        
        applyFilters();
    });
});

async function sendViewActivity() {
    await trackActivity("VIEW", parseInt(charityId));
    viewAlreadySent = true;
    clearTimeout(viewTimer);
    localStorage.setItem("charityInteraction", "true");
}

async function loadCharity(id) {
    try {
        const charity = await fetchCharityById(id);
        document.getElementById("charity-name").innerText = charity.name;
        document.getElementById("charity-description").innerText = charity.description;
    } catch (err) {
        console.error("Failed to load charity:", err);
        document.getElementById("needs-container").innerHTML = "<p>Error loading charity information.</p>";
    }
}

async function loadNeeds(id) {
    const container = document.getElementById("needs-container");
    container.innerHTML = "";

    try {
        allNeeds = await fetchNeedsByCharity(id);

        if (!allNeeds.length) {
            container.innerHTML = "<p>No needs posted yet.</p>";
            return;
        }

        renderNeeds(allNeeds);
    } catch (err) {
        console.error("Failed to load needs:", err);
        container.innerHTML = "<p>Error loading needs.</p>";
    }
}

function applyFilters() {
    const city = getInputValue("location").toLowerCase();
    const category = getInputValue("category");
    const urgency = getInputValue("urgency").toUpperCase();

    let filtered = allNeeds;

    if (city) filtered = filtered.filter(n => n.city?.toLowerCase() === city);
    if (category) filtered = filtered.filter(n => n.type === category);
    if (urgency) filtered = filtered.filter(n => n.urgency?.toUpperCase() === urgency);

    renderNeeds(filtered);
}

function renderNeeds(needs) {
    const container = document.getElementById("needs-container");
    container.innerHTML = "";

    if (!needs.length) {
        container.innerHTML = "<p>No needs match your filters.</p>";
        return;
    }

    needs.forEach((need) => {
        const card = renderNeedCard(need, {
            showMatch: false,
            onDonate: (n) => {
                if (!viewAlreadySent) sendViewActivity();

                const charityName = document.getElementById("charity-name").innerText;
                redirectToDonate({ ...n, charityId, charityName });
            }
        });
        container.appendChild(card);
    });
}

function getInputValue(id) {
    return document.getElementById(id)?.value.trim() || "";
}