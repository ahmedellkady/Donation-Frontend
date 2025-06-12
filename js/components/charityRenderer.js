export function renderCharityCard(charity, onClick = null) {
    const card = document.createElement("div");
    card.className = "charity-card-media";

    card.innerHTML = `
      <div class="charity-logo-container">
        <img src="Assets/img/charity.jpg" alt="${charity.name} Logo">
      </div>
      <div class="charity-text-block">
        <h3>${charity.name}</h3>
        <!--<p>${charity.description}</p>-->
        <p style="color: #347444;">
          <i class="fas fa-map-marker-alt"></i> <strong>${charity.city}</strong>
        </p>
        <p><strong syle="color: #347444;">Preferred Types:</strong> ${charity.preferredTypes.join(", ")}</p>
      </div>
    `;

    card.onclick = onClick ?? (() => {
        window.location.href = `charity.html?id=${charity.id}`;
    });

    return card;
}