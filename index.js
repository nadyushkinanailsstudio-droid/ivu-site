document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const slides = Array.from(document.querySelectorAll('.hero__author-img'));
  const buttons = Array.from(document.querySelectorAll('.control-btn'));
  const counters = Array.from(document.querySelectorAll('.mission__number'));
  const mission = document.querySelector('.mission');

  let currentSlide = 0;
  let slideTimer = null;
  let countersStarted = false;

  const SLIDE_INTERVAL = 4500;
  const COUNTER_DURATION = 1200;
  const COUNTER_START_OFFSET = 100;

  

  /* ===============================
     Слайдер фотографий автора
  =============================== */
  const goToSlide = (index) => {
    if (!slides.length || !buttons.length) return;
    if (index < 0 || index >= slides.length) return;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === index);
    });

    currentSlide = index;
  };

  const startSlider = () => {
    if (slides.length <= 1 || slides.length !== buttons.length) return;

    clearInterval(slideTimer);
    slideTimer = window.setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, SLIDE_INTERVAL);
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      goToSlide(index);
      startSlider();
    });
  });

  /* ===============================
     Анимация бегущих цифр
  =============================== */
 const animateCounters = () => {
  if (!mission || countersStarted || !counters.length) return;

  if (mission.getBoundingClientRect().top > window.innerHeight - COUNTER_START_OFFSET) return;

  countersStarted = true;

  counters.forEach((counter) => {
    const isFormula = counter.classList.contains('mission__number--formula');
    const target = isFormula
      ? Number(counter.dataset.base || 0)
      : Number(counter.textContent.trim() || 0);

    if (!Number.isFinite(target) || target <= 0) return;

    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / COUNTER_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      if (isFormula) {
        counter.textContent = `${value} × 3`;
      } else {
        counter.textContent = String(value);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    if (isFormula) {
      counter.textContent = '0 × 3';
    } else {
      counter.textContent = '0';
    }

    requestAnimationFrame(tick);
  });
};

  /* ===============================
     ПОДКЛЮЧАЕМСЯ К ГЛОБАЛЬНОМУ СКРОЛЛУ
  =============================== */
  window.addEventListener('app-scroll', (e) => {
    // Получаем позицию из нашего события
    const y = e.detail.scrollY; 
    
    // Двигаем фон (вместо функции onScrollDecor)
    body.style.backgroundPosition = `center ${y * 0.12}px, center ${y * 0.12}px, center top`;
    
    // Проверяем, нужно ли запустить цифры
    animateCounters();
  });

  // Инициализация при загрузке (чтобы всё стояло на местах сразу)
  const initialY = window.scrollY;
  body.style.backgroundPosition = `center ${initialY * 0.12}px, center ${initialY * 0.12}px, center top`;
  animateCounters();
  goToSlide(0);
  startSlider();
});
  /* ===============================
     ПЛАВАЮЩЕЕ МЕНЮ ПО БЛОКАМ
  =============================== */
  const anchorLinks = Array.from(document.querySelectorAll('.page-anchor-link'));
  const anchorSections = anchorLinks
    .map((link) => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#')) return null;
      const section = document.querySelector(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  const updateActiveAnchor = () => {
    if (!anchorSections.length) return;

    const offset = 160;
    let current = anchorSections[0];

    anchorSections.forEach((item) => {
      const top = item.section.getBoundingClientRect().top;
      if (top - offset <= 0) current = item;
    });

    anchorSections.forEach((item) => {
      item.link.classList.toggle('active', item === current);
    });
  };

  window.addEventListener('scroll', updateActiveAnchor, { passive: true });
  window.addEventListener('resize', updateActiveAnchor);
  updateActiveAnchor();