// what-i-build/scripts.js

// Scroll reveal + mobile nav helpers (keeps behavior consistent with your other pages)
document.addEventListener("DOMContentLoaded", () => {
  // ===== Scroll reveal =====
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
});

// ===== Mobile sidebar (W3CSS pattern) =====
function w3_open() {
  const mySidebar = document.getElementById("mySidebar");
  if (!mySidebar) return;
  mySidebar.style.display = (mySidebar.style.display === "block") ? "none" : "block";
}

function w3_close() {
  const mySidebar = document.getElementById("mySidebar");
  if (!mySidebar) return;
  mySidebar.style.display = "none";
}
