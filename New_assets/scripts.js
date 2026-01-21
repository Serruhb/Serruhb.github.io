// assets/scripts.js
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Mobile nav toggle + smooth scroll
  // =========================
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on link click (mobile) + smooth scroll for anchors
    links.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href") || "";

      // Smooth scroll for in-page anchors
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // Close after selection
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });

    // Close if clicking outside (mobile)
    document.addEventListener("click", (e) => {
      if (!links.classList.contains("is-open")) return;
      const clickedInside = links.contains(e.target) || toggle.contains(e.target);
      if (!clickedInside) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =========================
  // Offerings slider (Swiper)
  // =========================
  const swiperEl = document.getElementById("offeringsSwiper");

  // Only init if element exists AND Swiper is available
  if (swiperEl && typeof window.Swiper !== "undefined") {
    new window.Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 450,
      grabCursor: true,
      loop: true,
      pagination: {
        el: swiperEl.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: swiperEl.querySelector(".swiper-button-next"),
        prevEl: swiperEl.querySelector(".swiper-button-prev"),
      },
      breakpoints: {
        900: { slidesPerView: 3 }, // desktop shows 3 offerings like your old grid
      },
    });
  }
});

// assets/scripts.js
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Mobile nav toggle + smooth scroll
  // =========================
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("click", (e) => {
      if (!links.classList.contains("is-open")) return;
      const clickedInside = links.contains(e.target) || toggle.contains(e.target);
      if (!clickedInside) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =========================
  // Content Carousel (no library) - for service cards
  // =========================
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  carousels.forEach((root) => {
    const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dotsWrap = root.querySelector("[data-carousel-dots]");

    if (!slides.length) return;

    let index = slides.findIndex((s) => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    // Build dots
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot" + (i === index ? " is-active" : "");
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => goTo(i));
      dotsWrap && dotsWrap.appendChild(b);
      return b;
    });

    function render() {
      slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    prevBtn && prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn && nextBtn.addEventListener("click", () => goTo(index + 1));

    // Keyboard support
    root.tabIndex = 0;
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    });

    render();
  });
});

document.addEventListener("click", (e) => {
  const slide = e.target.closest("[data-carousel-slide][data-href]");
  if (!slide) return;
  window.location.href = slide.dataset.href;
});
