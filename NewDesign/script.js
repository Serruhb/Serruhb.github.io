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
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = "Thanks. This is a design mockup — nothing was actually sent.";
  });
}
