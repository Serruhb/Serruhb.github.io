/* Google Analytics gtag init (moved from inline) */
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-HM5VZHXLCT');

/* Sidebar toggle */
var mySidebar = document.getElementById("mySidebar");

function w3_open(){
  if (!mySidebar) return;
  mySidebar.style.display = (mySidebar.style.display === 'block') ? 'none' : 'block';
}

function w3_close(){
  if (!mySidebar) return;
  mySidebar.style.display = "none";
}

/* Contact form mailto handler */
function sendMail(e) {
  e.preventDefault();

  const form = e.target;
  const name = form.Name.value.trim();
  const email = form.Email.value.trim();
  const subject = form.Subject.value.trim() || 'Website Contact';
  const message = form.Message.value.trim();

  const body = [
    message,
    ``,
    `${name}`,
    `${email}`
  ].join('\n');

  const mailtoLink =
    `mailto:sarah.brown@naturallylogical.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoLink;
  return false;
}

/* Attach listener (preferred vs inline onsubmit) */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", sendMail);
  }
});
