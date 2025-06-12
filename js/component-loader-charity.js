function loadComponent(selector, file, callback) {
  const element = document.querySelector(selector);
  if (!element) return;
  fetch(file)
    .then(res => res.text())
    .then(data => {
      element.innerHTML = data;
      setTimeout(() => { if (callback) callback(); }, 50);
    });
}

function setupCharityNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const logoutLink = document.getElementById("logout-link");

  // Toggle dropdown menu
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("nav")) {
      navLinks.classList.remove("active");
    }
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  logoutLink?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "auth.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#navbar", "components/navbar-charity.html", setupCharityNavbar);
  loadComponent("#footer", "components/footer.html");
});
