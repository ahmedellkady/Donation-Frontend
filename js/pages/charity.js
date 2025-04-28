import { fetchCharityById } from "../api/charityApi.js";
import { fetchNeedsByCharity } from "../api/needApi.js";

let allNeeds = [];
let charityId = null;

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    charityId = params.get("id");

    if (!charityId) {
        document.getElementById("needs-container").innerHTML = "<p>No charity ID provided.</p>";
        return;
    }

    loadCharity(charityId);
    loadNeeds(charityId);

    const filterForm = document.querySelector(".filter-form");
    filterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilters();
    });
});

async function loadCharity(charityId) {
    try {
        const charity = await fetchCharityById(charityId);
        document.getElementById("charity-name").innerText = charity.name;
        document.getElementById("charity-description").innerText = charity.description;
    } catch (error) {
        console.error("Failed to load charity:", error);
        document.getElementById("needs-container").innerHTML = "<p>Error loading charity information.</p>";
    }
}

async function loadNeeds(charityId) {
    const container = document.getElementById("needs-container");
    container.innerHTML = "";

    try {
        const needs = await fetchNeedsByCharity(charityId);
        allNeeds = needs;

        if (needs.length === 0) {
            container.innerHTML = "<p>No needs posted yet.</p>";
            return;
        }

        renderNeeds(needs);
    } catch (error) {
        console.error("Failed to load needs:", error);
        container.innerHTML = "<p>Error loading needs.</p>";
    }
}

function renderNeeds(needs) {
    const container = document.getElementById("needs-container");
    container.innerHTML = "";

    if (needs.length === 0) {
        container.innerHTML = "<p>No needs match your filters.</p>";
        return;
    }

    const charityName = document.getElementById("charity-name").innerText;

    needs.forEach(need => {
        let iconClass = "fas fa-hand-holding-heart";
        if (need.type === "FOOD") iconClass = "fas fa-utensils";
        else if (need.type === "CLOTHES") iconClass = "fas fa-tshirt";
        else if (need.type === "FURNITURE") iconClass = "fas fa-couch";
        else if (need.type === "SCHOOL_SUPPLIES") iconClass = "fas fa-pencil-alt";
        else if (need.type === "ELECTRONICS") iconClass = "fas fa-plug";
        else if (need.type === "TOYS") iconClass = "fas fa-puzzle-piece";

        const card = document.createElement("div");
        card.className = "need-card";

        card.innerHTML = `
      <div class="need-header">
        <i class="${iconClass}"></i>
        <div>
          <h3>${need.type}</h3>
          <p>${charityName}</p>
        </div>
      </div>
      <div class="location">
        <i class="fas fa-map-marker-alt"></i>
        <span>${need.city || "Unknown City"}</span>
      </div>
      <div class="urgency-quantity">
        <span class="badge ${need.urgency.toLowerCase()}">${need.urgency}</span>
        <span class="quantity">Quantity: ${need.quantity}</span>
      </div>
      <button 
        class="donate-btn"
        onclick="donateNow(
          '${encodeURIComponent(charityName)}', 
          '${encodeURIComponent(need.type)}', 
          '${encodeURIComponent(need.quantity)}', 
          '${encodeURIComponent(need.urgency)}', 
          '${encodeURIComponent(need.city)}', 
          '${encodeURIComponent(need.id)}', 
          '${encodeURIComponent(need.description)}',
          '${encodeURIComponent(charityId)}'
        )"
      >Donate</button>
    `;

        container.appendChild(card);
    });
}

function applyFilters() {
    const selectedCity = document.getElementById("location").value.toLowerCase();
    const selectedCategory = document.getElementById("category").value;
    const selectedUrgency = document.getElementById("urgency").value.toUpperCase();

    let filteredNeeds = allNeeds;

    if (selectedCity) {
        filteredNeeds = filteredNeeds.filter(need =>
            need.city && need.city.toLowerCase() === selectedCity
        );
    }

    if (selectedCategory) {
        filteredNeeds = filteredNeeds.filter(need =>
            need.type && need.type === selectedCategory
        );
    }

    if (selectedUrgency) {
        filteredNeeds = filteredNeeds.filter(need =>
            need.urgency && need.urgency.toUpperCase() === selectedUrgency
        );
    }

    renderNeeds(filteredNeeds);
}

window.donateNow = function (charityName, needType, needQuantity, urgency, city, needId, description, charityId) {
    const currentUrl = new URL(window.location.href);
    const basePath = currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf("/"));
    const url = new URL(`${basePath}/donate.html`, window.location.origin);

    url.searchParams.append("charityName", charityName);
    url.searchParams.append("needType", needType);
    url.searchParams.append("needQuantity", needQuantity);
    url.searchParams.append("urgency", urgency);
    url.searchParams.append("city", city);
    url.searchParams.append("needId", needId);
    url.searchParams.append("description", description);
    url.searchParams.append("charityId", charityId);

    window.location.href = url.toString();
};