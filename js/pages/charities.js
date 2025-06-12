import { fetchCharities } from "../api/charityApi.js";
import { trackActivity } from "../components/activityTracker.js";
import { renderCharityCard } from "../components/charityRenderer.js";

let currentPage = 0;
const pageSize = 10;

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

async function loadCharities(city = "", category = "", page = 0) {
  const container = document.querySelector(".charity-cards");
  const pagination = document.getElementById("charity-pagination");
  container.innerHTML = "";
  pagination.innerHTML = "";

  try {
    const result = await fetchCharities(city, category, page, pageSize);
    const charities = result.content;

    if (!charities || charities.length === 0) {
      container.innerHTML = "<p>No charities match your filters.</p>";
      return;
    }

    charities.forEach((charity) => {
      const card = renderCharityCard(charity);
      container.appendChild(card);
    });

    renderPagination(result.totalPages, result.number, city, category);
  } catch (err) {
    console.error("Failed to load charities", err);
    container.innerHTML = "<p>Error loading charities.</p>";
  }
}

function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function renderPagination(totalPages, currentPage, city, category) {
  const pagination = document.getElementById("charity-pagination");
  pagination.innerHTML = "";

  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.className = i === currentPage ? "active-page" : "";
    btn.onclick = () => loadCharities(city, category, i);
    pagination.appendChild(btn);
  }
}