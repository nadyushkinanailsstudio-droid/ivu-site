document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. СЛАЙДЕР ИСТОРИЧЕСКИХ ФОТО АВТОРА (Hero)
     ========================================================================== */
  const slides = document.querySelectorAll('.hero__author-img');
  const buttons = document.querySelectorAll('.control-btn');
  let currentSlide = 0;
  let slideTimer = null;
  const SLIDE_INTERVAL = 4500;

  const goToSlide = (index) => {
    if (!slides.length || !buttons.length) return;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    buttons.forEach((btn, i) => {
      btn.classList.toggle('is-active', i === index);
    });

    currentSlide = index;
  };

  const startSlider = () => {
    if (slides.length <= 1) return;

    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, SLIDE_INTERVAL);
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      goToSlide(index);
      startSlider();
    });
  });

  if (slides.length && buttons.length) {
    goToSlide(0);
    startSlider();
  }

  /* ==========================================================================
     2. АНИМАЦИЯ 3D-КУБИКА
     Запуск только если пользователь находится в блоке 2 секунды
     ========================================================================== */
  const cubeSection = document.querySelector('#cubes');
  const cubeRoot = document.querySelector('.cubeRoot');
  let cubeTimer = null;
  let cubeStarted = false;

  if (cubeSection && cubeRoot) {
    const cubeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (cubeStarted) return;

        if (entry.isIntersecting) {
          clearTimeout(cubeTimer);
          cubeTimer = setTimeout(() => {
            cubeRoot.classList.add('is-visible');
            cubeStarted = true;
          }, 2000);
        } else {
          clearTimeout(cubeTimer);
        }
      });
    }, { threshold: 0.45 });

    cubeObserver.observe(cubeSection);
  }

  /* ==========================================================================
     3. КАРТОЧКИ AUDIENCES — появление по скроллу + раскрытие по hover/tap
     ========================================================================== */
  const roleCards = document.querySelectorAll('.role-stack .role-card');

  if (roleCards.length > 0) {
    const roleCardsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 120);
        }
      });
    }, {
      threshold: 0.28,
      rootMargin: '0px 0px -8% 0px'
    });

    roleCards.forEach((card) => {
      roleCardsObserver.observe(card);

      card.addEventListener('click', (e) => {
        const clickedLink = e.target.closest('a');
        if (clickedLink) return;

        roleCards.forEach((item) => {
          if (item !== card) {
            item.classList.remove('is-open');
          }
        });

        card.classList.toggle('is-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.role-card')) {
        roleCards.forEach((card) => {
          card.classList.remove('is-open');
        });
      }
    });
  }

  /* ==========================================================================
     4. АНИМАЦИЯ БЕГУЩИХ ЦИФР (DASHBOARD)
     ========================================================================== */
  const numbers = document.querySelectorAll('.mission__number');

  if (numbers.length > 0) {
    const animateValue = (el) => {
      const originalText = el.innerText;
      const isMultiplied = originalText.includes('×');
      const targetStr = originalText.replace(/\D/g, '');

      let targetNumber = parseInt(targetStr, 10);
      let suffix = '';

      if (isMultiplied) {
        const parts = originalText.split('×');
        targetNumber = parseInt(parts[0].replace(/\D/g, ''), 10);
        suffix = ' × ' + parts[1].trim();
      }

      if (isNaN(targetNumber) || targetNumber === 0) return;

      const duration = 1500;
      const start = performance.now();

      const step = (currentTime) => {
        const progress = Math.min((currentTime - start) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(easeProgress * targetNumber);

        el.innerText = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.innerText = originalText;
        }
      };

      requestAnimationFrame(step);
    };

    const numbersObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => animateValue(entry.target), index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach((el) => numbersObserver.observe(el));
  }
});