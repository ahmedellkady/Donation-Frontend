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
      if (callback) callback();
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}


function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    // Toggle nav visibility when hamburger clicked
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close menu when any link is clicked (on mobile)
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("#navbar", "components/navbar.html", setupHamburgerMenu);
  loadComponent("#footer", "components/footer.html");
});
