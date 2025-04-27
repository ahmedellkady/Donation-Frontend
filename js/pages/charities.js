import { fetchCharities } from "../api/charityApi.js";

document.addEventListener("DOMContentLoaded", function () {
  const charityCardsContainer = document.querySelector(".charity-cards");
  const filterForm = document.querySelector(".filter-form");

  async function loadCharities(city = "", category = "") {
    try {
      const response = await fetchCharities(city, category);

      if (response.status === 204) {
        charityCardsContainer.innerHTML = "<p>No charities found.</p>";
        return;
      }

      const charities = await response.json();
      charityCardsContainer.innerHTML = "";

      charities.forEach(charity => {
        charityCardsContainer.innerHTML += `
          <div class="charity-card-media">
            <div class="charity-logo-container">
              <img src="Assets/img/charity.jpg" alt="${charity.name} Logo">
            </div>
            <div class="charity-text-block">
              <h3>${charity.name}</h3>
              <p>${charity.city}, ${charity.neighborhood}</p>
            </div>
          </div>
        `;
      });

    } catch (error) {
      console.error("Failed to load charities:", error);
      charityCardsContainer.innerHTML = "<p>Error loading charities.</p>";
    }
  }

  filterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const city = document.getElementById("location").value;
    const category = document.getElementById("category").value;
    loadCharities(city, category);
  });

  loadCharities(); // Initial load
});
