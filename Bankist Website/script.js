"use strict";

// ==========================================
// DOM ELEMENTS
// ==========================================
const elements = {
  // Modal elements
  modal: document.querySelector(".modal"),
  overlay: document.querySelector(".overlay"),
  btnCloseModal: document.querySelector(".btn--close-modal"),
  btnsOpenModal: document.querySelectorAll(".btn--show-modal"),

  // Navigation elements
  btnScrollTo: document.querySelector(".btn--scroll-to"),
  navLinks: document.querySelector(".nav__links"),
  nav: document.querySelector(".nav"),
  header: document.querySelector(".header"),
  section1: document.querySelector("#section--1"),

  // Tabbed component elements
  tabs: document.querySelectorAll(".operations__tab"),
  tabsContainer: document.querySelector(".operations__tab-container"),
  tabsContent: document.querySelectorAll(".operations__content"),

  // Section elements
  allSections: document.querySelectorAll(".section"),

  // Slider elements
  slides: document.querySelectorAll(".slide"),
  btnLeft: document.querySelector(".slider__btn--left"),
  btnRight: document.querySelector(".slider__btn--right"),
  slider: document.querySelector(".slider"),
  dotContainer: document.querySelector(".dots"),
};

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================
const modal = {
  open(e) {
    e.preventDefault();
    elements.modal.classList.remove("hidden");
    elements.overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  },

  close() {
    elements.modal.classList.add("hidden");
    elements.overlay.classList.add("hidden");
    document.body.style.overflow = "auto"; // Restore scrolling
  },

  closeWithKey(e) {
    if (e.key === "Escape" && !elements.modal.classList.contains("hidden")) {
      modal.close();
    }
  },

  init() {
    elements.btnsOpenModal.forEach((btn) =>
      btn.addEventListener("click", modal.open)
    );
    elements.btnCloseModal.addEventListener("click", modal.close);
    elements.overlay.addEventListener("click", modal.close);
    document.addEventListener("keydown", modal.closeWithKey);
  },
};

// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================
const navigation = {
  smoothScroll(e) {
    e.preventDefault();

    if (e.target.classList.contains("nav__link")) {
      const id = e.target.getAttribute("href");
      if (id && id.startsWith("#")) {
        document.querySelector(id).scrollIntoView({ behavior: "smooth" });
      }
    }
  },

  handleHover(e, opacity) {
    if (e.target.classList.contains("nav__link")) {
      const link = e.target;
      const siblings = link.closest(".nav").querySelectorAll(".nav__link");
      siblings.forEach((el) => {
        if (el !== link) el.style.opacity = opacity;
      });
    }
  },

  init() {
    elements.navLinks.addEventListener("click", navigation.smoothScroll);
    elements.btnScrollTo.addEventListener("click", () => {
      elements.section1.scrollIntoView({ behavior: "smooth" });
    });

    // Hover effects for desktop
    elements.nav.addEventListener("mouseover", (e) => {
      navigation.handleHover(e, 0.5);
    });

    elements.nav.addEventListener("mouseout", (e) => {
      navigation.handleHover(e, 1);
    });
  },
};

// ==========================================
// TABBED COMPONENT
// ==========================================
const tabbedComponent = {
  handleTabClick(e) {
    const clicked = e.target.closest(".operations__tab");
    if (!clicked) return;

    // Remove active classes
    elements.tabs.forEach((t) => t.classList.remove("operations__tab--active"));
    elements.tabsContent.forEach((c) =>
      c.classList.remove("operations__content--active")
    );

    // Add active class to clicked tab
    clicked.classList.add("operations__tab--active");
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add("operations__content--active");
  },

  init() {
    elements.tabsContainer.addEventListener(
      "click",
      tabbedComponent.handleTabClick
    );
  },
};

// ==========================================
// STICKY NAVIGATION
// ==========================================
const stickyNav = {
  init() {
    const navHeight = elements.nav.getBoundingClientRect().height;

    const stickyNavCallback = (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) {
        elements.nav.classList.add("sticky");
      } else {
        elements.nav.classList.remove("sticky");
      }
    };

    const headerObserver = new IntersectionObserver(stickyNavCallback, {
      root: null,
      threshold: 0,
      rootMargin: `-${navHeight}px`,
    });

    headerObserver.observe(elements.header);
  },
};

// ==========================================
// SECTION REVEAL ANIMATION
// ==========================================
const sectionReveal = {
  init() {
    const revealSection = (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("section--hidden");
        observer.unobserve(entry.target);
      });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
      root: null,
      threshold: 0.15,
    });

    elements.allSections.forEach((section) => {
      sectionObserver.observe(section);
      section.classList.add("section--hidden");
    });
  },
};

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
const lazyLoading = {
  init() {
    const imgTargets = document.querySelectorAll("img[data-src]");

    const loadImg = (entries, observer) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      entry.target.src = entry.target.dataset.src;
      entry.target.addEventListener("load", () => {
        entry.target.classList.remove("lazy-img");
      });
      observer.unobserve(entry.target);
    };

    const imgObserver = new IntersectionObserver(loadImg, {
      root: null,
      threshold: 0,
      rootMargin: "200px",
    });

    imgTargets.forEach((img) => imgObserver.observe(img));
  },
};

// ==========================================
// SLIDER COMPONENT
// ==========================================
const slider = {
  currentSlide: 0,
  maxSlide: elements.slides.length,

  goToSlide(slide) {
    elements.slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  },

  nextSlide() {
    if (slider.currentSlide === slider.maxSlide - 1) {
      slider.currentSlide = 0;
    } else {
      slider.currentSlide++;
    }
    slider.goToSlide(slider.currentSlide);
    slider.activeDot(slider.currentSlide);
  },

  prevSlide() {
    if (slider.currentSlide === 0) {
      slider.currentSlide = slider.maxSlide - 1;
    } else {
      slider.currentSlide--;
    }
    slider.goToSlide(slider.currentSlide);
    slider.activeDot(slider.currentSlide);
  },

  activeDot(slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  },

  createDots() {
    elements.slides.forEach((_, i) => {
      elements.dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}" aria-label="Go to slide ${
          i + 1
        }"></button>`
      );
    });
  },

  handleDotClick(e) {
    if (e.target.classList.contains("dots__dot")) {
      slider.currentSlide = Number(e.target.dataset.slide);
      slider.goToSlide(slider.currentSlide);
      slider.activeDot(slider.currentSlide);
    }
  },

  handleKeyboard(e) {
    if (e.key === "ArrowLeft") slider.prevSlide();
    if (e.key === "ArrowRight") slider.nextSlide();
  },

  init() {
    slider.goToSlide(0);
    slider.createDots();
    slider.activeDot(0);

    elements.btnRight.addEventListener("click", slider.nextSlide);
    elements.btnLeft.addEventListener("click", slider.prevSlide);
    elements.dotContainer.addEventListener("click", slider.handleDotClick);
    document.addEventListener("keydown", slider.handleKeyboard);

    // Auto-slide functionality (optional)
    // setInterval(slider.nextSlide, 5000);
  },
};

// ==========================================
// FORM HANDLING
// ==========================================
const formHandler = {
  handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;

    // Basic validation
    if (!firstName || !lastName || !email) {
      alert("Please fill in all fields");
      return;
    }

    // Simulate form submission
    alert(
      `Thank you ${firstName} ${lastName}! We'll contact you at ${email} soon.`
    );

    // Close modal
    modal.close();

    // Reset form
    e.target.reset();
  },

  init() {
    const form = document.querySelector(".modal__form");
    if (form) {
      form.addEventListener("submit", formHandler.handleSubmit);
    }
  },
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const utils = {
  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

// ==========================================
// INITIALIZATION
// ==========================================
const init = () => {
  // Initialize all modules
  modal.init();
  navigation.init();
  tabbedComponent.init();
  stickyNav.init();
  sectionReveal.init();
  lazyLoading.init();
  slider.init();
  formHandler.init();

  // Add loading class to body for CSS animations
  document.body.classList.add("loaded");
};

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
