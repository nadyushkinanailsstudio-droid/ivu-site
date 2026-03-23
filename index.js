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

    // Запускаем, когда блок появляется на экране
    if (mission.getBoundingClientRect().top > window.innerHeight - COUNTER_START_OFFSET) return;

    countersStarted = true;

    counters.forEach((counter) => {
      const target = Number(counter.textContent.trim() || 0);
      const start = performance.now();

      const tick = (time) => {
        const progress = Math.min((time - start) / COUNTER_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = String(Math.round(target * eased));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      counter.textContent = '0';
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