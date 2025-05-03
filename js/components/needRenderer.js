export function renderNeedCard(need, options = {}) {
  const div = document.createElement("div");
  div.className = "need-card";

  const showMatch = options.showMatch ?? true;

  div.innerHTML = `
      <div class="need-header">
        <i class="fas ${getIconClass(need.type)}"></i>
        <div>
          <h3>${need.type.toUpperCase()}</h3>
          <p>${need.charityName}</p>
        </div>
      </div>
      <div class="location"><i class="fas fa-map-marker-alt"></i><span>${need.city}</span></div>
      <div class="urgency-quantity">
        <span class="badge ${getUrgencyBadgeClass(need.urgency)}">${need.urgency}</span>
        <span class="quantity">Quantity: ${need.quantity}</span>
        ${showMatch && need.predictedScore !== undefined ? `<span class="quantity">Match: ${need.predictedScore}</span>` : ""}
      </div>
      <button class="donate-btn">Donate</button>
    `;
  
  const donateBtn = div.querySelector(".donate-btn");
  
  if (typeof options.onDonate === "function") {
    donateBtn.addEventListener("click", () => options.onDonate?.(need));
  }
  
  return div;
}

function getUrgencyBadgeClass(urgency) {
  switch (urgency.toLowerCase()) {
    case "high": case "critical": return "critical";
    case "medium": return "medium";
    case "low": return "low";
    default: return "low";
  }
}

function getIconClass(type) {
  switch (type.toLowerCase()) {
    case "food": return "fa-utensils";
    case "clothes": return "fa-shirt";
    case "school_supplies": return "fa-book";
    case "electronics": return "fa-tv";
    case "furniture": return "fa-couch";
    case "toys": return "fa-gamepad";
    default: return "fa-gift";
  }
}
