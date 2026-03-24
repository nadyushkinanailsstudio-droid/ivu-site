document.addEventListener('DOMContentLoaded', () => {
  /* ===============================
     Аккордеоны system (доп. логика для скролла)
  =============================== */
  const accordions = document.querySelectorAll('.ivu-accordion');

  accordions.forEach((acc) => {
    acc.addEventListener('toggle', () => {
      // Даем браузеру время открыть вкладку, затем обновляем скролл
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 120);
    });
  });

  /* ===============================
     Интерактивный график Никитин/Векслер/ИВУ
  =============================== */
  const layout = document.getElementById('liveGraph');

  if (layout) {
    const tabs = Array.from(document.querySelectorAll('.sg-tab'));
    const steps = [
      document.getElementById('sg-step-1'),
      document.getElementById('sg-step-2'),
      document.getElementById('sg-step-3')
    ];

    let isAutoPlaying = true;
    let autoPlayTimer;

    function setStep(stepNum) {
      layout.setAttribute('data-step', stepNum);

      // Переключаем активные кнопки (табы)
      tabs.forEach((tab) => {
        tab.classList.toggle('is-active', Number(tab.dataset.step) === stepNum);
      });

      // Переключаем текст
      steps.forEach((stepEl, idx) => {
        if (stepEl) {
          stepEl.classList.toggle('is-active', idx + 1 === stepNum);
        }
      });

      // Управление кубиком на 3-м шаге
      const anim = document.getElementById('cubeAnimator');
      const cubeGroup = document.getElementById('movingCubeGroup');

      if (stepNum === 3) {
        if (cubeGroup) cubeGroup.style.opacity = '1';
        if (anim) {
          try { anim.setCurrentTime(0); } catch (e) {}
          anim.beginElement();
        }
      } else {
        if (cubeGroup) cubeGroup.style.opacity = '0';
      }
    }

    // Ручное переключение по клику
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        isAutoPlaying = false; // Останавливаем автоплей, если юзер кликнул сам
        clearTimeout(autoPlayTimer);
        setStep(Number(tab.dataset.step));
      });
    });

    // Автоплей при доскролливании до графика (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect(); // Срабатывает только 1 раз
        setStep(1);

        autoPlayTimer = setTimeout(() => {
          if (!isAutoPlaying) return;
          setStep(2);

          autoPlayTimer = setTimeout(() => {
            if (!isAutoPlaying) return;
            setStep(3);
            isAutoPlaying = false; // Автоплей закончился
          }, 3500);
        }, 4000);
      }
    }, { threshold: 0.4 });

    observer.observe(layout);
  }

  /* ===============================
     Монумент 100 книг (Появление блоков)
  =============================== */
  const monument = document.querySelector('.monument-wrapper');

  if (monument) {
    const monumentObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const steps = monument.querySelectorAll('.monument-step');
        // Показываем ступени монумента с задержкой
        steps.forEach((step, index) => {
          setTimeout(() => {
            step.classList.add('is-visible');
          }, index * 200); // Каждая следующая ступень появляется через 0.2с
        });
        monumentObserver.disconnect();
      }
    }, { threshold: 0.3 });

    monumentObserver.observe(monument);
  }
});