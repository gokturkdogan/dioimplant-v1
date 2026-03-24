/* =============================================
   DIO IMPLANT — Main Script
   ============================================= */

(function () {
  'use strict';

  // ─── Configuration ───
  const SLIDE_DURATION = 6000;
  const PARTICLE_COUNT = 25;

  // ─── DOM References ───
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  const particleContainers = document.querySelectorAll('.digital-particles');

  let currentSlide = 0;
  let slideTimer = null;
  let isTransitioning = false;

  // ─── Header scroll behavior ───
  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── Mobile menu ───
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open');
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── Hero Slider ───
  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;

    heroSlides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = index;

    heroSlides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');

    resetSlideTimer();

    setTimeout(() => {
      isTransitioning = false;
    }, 1200);
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }

  function resetSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, SLIDE_DURATION);
  }

  indicators.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.slide, 10);
      goToSlide(idx);
    });
  });

  resetSlideTimer();

  // ─── Particle System ───
  function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const tx = (Math.random() - 0.5) * 200;
    const ty = (Math.random() - 0.5) * 200;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 6;
    const isGlow = Math.random() > 0.7;

    Object.assign(particle.style, {
      position: 'absolute',
      left: x + '%',
      top: y + '%',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: isGlow
        ? 'radial-gradient(circle, rgba(157,141,241,0.8), rgba(78,76,176,0.3))'
        : 'rgba(157,141,241,0.5)',
      boxShadow: isGlow ? '0 0 ' + (size * 3) + 'px rgba(157,141,241,0.3)' : 'none',
      opacity: '0',
      pointerEvents: 'none',
      animation: `particleFloat ${duration}s ease-in-out ${delay}s infinite`,
      '--tx': tx + 'px',
      '--ty': ty + 'px',
    });

    container.appendChild(particle);
  }

  particleContainers.forEach(container => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      createParticle(container);
    }
  });

  // ─── Intersection Observer for animations ───
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    animObserver.observe(el);
  });

  // ─── Keyboard navigation for slider ───
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  });

  // ─── Touch support for slider ───
  let touchStartX = 0;
  let touchEndX = 0;
  const hero = document.getElementById('hero');

  hero.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  hero.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        nextSlide();
      } else {
        goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
      }
    }
  }, { passive: true });

  // ─── Parallax on mouse move (subtle) ───
  const heroContent = document.querySelector('.hero-content');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const activeProduct = document.querySelector('.hero-slide.active .slide-product');
    if (activeProduct) {
      activeProduct.style.transform = `translate(${x * 15}px, ${y * 15}px) scale(1)`;
    }

    if (heroContent) {
      heroContent.style.transform = `translate(${x * -5}px, ${y * -5}px)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    const products = document.querySelectorAll('.slide-product');
    products.forEach(el => {
      el.style.transform = '';
    });
    if (heroContent) {
      heroContent.style.transform = '';
    }
  });

  // ─── Product Category Tabs ───
  const pcatTabs = document.querySelectorAll('.pcat-tab');
  const pcatPanels = document.querySelectorAll('.pcat-panel');

  pcatTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      pcatTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      pcatPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });

  // ─── DIO NAVI Particles ───
  const naviContainer = document.getElementById('naviParticles');
  if (naviContainer) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('span');
      p.className = 'navi-particle';
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        background:rgba(157,141,241,${Math.random() * 0.4 + 0.1});
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation:naviFloat ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 4}s infinite;
      `;
      naviContainer.appendChild(p);
    }
  }

  // ─── DIO NAVI Coverflow Carousel ───
  const naviItems = document.querySelectorAll('.navi-carousel-item');
  const naviDots = document.querySelectorAll('.navi-dot');
  if (naviItems.length) {
    const total = naviItems.length;
    let current = 0;
    let autoTimer;

    const posMap = {
      4: function(idx, cur) {
        const diff = ((idx - cur) % total + total) % total;
        if (diff === 0) return 'center';
        if (diff === 1) return 'right';
        if (diff === total - 1) return 'left';
        if (diff === 2) return 'far-right';
        return 'far-left';
      }
    };

    function updatePositions() {
      naviItems.forEach((item, i) => {
        item.setAttribute('data-pos', posMap[total](i, current));
      });
      naviDots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      updatePositions();
    }

    function next() {
      goTo(current + 1);
    }

    function startAuto() {
      autoTimer = setInterval(next, 3500);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    naviDots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index));
        resetAuto();
      });
    });

    naviItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== current) {
          goTo(i);
          resetAuto();
        }
      });
    });

    updatePositions();
    startAuto();
  }

})();
