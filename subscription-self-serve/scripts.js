// Sidebar toggle (W3-style)
var mySidebar = document.getElementById("mySidebar");

function w3_open(){
  if (!mySidebar) return;
  mySidebar.style.display = (mySidebar.style.display === 'block') ? 'none' : 'block';
}

function w3_close(){
  if (!mySidebar) return;
  mySidebar.style.display = "none";
}

// Smooth scroll for in-page anchors
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const id = a.getAttribute("href").slice(1);
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) return;

  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });

  // Close mobile sidebar after navigation
  w3_close();
});

// Accordion behavior
function initAccordions(){
  const buttons = document.querySelectorAll(".accordion[data-acc]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("data-acc");
      const panel = document.getElementById(panelId);
      if (!panel) return;

      const isOpen = panel.style.display === "block";
      panel.style.display = isOpen ? "none" : "block";
      const icon = btn.querySelector(".fa-chevron-down");
      if (icon) icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
    });
  });
}

// Copy summary button (nice for sharing the project quickly)
async function copySummary(){
  const summary =
`Subscription Self-Serve Automation & Data Validation

Problem:
Manual CPQ amendments were inconsistent and error-prone; critical events (ALDs, upgrades, provider changes) weren’t reliably captured → revenue misalignment and poor scalability.

Solution:
Built an event-driven automation framework using Snowflake + Workato to validate, construct, and apply contract amendments in Salesforce CPQ. Supports complex pricing, multi-contract contexts, upgrade/downgrade paths, and dynamic product/edition mappings. Everything is logged and reconcilable.

AI alignment lens:
Deterministic validation gates + audit logs + fail-closed behavior create safe “guardrails” for any AI-assisted ops workflows.`;

  const status = document.getElementById("copyStatus");

  try{
    await navigator.clipboard.writeText(summary);
    if (status) status.textContent = "Copied summary to clipboard.";
  } catch (err){
    if (status) status.textContent = "Couldn’t copy automatically — select text and copy manually.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAccordions();

  const copyBtn = document.getElementById("copySummaryBtn");
  if (copyBtn) copyBtn.addEventListener("click", copySummary);

  // Ensure the “Back to top” works even without an element called top
  const topAnchor = document.getElementById("top");
  if (!topAnchor) {
    // no-op; smooth scroll handler will still work if href="#top" doesn't exist
  }
});
