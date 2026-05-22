const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const themeToggle = document.querySelector(".theme-toggle");
const navSearch = document.querySelector(".nav-search");

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
};

const getSavedTheme = () => {
  try {
    return localStorage.getItem("wanderly-theme");
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem("wanderly-theme", theme);
  } catch {
    return;
  }
};

const savedTheme = getSavedTheme();
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

applyTheme(savedTheme || preferredTheme);

if (menuToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) {
      closeMenu();
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    saveTheme(nextTheme);
    applyTheme(nextTheme);
  });
}

if (navSearch) {
  navSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchInput = navSearch.querySelector("input");
    const query = searchInput.value.trim().toLowerCase();
    const searchTargets = {
      booking: "booking.html",
      book: "booking.html",
      package: "#packages-preview",
      packages: "#packages-preview",
      destination: "#destinations",
      destinations: "#destinations",
      review: "#reviews",
      reviews: "#reviews",
      support: "#why-us",
      why: "#why-us"
    };

    const target = searchTargets[query] || "#packages-preview";

    if (target.endsWith(".html")) {
      window.location.href = target;
      return;
    }

    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    searchInput.value = "";

    if (menuToggle && navLinks) {
      navLinks.classList.remove("is-open");
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}
