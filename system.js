document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.ivu-accordion');

  accordions.forEach((acc) => {
    acc.addEventListener('toggle', () => {
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 120);
    });
  });

  const layout = document.getElementById('liveGraph');

  if (layout) {
    const tabs = Array.from(layout.querySelectorAll('.sg-tab'));
    const steps = [
      document.getElementById('sg-step-1'),
      document.getElementById('sg-step-2'),
      document.getElementById('sg-step-3')
    ];

    const cubeGroup = document.getElementById('movingCubeGroup');
    const cubeAnimator = document.getElementById('cubeAnimator');
    const cubeFallback = document.querySelector('.sg-cube-fallback');

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

      if (stepNum === 3) {
        if (cubeGroup) cubeGroup.style.opacity = '1';
        if (cubeFallback) cubeFallback.style.opacity = '1';

        if (cubeAnimator) {
          try { cubeAnimator.setCurrentTime(0); } catch (e) {}
          try { cubeAnimator.beginElement(); } catch (e) {}
        }
      } else {
        if (cubeGroup) cubeGroup.style.opacity = '0';
        if (cubeFallback) cubeFallback.style.opacity = '0';
      }
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
  }

  const monument = document.querySelector('.monument-wrapper');

  if (monument) {
    const monumentObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry || !entry.isIntersecting) return;

      const monumentSteps = monument.querySelectorAll('.monument-step');

      monumentSteps.forEach((step, index) => {
        setTimeout(() => {
          step.classList.add('is-visible');
        }, index * 200);
      });

      monumentObserver.disconnect();
    }, { threshold: 0.3 });

    monumentObserver.observe(monument);
  }
});