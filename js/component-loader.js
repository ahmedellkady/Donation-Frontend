function loadComponent(selector, file, callback) {
    fetch(file)
      .then(res => res.text())
      .then(data => {
        document.querySelector(selector).innerHTML = data;
        if (callback) callback(); // Important to call setupHamburgerMenu after loading navbar
      });
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
  