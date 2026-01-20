// Mobile nav toggle + smooth scroll
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on link click (mobile)
    links.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      // Smooth scroll for in-page anchors
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // Close on mobile after selection
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
  }
});
