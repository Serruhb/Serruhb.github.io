// contact/scripts.js

const EMAIL = "sarah.brown@naturallylogical.com";
const LINKEDIN = "https://www.linkedin.com/in/serruhb/";

function setStatus(msg){
  const el = document.getElementById("statusMsg");
  if (el) el.textContent = msg;
}

async function copyText(text, successMsg){
  try{
    await navigator.clipboard.writeText(text);
    setStatus(successMsg);
  } catch {
    window.prompt("Copy this:", text);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const emailBtn = document.getElementById("copyEmailBtn");
  const liBtn = document.getElementById("copyLinkedInBtn");

  if (emailBtn){
    emailBtn.addEventListener("click", () =>
      copyText(EMAIL, "Email address copied to clipboard.")
    );
  }

  if (liBtn){
    liBtn.addEventListener("click", () =>
      copyText(LINKEDIN, "LinkedIn profile link copied.")
    );
  }
});
