document.addEventListener('DOMContentLoaded', () => {
  const page = document.body;

  if (!page.classList.contains('krutigrad-page')) return;

  const heroShell = document.querySelector('.kg-hero-shell');

  if (heroShell && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    heroShell.addEventListener('mousemove', (e) => {
      const rect = heroShell.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      heroShell.style.setProperty('--kg-mouse-x', `${x}`);
      heroShell.style.setProperty('--kg-mouse-y', `${y}`);
    });
  }
});