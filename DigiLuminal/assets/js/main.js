document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const year = document.querySelectorAll('[data-year]');
  year.forEach((item) => { item.textContent = new Date().getFullYear(); });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => nav?.classList.toggle('open'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

  const cursor = document.createElement('div');
  cursor.className = 'cursor-orb';
  document.body.appendChild(cursor);
  if (!reduced) {
    window.addEventListener('mousemove', (event) => {
      cursor.style.transform = `translate3d(${event.clientX - 55}px, ${event.clientY - 55}px, 0)`;
    });
  }

  const hoverables = document.querySelectorAll('.service-card, .detail-card, .project, .case, .stat, .glass-panel');
  hoverables.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rx', `${(-dy * 5).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(dx * 5).toFixed(2)}deg`);
      card.style.transform = `translateY(-6px) rotateX(var(--rx)) rotateY(var(--ry)) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.portfolio-track');
    const prev = slider.querySelector('[data-prev]');
    const next = slider.querySelector('[data-next]');
    const amount = () => Math.max(320, (track?.clientWidth || 320) * 0.82);
    prev?.addEventListener('click', () => track?.scrollBy({ left: -amount(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track?.scrollBy({ left: amount(), behavior: 'smooth' }));
  });

  document.querySelectorAll('video').forEach((video) => {
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.autoplay = true;
  });

  const hero = document.querySelector('.hero');
  if (hero && !reduced) {
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = Array.from({ length: 26 }, (_, i) => ({
      x: Math.random(), y: Math.random(), r: 30 + Math.random() * 90,
      s: 0.002 + Math.random() * 0.004, a: 0.05 + Math.random() * 0.1, h: i % 3
    }));
    const resize = () => {
      canvas.width = Math.floor(hero.clientWidth * dpr);
      canvas.height = Math.floor(hero.clientHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const draw = (t) => {
      ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
      particles.forEach((p, i) => {
        p.y += p.s;
        if (p.y > 1.2) p.y = -0.2;
        const x = p.x * hero.clientWidth + Math.sin((t * 0.0002) + i) * 22;
        const y = p.y * hero.clientHeight + Math.cos((t * 0.0002) + i) * 16;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, p.r);
        const colors = ['rgba(103,247,255,', 'rgba(155,121,255,', 'rgba(255,111,207,'];
        grad.addColorStop(0, `${colors[p.h]}${p.a})`);
        grad.addColorStop(1, `${colors[p.h]}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
});