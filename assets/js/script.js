// ===== Contact form mailto builder =====
function sendMail(e) {
    e.preventDefault();
  
    const form = e.target;
    const name = form.Name.value.trim();
    const email = form.Email.value.trim();
    const subject = form.Subject.value.trim() || "Website Contact";
    const message = form.Message.value.trim();
  
    const body = [
      "Name: " + name,
      "Email: " + email,
      "",
      message
    ].join("\n");
  
    const mailtoLink =
      "mailto:serruhb@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  
    window.location.href = mailtoLink;
    return false;
  }
  
  // ===== Mobile nav toggle =====
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  
  navToggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("open");
  });
  
  // Close the mobile menu when clicking a link
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("open");
    });
  });
  