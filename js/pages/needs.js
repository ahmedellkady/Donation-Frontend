import { fetchNeeds } from "../api/needApi.js";
import { renderNeedCard } from "../components/needRenderer.js";
import { redirectToDonate } from "../utils/navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".needs-container");
  const form = document.querySelector(".filter-form");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = getInputValue("location");
    const category = getInputValue("category");
    const urgency = getInputValue("urgency");
    await loadNeeds(city, category, urgency);
  });

  loadNeeds();
});

async function loadNeeds(city = "", category = "", urgency = "") {
  const container = document.querySelector(".needs-container");
  container.innerHTML = "";

  try {
    const needs = await fetchNeeds(city, category, urgency);

    if (!needs.length) {
      container.innerHTML = "<p>No needs found.</p>";
      return;
    }

    needs.forEach((need) => {
      const card = renderNeedCard(need, { showMatch: false, onDonate: redirectToDonate });
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading needs:", error);
    container.innerHTML = "<p>Failed to load needs. Please try again later.</p>";
  }
}

function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}