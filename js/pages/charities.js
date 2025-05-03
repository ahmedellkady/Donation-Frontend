import { fetchCharities } from "../api/charityApi.js";
import { trackActivity } from "../components/activityTracker.js";
import { renderCharityCard } from "../components/charityRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".charity-cards");
  const form = document.querySelector(".filter-form");

  handleSkipActivity();

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = getInputValue("location");
    const category = getInputValue("category");
    await loadCharities(city, category);
  });

  loadCharities();
});

async function handleSkipActivity() {
  const lastViewed = localStorage.getItem("lastViewedCharityId");
  const interacted = localStorage.getItem("charityInteraction");

  if (lastViewed && interacted === "false") {
    await trackActivity("SKIP", parseInt(lastViewed));
    console.log("Skipped charity:", lastViewed);
  }

  localStorage.removeItem("lastViewedCharityId");
  localStorage.removeItem("charityInteraction");
}

async function loadCharities(city = "", category = "") {
  const container = document.querySelector(".charity-cards");
  container.innerHTML = "";

  try {
    const charities = await fetchCharities(city, category);

    if (!charities.length) {
      container.innerHTML = "<p>No charities match your filters.</p>";
      return;
    }

    charities.forEach((charity) => {
      const card = renderCharityCard(charity);
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load charities", err);
    container.innerHTML = "<p>Error loading charities.</p>";
  }
}

function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}