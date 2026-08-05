document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => nav.classList.toggle('open'));

  const observer = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) { target.classList.add('visible'); observer.unobserve(target); }
  }), { threshold: .14 });
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-project]').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.project !== filter;
    });
  }));

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    status.textContent = 'Thanks — your message is ready. Connect this form to your email service to receive inquiries.';
    form.reset();
  });
  document.querySelectorAll('[data-year]').forEach((item) => item.textContent = new Date().getFullYear());
});
