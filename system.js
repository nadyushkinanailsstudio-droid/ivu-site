document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('liveGraph');

  if (!layout) return;

  const tabs = Array.from(layout.querySelectorAll('.sg-tab'));
  const steps = [
    document.getElementById('sg-step-1'),
    document.getElementById('sg-step-2'),
    document.getElementById('sg-step-3')
  ];

  let isAutoPlaying = true;
  let autoPlayTimer1 = null;
  let autoPlayTimer2 = null;

  function setStep(stepNum) {
    layout.setAttribute('data-step', String(stepNum));

    tabs.forEach((tab) => {
      tab.classList.toggle('is-active', Number(tab.dataset.step) === stepNum);
    });

    steps.forEach((stepEl, idx) => {
      if (!stepEl) return;
      stepEl.classList.toggle('is-active', idx + 1 === stepNum);
    });
  }

  function stopAutoPlay() {
    isAutoPlaying = false;
    clearTimeout(autoPlayTimer1);
    clearTimeout(autoPlayTimer2);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      stopAutoPlay();
      setStep(Number(tab.dataset.step));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry || !entry.isIntersecting) return;

    observer.disconnect();

    setStep(1);

    autoPlayTimer1 = setTimeout(() => {
      if (!isAutoPlaying) return;
      setStep(2);

      autoPlayTimer2 = setTimeout(() => {
        if (!isAutoPlaying) return;
        setStep(3);
        isAutoPlaying = false;
      }, 2600);
    }, 2600);
  }, { threshold: 0.35 });

  observer.observe(layout);
});