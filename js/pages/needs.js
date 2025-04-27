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
        needsContainer.innerHTML += `
          <div class="need-card">
            <div class="need-header">
              <i class="fas fa-hand-holding-heart"></i>
              <div>
                <h3>${need.type}</h3>
                <p>${need.charityName}</p>
              </div>
            </div>
            <div class="location">
              <i class="fas fa-map-marker-alt"></i>
              <span>${need.charityName} Location</span>
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

  loadNeeds(); // Initial load
});
