// booking/scripts.js

const BOOKING_URL = "https://calendar.app.google/2r5d7oSBQ422ipMG9";

function setStatus(msg){
  const el = document.getElementById("statusMsg");
  if (el) el.textContent = msg;
}

async function copyBookingLink(){
  try{
    await navigator.clipboard.writeText(BOOKING_URL);
    setStatus("Copied booking link to clipboard.");
  } catch {
    // Fallback: prompt
    window.prompt("Copy this booking link:", BOOKING_URL);
    setStatus("Copy link prompt opened.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copyLinkBtn");
  if (copyBtn) copyBtn.addEventListener("click", copyBookingLink);

  // Nice-to-have: if iframe fails to load due to embed restrictions, we can hint it.
  const iframe = document.getElementById("bookingIframe");
  if (iframe) {
    iframe.addEventListener("load", () => {
      // If embed works, great—no message needed.
      // If it doesn't, Google typically shows an error page; user still has the button.
    });
  }
});
