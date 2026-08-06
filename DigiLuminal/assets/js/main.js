document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor = document.createElement('div');
  cursor.className = 'cursor-orb';
  document.body.appendChild(cursor);

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => nav?.classList.toggle('open'));
  toggle?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      nav?.classList.toggle('open');
    }
  });

  const year = document.querySelectorAll('[data-year]');
  year.forEach((item) => { item.textContent = new Date().getFullYear(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

  const tiltable = document.querySelectorAll('.service-card, .case, .project, .stat, .panel, .glass-panel');
  tiltable.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${(-dy * 4).toFixed(2)}deg) rotateY(${(dx * 4).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  if (!reduced) {
    window.addEventListener('mousemove', (event) => {
      cursor.style.transform = `translate3d(${event.clientX - 55}px, ${event.clientY - 55}px, 0)`;
    });

    const hero = document.querySelector('.hero');
    if (hero) {
      const canvas = document.createElement('canvas');
      canvas.className = 'hero-canvas';
      hero.prepend(canvas);
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const particles = Array.from({ length: 42 }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        r: 20 + Math.random() * 90,
        s: 0.003 + Math.random() * 0.006,
        a: 0.06 + Math.random() * 0.16,
        hue: i % 3
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
          if (p.y > 1.18) p.y = -0.18;
          const x = p.x * hero.clientWidth + Math.sin((t * 0.0003) + i) * 26;
          const y = p.y * hero.clientHeight + Math.cos((t * 0.0005) + i) * 18;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.r);
          const colors = [
            'rgba(103,247,255,',
            'rgba(155,121,255,',
            'rgba(255,111,207,'
          ];
          gradient.addColorStop(0, `${colors[p.hue]}${p.a})`);
          gradient.addColorStop(1, `${colors[p.hue]}0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    }

    document.querySelectorAll('.hero-copy, .page-hero, .section-head, .cta-band, .detail-copy').forEach((node) => {
      node.addEventListener('mouseenter', () => {
        node.style.filter = 'drop-shadow(0 0 24px rgba(103,247,255,.04))';
      });
    });
  }

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      document.querySelectorAll('[data-project]').forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.project !== filter;
      });
    });
  });

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    const status = form.querySelector('.form-status');
    const ok = name && email && message && name.value.trim() && email.value.includes('@') && message.value.trim().length >= 12;

    if (!ok) {
      status.textContent = 'Please complete the form with a valid email and a real message.';
      status.style.color = '#ffb3e6';
      return;
    }

    status.textContent = 'Success. This is a polished demo state — connect your own email service when ready.';
    status.style.color = 'var(--cyan)';
    form.reset();
  });

  const media = document.querySelectorAll('video');
  media.forEach((video) => {
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.autoplay = true;
  });
});