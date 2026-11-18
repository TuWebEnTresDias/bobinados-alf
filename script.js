(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir navegación');
    mainNav.classList.remove('is-open');
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
      mainNav.classList.toggle('is-open', open);
    });
    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));

    const processTrack = document.querySelector('.process-track');
    if (processTrack) {
      const processObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          processTrack.classList.add('is-visible');
          processObserver.disconnect();
        }
      }, { threshold: 0.28 });
      processObserver.observe(processTrack);
    }
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    document.querySelector('.process-track')?.classList.add('is-visible');
  }

  const hero = document.getElementById('hero');
  const heroMedia = document.querySelector('.hero-media');
  let framePending = false;

  const updateScrollScene = () => {
    if (!hero || !heroMedia) return;
    const range = Math.max(1, hero.offsetHeight * 0.9);
    const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / range));
    const currentPath = hero.querySelector('.current-path');
    if (currentPath) currentPath.style.strokeDashoffset = String(680 * (1 - progress));

    if (!prefersReducedMotion) {
      const y = Math.round(progress * 18);
      const scale = 1.045 + progress * 0.018;
      heroMedia.style.transform = 'translate3d(0,' + y + 'px,0) scale(' + scale.toFixed(3) + ')';
    }
    framePending = false;
  };

  const onScroll = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateScrollScene);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateScrollScene();
})();

