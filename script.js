// Naturally Logical — newDesign shared behavior
// Runs on every page: nav scroll state always applies; the service-card
// accordion and contact form blocks simply no-op on pages that don't have
// those elements (case studies / about pages only use the nav behavior).

const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  });
}

const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-card]').forEach((card) => {
  const toggle = card.querySelector('[data-toggle]');
  const body = card.querySelector('[data-body]');
  toggle.addEventListener('click', () => {
    const isOpen = card.classList.contains('is-open');
    if (isOpen) { body.style.maxHeight = '0px'; card.classList.remove('is-open'); }
    else { body.style.maxHeight = body.scrollHeight + 'px'; card.classList.add('is-open'); }
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.service-card.is-open [data-body]').forEach((body) => {
    body.style.maxHeight = body.scrollHeight + 'px';
  });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formStatus = document.getElementById('formStatus');

  contactForm.querySelectorAll('.project-type-card input[type=radio]').forEach((input) => {
    input.addEventListener('change', () => {
      contactForm.querySelectorAll('.project-type-card').forEach((card) => card.classList.remove('is-selected'));
      input.closest('.project-type-card').classList.add('is-selected');
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const name = contactForm.name.value.trim();
    const company = contactForm.company.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const projectType = contactForm.projectType.value;

    const subject = `Contact: ${projectType} - ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      `Project type: ${projectType}`,
      "",
      message
    ].filter(Boolean);

    const mailto = `mailto:hello@naturallylogical.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;

    formStatus.textContent = "Opening your email client to send this to hello@naturallylogical.com.";
  });
}
