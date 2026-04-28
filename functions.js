const revealBlocks = document.querySelectorAll('.reveal');
const kpis = document.querySelectorAll('[data-kpi]');
const tilts = document.querySelectorAll('[data-tilt]');
const funCta = document.getElementById('funCta');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealBlocks.forEach((item) => revealObserver.observe(item));

const kpiObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const el = entry.target;
    const target = Number(el.dataset.kpi) || 0;
    const start = performance.now();
    const duration = 1200;

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(target * eased)}%`;
      if (p < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    kpiObserver.unobserve(el);
  });
}, { threshold: 0.45 });

kpis.forEach((kpi) => kpiObserver.observe(kpi));

tilts.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -8;
    const ry = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(850px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg)';
  });
});

function sparkBurst(x, y, count = 16) {
  const colors = ['#5d8dff', '#89aaf8', '#ffffff'];

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'spark';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.background = colors[i % colors.length];
    dot.style.setProperty('--x', `${(Math.random() - 0.5) * 180}px`);
    dot.style.setProperty('--y', `${(Math.random() - 0.5) * 140}px`);
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 620);
  }
}

if (funCta) {
  funCta.addEventListener('mouseenter', () => {
    const rect = funCta.getBoundingClientRect();
    sparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
  });
}

document.addEventListener('click', (event) => {
  if (window.innerWidth <= 680) {
    return;
  }
  sparkBurst(event.clientX, event.clientY, 10);
});

// --- Floating particles canvas ---
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const COUNT = 55;
  const dots = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < COUNT; i += 1) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.15),
      alpha: Math.random() * 0.45 + 0.15,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(43,108,255,${d.alpha})`;
      ctx.fill();

      d.x += d.vx;
      d.y += d.vy;

      if (d.y < -10) {
        d.y = canvas.height + 10;
        d.x = Math.random() * canvas.width;
      }
      if (d.x < -10) { d.x = canvas.width + 10; }
      if (d.x > canvas.width + 10) { d.x = -10; }
    });

    requestAnimationFrame(draw);
  }

  draw();
}());

// --- Parallax on hero media ---
(function initParallax() {
  const heroMedia = document.querySelector('.hero-media');
  if (!heroMedia) {
    return;
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroMedia.style.transform = `translateY(${scrollY * 0.12}px)`;
  }, { passive: true });
}());

// --- Shimmer on section h2 headings ---
(function initShimmer() {
  const headings = document.querySelectorAll('.text-col h2, .cta h2, .feature-strip h3');
  const shimmerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shimmer-title');
        shimmerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  headings.forEach((h) => shimmerObserver.observe(h));
}());

// --- Scroll progress bar ---
(function initScrollBar() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) { return; }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrollTop / docHeight) * 100}%`;
  }, { passive: true });
}());

// --- Custom cursor ---
(function initCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');
  if (!ring || !dot || window.matchMedia('(pointer: coarse)').matches) { return; }

  let rx = window.innerWidth / 2;
  let ry = window.innerHeight / 2;
  let mx = rx;
  let my = ry;

  document.addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  });

  document.querySelectorAll('a, button, .btn, [data-tilt]').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(lerpRing);
  }());
}());

// --- Typewriter hero title ---
(function initTypewriter() {
  const el = document.getElementById('hero-title');
  if (!el) { return; }

  const text = el.textContent.trim();
  el.textContent = '';
  el.style.minHeight = '1em';

  let i = 0;
  const speed = 36;

  const type = () => {
    if (i < text.length) {
      el.textContent += text[i];
      i += 1;
      setTimeout(type, speed);
    }
  };

  setTimeout(type, 400);
}());

// --- Word-by-word reveal on h2 inside panels ---
(function initWordReveal() {
  const targets = document.querySelectorAll('.text-col h2');

  const wrapWords = (el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) =>
      `<span class="word-wrap"><span class="word-inner">${w}</span></span>`
    ).join(' ');
  };

  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) { return; }
      const wraps = entry.target.querySelectorAll('.word-wrap');
      wraps.forEach((wrap, idx) => {
        setTimeout(() => wrap.classList.add('in'), idx * 80);
      });
      wordObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  targets.forEach((t) => {
    wrapWords(t);
    wordObserver.observe(t);
  });
}());

// --- Ripple on buttons ---
(function initRipple() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 560);
    });
  });
}());
