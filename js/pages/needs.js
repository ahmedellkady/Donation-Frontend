import { fetchNeeds } from "../api/needApi.js";
import { renderNeedCard } from "../components/needRenderer.js";
import { redirectToDonate } from "../utils/navigation.js";

let currentPage = 0;
const pageSize = 10;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".filter-form");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentPage = 0;
    await loadNeeds(currentPage);
  });

  loadNeeds(currentPage);
});

async function loadNeeds(page = 0) {
  const container = document.querySelector(".needs-container");
  const paginationContainer = document.getElementById("pagination");
  container.innerHTML = "";
  paginationContainer.innerHTML = "";

  const city = getInputValue("location");
  const category = getInputValue("category");
  const urgency = getInputValue("urgency");

  try {
    const result = await fetchNeeds(city, category, urgency, page, pageSize);

    if (!result.content?.length) {
      container.innerHTML = "<p>No needs found.</p>";
      return;
    }

    result.content.forEach((need) => {
      const card = renderNeedCard(need, { showMatch: false, onDonate: redirectToDonate });
      container.appendChild(card);
    });

    renderPagination(result.totalPages, result.number);
  } catch (error) {
    console.error("Error loading needs:", error);
    container.innerHTML = "<p>Failed to load needs. Please try again later.</p>";
  }
}

function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.className = i === currentPage ? "active-page" : "";
    btn.onclick = () => {
      console.log("Page clicked:", i);
      loadNeeds(i);
    };
    paginationContainer.appendChild(btn);
  }
}
