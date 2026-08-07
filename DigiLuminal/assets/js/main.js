document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  const cursor = document.createElement('div');
  cursor.className = 'cursor-orb';
  if (!reduced) document.body.appendChild(cursor);
  window.addEventListener('mousemove', (e) => {
    if (!reduced) cursor.style.transform = `translate3d(${e.clientX - 55}px, ${e.clientY - 55}px, 0)`;
  });

  document.querySelectorAll('.service-card, .detail-card, .case, .project, .stat, .glass-panel').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--mx', `${(dx * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(dy * 100).toFixed(1)}%`);
      if (!reduced) card.style.transform = `translateY(-6px) rotateX(${(-dy * 5).toFixed(2)}deg) rotateY(${(dx * 5).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('[data-slider]').forEach((wrap) => {
    const track = wrap.querySelector('.portfolio-grid');
    const prev = wrap.querySelector('[data-prev]');
    const next = wrap.querySelector('[data-next]');
    const step = () => track?.querySelector('.project')?.getBoundingClientRect().width || 320;
    prev?.addEventListener('click', () => track?.scrollBy({ left: -(step() + 16), behavior: reduced ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => track?.scrollBy({ left: step() + 16, behavior: reduced ? 'auto' : 'smooth' }));
  });

  document.querySelectorAll('video').forEach((video) => {
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.autoplay = true;
  });
});