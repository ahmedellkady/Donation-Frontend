function loadComponent(selector, file, callback) {
  const element = document.querySelector(selector);

  if (!element) {
    console.error(`Element ${selector} not found`);
    return;
  }

  fetch(file)
    .then(res => res.text())
    .then(data => {
      element.innerHTML = data;
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        if (callback) callback();
      }, 50);
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

function setupHamburgerMenu() {
  console.log("setupHamburgerMenu: Initializing");

  const hamburger = document.getElementById("hamburger");
  const navMenus = document.querySelectorAll(".nav-links-toggle");

  console.log("Hamburger element:", hamburger);
  console.log("Nav menus found:", navMenus.length);

  if (!hamburger || navMenus.length === 0) {
    console.warn("setupHamburgerMenu: Missing hamburger or nav menus");
    return;
  }

  const newHamburger = hamburger.cloneNode(true);
  hamburger.parentNode.replaceChild(newHamburger, hamburger);
  console.log("Hamburger replaced with clone");

  newHamburger.addEventListener("click", (e) => {
    console.log("Hamburger clicked");
    e.stopPropagation();
    navMenus.forEach(menu => {
      menu.classList.toggle("active");
      console.log("Toggled 'active' on menu:", menu.id);
    });
  });

  document.addEventListener("click", (e) => {
    const clickedOutside = !e.target.closest(".navbar");
    if (clickedOutside) {
      console.log("Clicked outside, closing menus");
      navMenus.forEach(menu => menu.classList.remove("active"));
    }
  });

  navMenus.forEach(menu => {
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        console.log("Nav link clicked, closing menus");
        navMenus.forEach(menu => menu.classList.remove("active"));
      });
    });
  });
}

function setupHamburgerMenuAndUserActions() {
  setupHamburgerMenu();

  const user = JSON.parse(localStorage.getItem("user"));
  const userType = localStorage.getItem("userType");
  const navActions = document.getElementById("nav-user-actions");
  const dashboardLink = document.getElementById("dashboard-link");
  const logoutLink = document.getElementById("logout-link");
  const loginIcon = document.getElementById("login-icon");
  const defaultNavLinks = document.getElementById("nav-links-default");
  const charityNavLinks = document.getElementById("nav-links-charity");

  if (user && userType) {
    // User is logged in
    if (navActions) navActions.style.display = "flex";
    if (loginIcon) loginIcon.style.display = "none";

    // Show appropriate navigation based on user type
    if (userType === "charity") {
      if (defaultNavLinks) defaultNavLinks.style.display = "none";
      if (charityNavLinks) charityNavLinks.style.display = "flex";
    } else {
      if (defaultNavLinks) defaultNavLinks.style.display = "flex";
      if (charityNavLinks) charityNavLinks.style.display = "none";
    }

    if (dashboardLink) {
      if (userType === "donor") {
        dashboardLink.href = "donor-dashboard.html";
      } else if (userType === "charity") {
        dashboardLink.href = "charity-dashboard.html";
      } else {
        dashboardLink.href = "#";
      }
    }

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "auth.html";
      });
    }
  } else {
    // User is not logged in
    if (navActions) navActions.style.display = "flex";
    if (loginIcon) loginIcon.style.display = "block";
    if (dashboardLink) dashboardLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "none";
    
    // Show default navigation
    if (defaultNavLinks) defaultNavLinks.style.display = "flex";
    if (charityNavLinks) charityNavLinks.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("#navbar", "components/navbar.html", setupHamburgerMenuAndUserActions);
  loadComponent("#footer", "components/footer.html");
});