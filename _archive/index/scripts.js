/* Google Analytics gtag init (no inline config snippet) */
window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-HM5VZHXLCT');

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Drawer (mobile menu)
  // =========================
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawerOverlay");
  const menuButton = document.getElementById("menuButton");
  const closeTargets = document.querySelectorAll("[data-drawer-close]");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (menuButton) menuButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  // Diagram viewer (diagram-viewer.html?src=...&title=...&subtitle=...)
const viewerImg = document.getElementById("diagramViewerImg");
if (viewerImg) {
  const params = new URLSearchParams(window.location.search);
  const src = params.get("src");
  const title = params.get("title");
  const subtitle = params.get("subtitle");

  if (src) viewerImg.src = src;

  const t = document.getElementById("diagramViewerTitle");
  if (t && title) t.textContent = title;

  const s = document.getElementById("diagramViewerSubtitle");
  if (s && subtitle) s.textContent = subtitle;

  const raw = document.getElementById("diagramViewerRaw");
  if (raw && src) raw.href = src;
}
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const isOpen = drawer && drawer.classList.contains("is-open");
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (overlay) overlay.addEventListener("click", closeDrawer);
  closeTargets.forEach((el) => el.addEventListener("click", closeDrawer));

  // =========================
  // Diagram modal (click-to-zoom)
  // =========================
  const modal = document.getElementById("diagramModal");
  const modalImg = document.getElementById("diagramModalImg");
  const modalCaption = document.getElementById("diagramModalCaption");
  const closeBtn = document.getElementById("diagramModalClose");
  const backdrop = document.getElementById("diagramModalBackdrop");

  function openDiagramModal(src, alt, cap) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || "";
    if (modalCaption) modalCaption.textContent = cap || "";
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDiagramModal() {
    if (!modal || !modalImg) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    modalImg.alt = "";
    if (modalCaption) modalCaption.textContent = "";
    document.body.style.overflow = "";
  }

  // Use <a class="diagram-link" href="..."><img ...></a>
  document.querySelectorAll("a.diagram-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const img = link.querySelector("img");
      const figure = link.closest("figure");
      const cap = figure?.querySelector("figcaption")?.innerText || "";
      openDiagramModal(link.getAttribute("href"), img?.alt || "", cap);
    });
  });

  closeBtn?.addEventListener("click", closeDiagramModal);
  backdrop?.addEventListener("click", closeDiagramModal);

  // =========================
  // Smooth scroll for in-page anchors
  // =========================
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute("href").slice(1);
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    closeDrawer();
  });

  // =========================
  // Escape key behavior
  // (close modal first, then drawer)
  // =========================
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    // if modal open, close it
    if (modal && modal.style.display === "flex") {
      closeDiagramModal();
      return;
    }

    // else close drawer if open
    if (drawer && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  // =========================
  // Contact form mailto handler (index.html#contact)
  // =========================
  function sendMail(e) {
    e.preventDefault();

    const form = e.target;
    const name = form.Name?.value?.trim() || "";
    const email = form.Email?.value?.trim() || "";
    const subject = form.Subject?.value?.trim() || "Website Contact";
    const message = form.Message?.value?.trim() || "";

    const body = [message, "", name, email].join("\n");
    const mailto =
      `mailto:sarah.brown@naturallylogical.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  const form = document.getElementById("contactForm");
  if (form) form.addEventListener("submit", sendMail);
});

(function () {
  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || "";
  }

  function safeText(str) {
    return String(str || "").trim();
  }

  // Basic allowlist: relative paths only (prevents weird injections)
  function safeSrc(src) {
    const s = decodeURIComponent(src || "").trim();
    if (!s) return "";
    if (s.startsWith("http://") || s.startsWith("https://")) return ""; // keep it local
    if (s.startsWith("javascript:")) return "";
    return s;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const src = safeSrc(getParam("src"));
    const title = decodeURIComponent(getParam("title") || "");
    const subtitle = decodeURIComponent(getParam("subtitle") || "");
    const caption = decodeURIComponent(getParam("caption") || "");
    const back = decodeURIComponent(getParam("back") || "");

    const img = document.getElementById("dvImg");
    const titleEl = document.getElementById("dvTitle");
    const subtitleEl = document.getElementById("dvSubtitle");
    const captionEl = document.getElementById("dvCaption");
    const backLink = document.getElementById("backLink");
    const openRawLink = document.getElementById("openRawLink");

    // Back behavior
    if (backLink) {
      if (safeText(back)) {
        backLink.href = back;
      } else {
        // fallback: try history, else go home
        backLink.href = "index.html";
        backLink.addEventListener("click", (e) => {
          if (window.history.length > 1) {
            e.preventDefault();
            window.history.back();
          }
        });
      }
    }

    // Populate text
    if (titleEl) titleEl.textContent = safeText(title) || "Diagram";
    if (subtitleEl) subtitleEl.textContent = safeText(subtitle);
    if (captionEl) captionEl.textContent = safeText(caption);

    // Hide empty rows cleanly
    if (subtitleEl && !safeText(subtitle)) subtitleEl.style.display = "none";
    if (captionEl && !safeText(caption)) captionEl.style.display = "none";

    // Load image
    if (!img || !src) {
      if (titleEl) titleEl.textContent = "Diagram not found";
      if (subtitleEl) {
        subtitleEl.style.display = "block";
        subtitleEl.textContent = "Missing or invalid src parameter.";
      }
      if (openRawLink) openRawLink.style.display = "none";
      return;
    }

    img.src = src;
    img.alt = safeText(title) || "Diagram";

    // “OPEN” link points to the raw file
    if (openRawLink) openRawLink.href = src;

    // Optional: click image to open raw in a new tab
    img.addEventListener("click", () => {
      window.open(src, "_blank", "noopener");
    });
  });
})();