import { fetchSuggestedNeedsForDonor } from "../api/needApi.js";
import { renderNeedCard } from "../components/suggestedNeedsRenderer.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
  const donorId = user?.id;
  if (!donorId) return;

  const container = document.querySelector(".needs-container");
  try {
    const needs = await fetchSuggestedNeedsForDonor(donorId);
    container.innerHTML = "";
    needs.forEach(need => container.appendChild(renderNeedCard(need)));
  } catch (e) {
    container.innerHTML = "<p>Failed to load suggested needs.</p>";
  }
});
