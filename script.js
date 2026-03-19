const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  const dropdownToggles = Array.from(
    mainNav.querySelectorAll("[data-nav-dropdown-toggle]")
  );

  const closeAllNavDropdowns = () => {
    dropdownToggles.forEach((toggle) => {
      const wrapper = toggle.closest(".nav-dropdown");
      if (!wrapper) return;
      wrapper.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  };

  // Top-level menu linklerine tıklanınca (mobile) dropdownlari de kapat.
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      closeAllNavDropdowns();
    });
  });

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();

      const wrapper = toggle.closest(".nav-dropdown");
      if (!wrapper) return;

      // Tek bir dropdown açik kalsin.
      dropdownToggles.forEach((t) => {
        const w = t.closest(".nav-dropdown");
        if (!w) return;
        if (t === toggle) return;
        w.classList.remove("is-open");
        t.setAttribute("aria-expanded", "false");
      });

      const willOpen = !wrapper.classList.contains("is-open");
      wrapper.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });
  });

  // Dropdown disinda tiklaninca kapat.
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      closeAllNavDropdowns();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllNavDropdowns();
  });
}

// Mock linklerde "#" kaynakli sayfa yukari ziplamasini engelle.
document
  .querySelectorAll("a[data-mock-link='true']")
  .forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
    })
  );

// Contact map: sayac (counter) animasyonu
const contactMap = document.querySelector(".contact-map");
const contactCounters = document.querySelectorAll(".contact-counter");

if (contactMap && contactCounters.length) {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCounter = (el, end, durationMs) => {
    const startValue = 0;
    const endValue = Number(end) || 0;
    const duration = Math.max(250, durationMs);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const startTime = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(t);
      const value = Math.round(startValue + (endValue - startValue) * eased);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const startCounters = () => {
    contactCounters.forEach((counter) => {
      const end = counter.getAttribute("data-end") || "0";
      if (reduceMotion) {
        counter.textContent = String(Number(end) || 0);
      } else {
        const endNum = Number(end) || 0;
        const durationMs = 1200 + Math.min(900, endNum / 10);
        animateCounter(counter, endNum, durationMs);
      }
    });
  };

  if (reduceMotion) {
    startCounters();
  } else {
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        if (started) return;
        started = true;
        observer.disconnect();
        startCounters();
      },
      { threshold: 0.25 }
    );

    observer.observe(contactMap);
  }
}

// Hero: ilk 2 saniye siyah ekran + yazı görünür; sonra video başlar ve yazı kaybolur.
const hero = document.getElementById("hero");
const heroVideo = hero ? hero.querySelector(".hero-video") : null;

if (hero && heroVideo) {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // İlk ekranda videonun başlamaması için durdur.
  try {
    heroVideo.pause();
  } catch (_) {}

  // Yazı animasyonu zaten 1s gecikmeli; video açılışını da aynı zamana bağlayalım.
  const startHero = () => {
    hero.classList.add("hero--started");
    try {
      const playPromise = heroVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch (_) {}
  };

  if (reduceMotion) startHero();
  else window.setTimeout(startHero, 2000);
}

// Take a closer look: soldan item seçilince sağdaki görsel/içerik değişir.
const closerTabs = document.querySelectorAll(".closer-tab");
const closerPanels = document.querySelectorAll(".closer-panel");
const closerCover = document.getElementById("closer-cover");
const productDetails = document.querySelectorAll(".product-detail");
const productsReset = document.getElementById("productsReset");
const productsAccordion = document.querySelector(".products-accordion");
const productsAccordionGrid = document.querySelector(
  ".products-accordion-grid"
);

function setCloserNone() {
  closerTabs.forEach((tab) => {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("aria-expanded", "false");
  });

  closerPanels.forEach((panel) => {
    panel.classList.remove("is-active");
  });

  productDetails.forEach((detail) => {
    detail.classList.remove("is-open");
    detail.setAttribute("aria-hidden", "true");
  });

  if (closerCover) {
    closerCover.classList.remove("is-hidden");
  }

  // Sağ/sol tüm ürün alanının arka planını varsayılan kapak görseline set et.
  if (productsAccordionGrid) {
    productsAccordionGrid.style.setProperty(
      "--accordion-bg",
      'url("https://www.dioimplant.com/assets/images/product/HotProduct_Unicon_bg.png")'
    );
  }

  // Varsayılan ekranda (hiç seçim yokken) çarpı ikonunu gizle.
  if (productsReset) {
    productsReset.classList.add("is-hidden");
    productsReset.setAttribute("aria-hidden", "true");
    productsReset.setAttribute("tabindex", "-1");
  }

  // Varsayılan durumda accordion aktif değildir.
  if (productsAccordion) {
    productsAccordion.classList.remove("-active");
  }
}

function setCloserActive(target) {
  if (closerCover) {
    closerCover.classList.add("is-hidden");
  }

  closerTabs.forEach((tab) => {
    const isActive = tab.dataset.target === String(target);
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("aria-expanded", String(isActive));
  });

  closerPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === String(target);
    panel.classList.toggle("is-active", isActive);
  });

  productDetails.forEach((detail) => {
    const isOpen = detail.dataset.target === String(target);
    detail.classList.toggle("is-open", isOpen);
    detail.setAttribute("aria-hidden", String(!isOpen));
  });

  // Not: Seçim yapılınca arka planın değişmemesi isteniyor.
  // Default görsel `setCloserNone()` tarafından ayarlanır.

  // Seçim varken çarpı ikonunu göster.
  if (productsReset) {
    productsReset.classList.remove("is-hidden");
    productsReset.setAttribute("aria-hidden", "false");
    productsReset.removeAttribute("tabindex");
  }

  // Herhangi bir item seçiliyken accordion aktif olur.
  if (productsAccordion) {
    productsAccordion.classList.add("-active");
  }
}

if (closerTabs.length && closerPanels.length) {
  closerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setCloserActive(tab.dataset.target);
    });
  });

  // Varsayılan: hiçbir item seçili değil, kapak görseli göster.
  setCloserNone();
}

if (productsReset) {
  productsReset.addEventListener("click", () => {
    setCloserNone();
  });
}
