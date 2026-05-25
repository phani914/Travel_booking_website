const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const themeToggle = document.querySelector(".theme-toggle");
const navSearch = document.querySelector(".nav-search");
const bookingForm = document.querySelector(".booking-form");

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
    if (window.innerWidth > 1380) {
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

if (bookingForm) {
  const fields = {
    fullName: bookingForm.elements["full-name"],
    email: bookingForm.elements.email,
    phone: bookingForm.elements.phone,
    contactMethod: bookingForm.elements["contact-method"],
    destination: bookingForm.elements.destination,
    departureDate: bookingForm.elements["departure-date"],
    returnDate: bookingForm.elements["return-date"],
    adults: bookingForm.elements.adults,
    children: bookingForm.elements.children,
    tripType: bookingForm.elements["trip-type"],
    budget: bookingForm.elements.budget,
    hotel: bookingForm.elements.hotel,
    consent: bookingForm.elements.consent
  };

  const message = bookingForm.querySelector(".booking-message");
  const submitButton = bookingForm.querySelector('button[type="submit"]');

  const getFieldError = (field) => {
    const label = field.closest("label");
    let error = label?.querySelector(".field-error");

    if (!error && label) {
      error = document.createElement("p");
      error.className = "field-error";
      label.append(error);
    }

    return error;
  };

  const setFieldError = (field, text) => {
    if (!field) {
      return;
    }

    const error = getFieldError(field);
    const errorId = `${field.name}-error`;

    field.classList.toggle("is-invalid", Boolean(text));
    field.setAttribute("aria-invalid", String(Boolean(text)));

    if (text && error) {
      error.id = errorId;
      error.textContent = text;
      field.setAttribute("aria-describedby", errorId);
      return;
    }

    if (error) {
      error.textContent = "";
    }

    field.removeAttribute("aria-describedby");
  };

  const setGroupError = (group, text) => {
    let error = group?.querySelector(".field-error");

    if (!error && group) {
      error = document.createElement("p");
      error.className = "field-error";
      group.append(error);
    }

    if (error) {
      error.textContent = text;
    }
  };

  const clearValidation = () => {
    Object.values(fields).forEach((field) => setFieldError(field, ""));
    setGroupError(bookingForm.querySelector(".choice-group"), "");

    if (message) {
      message.textContent = "";
      message.classList.remove("is-error");
    }

    if (submitButton) {
      submitButton.textContent = "Submit Booking Request";
    }
  };

  const parseDateValue = (value) => {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const validateBookingForm = () => {
    clearValidation();

    const errors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departure = parseDateValue(fields.departureDate.value);
    const returnDate = parseDateValue(fields.returnDate.value);
    const adults = Number(fields.adults.value);
    const children = Number(fields.children.value || 0);
    const selectedInclusions = bookingForm.querySelectorAll('input[name="inclusions"]:checked');

    const addError = (field, text) => {
      errors.push(field);
      setFieldError(field, text);
    };

    if (fields.fullName.value.trim().length < 2) {
      addError(fields.fullName, "Enter your full name.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
      addError(fields.email, "Enter a valid email address.");
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(fields.phone.value.trim())) {
      addError(fields.phone, "Enter a valid mobile number.");
    }

    [
      [fields.contactMethod, "Choose how we should contact you."],
      [fields.destination, "Choose a destination."],
      [fields.tripType, "Select a trip type."],
      [fields.budget, "Select a budget range."],
      [fields.hotel, "Select a hotel category."]
    ].forEach(([field, text]) => {
      if (!field.value) {
        addError(field, text);
      }
    });

    if (!departure) {
      addError(fields.departureDate, "Choose a departure date.");
    } else if (departure < today) {
      addError(fields.departureDate, "Departure date cannot be in the past.");
    }

    if (!returnDate) {
      addError(fields.returnDate, "Choose a return date.");
    } else if (departure && returnDate <= departure) {
      addError(fields.returnDate, "Return date must be after departure.");
    }

    if (!Number.isInteger(adults) || adults < 1 || adults > 12) {
      addError(fields.adults, "Adults must be between 1 and 12.");
    }

    if (!Number.isInteger(children) || children < 0 || children > 10) {
      addError(fields.children, "Children must be between 0 and 10.");
    }

    if (adults + children > 18) {
      addError(fields.children, "Total travelers cannot exceed 18.");
    }

    if (!selectedInclusions.length) {
      setGroupError(bookingForm.querySelector(".choice-group"), "Select at least one package inclusion.");
      errors.push(bookingForm.querySelector(".choice-group"));
    }

    if (!fields.consent.checked) {
      addError(fields.consent, "Please agree before submitting.");
    }

    return errors;
  };

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = validateBookingForm();

    if (errors.length) {
      if (message) {
        message.textContent = "Please fix the highlighted fields and submit again.";
        message.classList.add("is-error");
      }

      errors[0].scrollIntoView({ behavior: "smooth", block: "center" });
      errors[0].focus?.();
      return;
    }

    if (message) {
      message.textContent = "Booking request received. A Wanderly planner will contact you soon.";
      message.classList.remove("is-error");
    }

    if (submitButton) {
      submitButton.textContent = "Request Sent";
    }
  });

  bookingForm.addEventListener("input", (event) => {
    const target = event.target;

    if (target.matches("input, select, textarea")) {
      if (target.name === "inclusions") {
        setGroupError(bookingForm.querySelector(".choice-group"), "");

        if (message?.classList.contains("is-error")) {
          message.textContent = "";
          message.classList.remove("is-error");
        }

        return;
      }

      setFieldError(target, "");

      if (message?.classList.contains("is-error")) {
        message.textContent = "";
        message.classList.remove("is-error");
      }
    }
  });

  bookingForm.addEventListener("change", (event) => {
    const target = event.target;

    if (target.matches("select, input[type='checkbox']")) {
      target.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
}
