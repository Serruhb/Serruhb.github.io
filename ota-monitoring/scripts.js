/* scripts.js
   - Scroll reveal (IntersectionObserver)
   - Diagram zoom modal (click image to open)
   - W3CSS sidebar toggle (mobile)
*/

document.addEventListener("DOMContentLoaded", () => {
  /* ========== Scroll reveal ========== */
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => obs.observe(el));
  }

  /* ========== Diagram modal (optional) ========== */
  const modal = document.getElementById("diagram-modal");
  const diagramImages = document.querySelectorAll(".diagram-figure img");

  // If you haven't included the modal markup on a page, just skip safely.
  if (modal && diagramImages.length) {
    const modalImg = modal.querySelector("img");
    const captionEl = modal.querySelector(".diagram-modal-caption");
    const closeBtn = modal.querySelector(".diagram-modal-close");
    const backdrop = modal.querySelector(".diagram-modal-backdrop");

    const openModal = (src, alt, caption) => {
      if (!modalImg) return;
      modalImg.src = src;
      modalImg.alt = alt || "";
      if (captionEl) captionEl.textContent = caption || "";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");

      // prevent background scroll
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      if (modalImg) {
        modalImg.src = "";
        modalImg.alt = "";
      }
      if (captionEl) captionEl.textContent = "";

      // restore scroll
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    diagramImages.forEach((img) => {
      img.addEventListener("click", () => {
        const figure = img.closest("figure");
        const figcap = figure ? figure.querySelector("figcaption") : null;
        const captionText = figcap ? figcap.innerText : "";
        openModal(img.src, img.alt, captionText);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ========== Sidebar (W3CSS) ========== */
  const sidebar = document.getElementById("mySidebar");

  // expose for onclick handlers in your HTML
  window.w3_open = () => {
    if (!sidebar) return;
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
  };

  window.w3_close = () => {
    if (!sidebar) return;
    sidebar.style.display = "none";
  };
});
