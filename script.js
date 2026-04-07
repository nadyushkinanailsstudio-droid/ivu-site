document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');

  /* ===============================
     ГЛОБАЛЬНЫЙ СКРОЛЛ-ДИСПЕТЧЕР
     Управляет шапкой и раздает событие 'app-scroll'
  =============================== */
  const header = document.getElementById('header');
  let ticking = false;

  const emitScrollState = () => {
    const currentScrollY = window.scrollY;

    if (header) {
      if (currentScrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.dispatchEvent(new CustomEvent('app-scroll', {
      detail: { scrollY: currentScrollY }
    }));
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        emitScrollState();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  emitScrollState();

  /* ===============================
     АККОРДЕОН
     Работает и для .acc-item, и для FAQ
  =============================== */
  const detailsElements = document.querySelectorAll('.acc-item, .faq-container details');

  if (detailsElements.length > 0) {
    detailsElements.forEach((targetDetail) => {
      targetDetail.addEventListener('toggle', () => {
        if (targetDetail.open) {
          detailsElements.forEach((detail) => {
            if (detail !== targetDetail) {
              detail.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  /* ===============================
     REVEAL АНИМАЦИИ
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

    /* ===============================
     НАВИГАЦИЯ ПО РАЗДЕЛАМ
     Dropdown + ScrollSpy
  =============================== */
  const pageSectionsBlocks = document.querySelectorAll('.page-sections');

  if (pageSectionsBlocks.length > 0) {
    pageSectionsBlocks.forEach((sectionsNav) => {
      const sectionsToggle = sectionsNav.querySelector('.page-sections__toggle');
      const sectionsPanel = sectionsNav.querySelector('.page-sections__panel');
      const sectionsLinks = Array.from(sectionsNav.querySelectorAll('.page-sections__link'));

      if (!sectionsToggle || !sectionsPanel || sectionsLinks.length === 0) {
        return;
      }

      const closePanel = () => {
        sectionsPanel.hidden = true;
        sectionsToggle.setAttribute('aria-expanded', 'false');
      };

      const openPanel = () => {
        sectionsPanel.hidden = false;
        sectionsToggle.setAttribute('aria-expanded', 'true');
      };

      const setActiveLink = (targetId) => {
        sectionsLinks.forEach((link) => {
          const href = link.getAttribute('href') || '';
          const isMatch = href === `#${targetId}`;
          link.classList.toggle('is-active', isMatch);
        });
      };

      sectionsPanel.hidden = true;
      sectionsToggle.setAttribute('aria-expanded', 'false');

      sectionsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const shouldOpen = sectionsPanel.hidden;

        if (shouldOpen) {
          openPanel();
        } else {
          closePanel();
        }
      });

      document.addEventListener('click', (e) => {
        if (!sectionsNav.contains(e.target)) {
          closePanel();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closePanel();
        }
      });

      sectionsLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closePanel();
        });
      });

      const sectionTargets = sectionsLinks
        .map((link) => {
          const href = link.getAttribute('href') || '';
          if (!href.startsWith('#')) return null;

          const id = href.slice(1);
          const element = document.getElementById(id);

          if (!element) return null;

          return { id, element };
        })
        .filter(Boolean);

      if (sectionTargets.length > 0) {
        const updateActiveSection = () => {
          const headerOffset = header ? header.offsetHeight + 24 : 120;
          const scrollPoint = window.scrollY + headerOffset + 20;

          let currentId = sectionTargets[0].id;

          sectionTargets.forEach(({ id, element }) => {
            if (element.offsetTop <= scrollPoint) {
              currentId = id;
            }
          });

          setActiveLink(currentId);
        };

        updateActiveSection();
        window.addEventListener('app-scroll', updateActiveSection);
        window.addEventListener('resize', updateActiveSection);
      }
    });
  }

  /* ===============================
   КНОПКА ПРОКРУТКИ МЕНЮ
=============================== */
const nav = document.querySelector('.nav');
const btnLeft = document.querySelector('.nav-scroll-btn--left');
const btnRight = document.querySelector('.nav-scroll-btn--right');

if (nav && btnLeft && btnRight) {

  const updateButtons = () => {
    const maxScroll = nav.scrollWidth - nav.clientWidth - 4;

    const atStart = nav.scrollLeft <= 10;
    const atEnd = nav.scrollLeft >= maxScroll - 10;

    btnLeft.style.opacity = atStart ? '0' : '1';
    btnLeft.style.pointerEvents = atStart ? 'none' : 'auto';

    btnRight.style.opacity = atEnd ? '0' : '1';
    btnRight.style.pointerEvents = atEnd ? 'none' : 'auto';
  };

  btnRight.addEventListener('click', () => {
    nav.scrollBy({ left: 180, behavior: 'smooth' });
  });

  btnLeft.addEventListener('click', () => {
    nav.scrollBy({ left: -180, behavior: 'smooth' });
  });

  nav.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);

  updateButtons();
}
});