import { fetchNeeds } from "../api/needApi.js";

document.addEventListener("DOMContentLoaded", function () {
  const needsContainer = document.querySelector(".needs-container");
  const filterForm = document.querySelector(".filter-form");

  async function loadNeeds(city = "", category = "", urgency = "") {
    try {
      const response = await fetchNeeds(city, category, urgency);

      if (response.status === 204) {
        needsContainer.innerHTML = "<p>No needs found.</p>";
        return;
      }

      const needs = await response.json();
      needsContainer.innerHTML = "";

      needs.forEach(need => {
        let iconClass = "fas fa-hand-holding-heart";
        if (need.type === "FOOD") iconClass = "fas fa-utensils";
        else if (need.type === "CLOTHES") iconClass = "fas fa-tshirt";
        else if (need.type === "FURNITURE") iconClass = "fas fa-couch";
        else if (need.type === "SCHOOL_SUPPLIES") iconClass = "fas fa-pencil-alt";
        else if (need.type === "ELECTRONICS") iconClass = "fas fa-plug";
        else if (need.type === "TOYS") iconClass = "fas fa-puzzle-piece";

        needsContainer.innerHTML += `
          <div class="need-card">
            <div class="need-header">
              <i class="${iconClass}"></i>
              <div>
                <h3>${need.type}</h3>
                <p>${need.charityName}</p>
              </div>
            </div>
            <div class="location">
              <i class="fas fa-map-marker-alt"></i>
              <span>${need.city}</span>
            </div>
            <div class="urgency-quantity">
              <span class="badge ${need.urgency.toLowerCase()}">${need.urgency}</span>
              <span class="quantity">Quantity: ${need.quantity}</span>
            </div>
            <button class="donate-btn">Donate</button>
          </div>
        `;
      });

    } catch (error) {
      console.error("Failed to load needs:", error);
      needsContainer.innerHTML = "<p>Error loading needs.</p>";
    }
  }

  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const city = document.getElementById("location").value;
    const category = document.getElementById("category").value;
    const urgency = document.getElementById("urgency").value;
    loadNeeds(city, category, urgency);
  });

  loadNeeds();
});
