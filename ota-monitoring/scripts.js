// Scroll reveal + diagram zoom modal
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // Diagram modal
  const diagramImages = document.querySelectorAll(".diagram-figure img");
  const modal = document.getElementById("diagram-modal");
  if (!modal) return;

  const modalImg = modal.querySelector("img");
  const modalCaption = modal.querySelector(".diagram-modal-caption");
  const closeBtn = modal.querySelector(".diagram-modal-close");
  const backdrop = modal.querySelector(".diagram-modal-backdrop");

  function openModal(src, alt, caption) {
    modalImg.src = src;
    modalImg.alt = alt || "";
    modalCaption.textContent = caption || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    modalImg.alt = "";
    modalCaption.textContent = "";
  }

  diagramImages.forEach((img) => {
    img.addEventListener("click", () => {
      const figure = img.closest("figure");
      const captionEl = figure
        ? figure.querySelector("figcaption")
        : null;
      const captionText = captionEl ? captionEl.innerText : "";
      openModal(img.src, img.alt, captionText);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

// Sidebar toggle (W3CSS)
var mySidebar = document.getElementById("mySidebar");

function w3_open() {
  if (mySidebar.style.display === "block") {
    mySidebar.style.display = "none";
  } else {
    mySidebar.style.display = "block";
  }
}

function w3_close() {
  mySidebar.style.display = "none";
}
