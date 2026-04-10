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
      header.classList.toggle('scrolled', currentScrollY > 30);
    }

    window.dispatchEvent(
      new CustomEvent('app-scroll', {
        detail: { scrollY: currentScrollY }
      })
    );
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        emitScrollState();
        ticking = false;
      });
    },
    { passive: true }
  );

  emitScrollState();

  /* ===============================
     АККОРДЕОН
     Работает и для .acc-item, и для FAQ
  =============================== */
  const detailsElements = document.querySelectorAll('.acc-item, .faq-container details');

  if (detailsElements.length > 0) {
    detailsElements.forEach((targetDetail) => {
      targetDetail.addEventListener('toggle', () => {
        if (!targetDetail.open) return;

        detailsElements.forEach((detail) => {
          if (detail !== targetDetail) {
            detail.removeAttribute('open');
          }
        });
      });
    });
  }

  /* ===============================
     REVEAL АНИМАЦИИ
  =============================== */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    reveals.forEach((el) => revealObserver.observe(el));
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

      if (!sectionsToggle || !sectionsPanel || sectionsLinks.length === 0) return;

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
          link.classList.toggle('is-active', href === `#${targetId}`);
        });
      };

      sectionsPanel.hidden = true;
      sectionsToggle.setAttribute('aria-expanded', 'false');

      sectionsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sectionsPanel.hidden) {
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
        link.addEventListener('click', closePanel);
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
   КНОПКИ ПРОКРУТКИ МЕНЮ
=============================== */
const nav = document.querySelector('.nav');
const btnLeft = document.querySelector('.nav-scroll-btn--left');
const btnRight = document.querySelector('.nav-scroll-btn--right');

if (nav && btnLeft && btnRight) {
  const getLinks = () => Array.from(nav.querySelectorAll('.nav__link'));
  const isHomePage = () => document.body.classList.contains('index-page');

  const setButtonState = (button, isVisible) => {
    button.style.opacity = isVisible ? '1' : '0';
    button.style.pointerEvents = isVisible ? 'auto' : 'none';
    button.style.visibility = isVisible ? 'visible' : 'hidden';
  };


const updateButtons = () => {
  const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth - 4);
  const atStart = nav.scrollLeft <= 10;
  const atEnd = nav.scrollLeft >= maxScroll - 10;

  setButtonState(btnLeft, !atStart);
  setButtonState(btnRight, !atEnd);
};

 const forceHomeMenuStart = () => {
    nav.scrollLeft = 0;
    updateButtons();
  };

  const scrollActiveLinkIntoView = (smooth = false) => {
    const allLinks = getLinks();
    const activeLink = nav.querySelector('.nav__link.is-active');

    if (!activeLink || allLinks.length === 0) {
      updateButtons();
      return;
    }

    const activeIndex = allLinks.indexOf(activeLink);
    const lastIndex = allLinks.length - 1;
    const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);

    let targetLeft = 0;

    if (isHomePage()) {
      targetLeft = 0;
    } else if (activeIndex <= 0) {
      targetLeft = 0;
    } else if (activeIndex >= lastIndex) {
      targetLeft = maxScroll;
    } else {
      targetLeft =
        activeLink.offsetLeft - nav.clientWidth / 2 + activeLink.offsetWidth / 2;
    }

    nav.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScroll)),
      behavior: smooth ? 'smooth' : 'auto'
    });

    updateButtons();
  };

  const syncMenuState = (smooth = false) => {
    scrollActiveLinkIntoView(smooth);
  };

  btnRight.addEventListener('click', () => {
    nav.scrollBy({
      left: 180,
      behavior: 'smooth'
    });
  });

  btnLeft.addEventListener('click', () => {
    nav.scrollBy({
      left: -180,
      behavior: 'smooth'
    });
  });

  nav.addEventListener('scroll', updateButtons, { passive: true });

  window.addEventListener('resize', () => {
    syncMenuState(false);
  });

  window.addEventListener('load', () => {
    syncMenuState(false);
  });

  window.addEventListener('pageshow', () => {
    syncMenuState(false);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      syncMenuState(false);
    });
  }

  requestAnimationFrame(() => {
    syncMenuState(false);
  });
}
});