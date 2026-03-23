document.addEventListener('DOMContentLoaded', () => {
/* ===============================
     ГЛОБАЛЬНЫЙ СКРОЛЛ-ДИСПЕТЧЕР
     Управляет шапкой и раздает событие 'app-scroll'
  =============================== */
  const header = document.getElementById('header');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY; // Считываем позицию всего один раз

        // 1. Логика шапки (работает на всех страницах)
        if (header) {
          if (currentScrollY > 30) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }

        // 2. Отправляем сигнал остальным скриптам
        window.dispatchEvent(new CustomEvent('app-scroll', { 
          detail: { scrollY: currentScrollY } 
        }));

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ===============================
     Аккордеон (Общий для всех страниц)
     Работает и для .acc-item, и для FAQ
  =============================== */
  const detailsElements = document.querySelectorAll('.acc-item, .faq-container details');

  if (detailsElements.length > 0) {
    detailsElements.forEach((targetDetail) => {
      targetDetail.addEventListener('toggle', () => {
        if (targetDetail.open) {
          detailsElements.forEach((detail) => {
            if (detail !== targetDetail) {
              detail.removeAttribute('open'); // Закрываем остальные
            }
          });
        }
      });
    });
  }

  /* ===============================
     Reveal анимации — общий вариант
     Плавное появление блоков при скролле
  =============================== */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

});