document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('code-input');
  const btnReset = document.getElementById('btn-reset');
  const sysMsg = document.getElementById('sys-msg');
  const letterGrid = document.getElementById('letter-grid');
  const victoryArea = document.getElementById('victory-area');

  const paradeStage = document.getElementById('parade-stage');
  const stageBreak = document.getElementById('stage-break');
  const anthemStage = document.getElementById('anthem-stage');
  const lessonsStage = document.getElementById('lessons-stage');
  const videoStage = document.getElementById('video-stage');

  const btnStartDeep = document.getElementById('btn-start-deep');
  const deepStartScreen = document.getElementById('deep-start-screen');
  const demoVideoBlock = document.getElementById('demo-video-block');
  const clubVideo = document.getElementById('club-video');

  const targetRows = ['БВГДЖ', 'ЗКЛМШ', 'НПРСЧ', 'ТФХЦЩ'];
  const cells = letterGrid ? Array.from(letterGrid.querySelectorAll('.l-cell')) : [];
  let currentRow = 0;

  const funnyErrors = [
    'Кручучу шепчет: почти получилось, попробуй ещё раз.',
    'Ой-ой, одна буква убежала не на своё место.',
    'Почти! Шеренга хочет встать красиво, но пока не выходит.',
    'Кручучу улыбается: ещё одна попытка — и парад получится.',
    'Буквы чуть-чуть перепутались. Давай соберём шеренгу снова.'
  ];

  /* --------------------------------------------------------------------------
     IMAGE FALLBACKS
     -------------------------------------------------------------------------- */

  const kruchuchuImages = [
    {
      id: 'hero-kruchu-img',
      fallback: './img/kruchuchu-fallback.svg'
    },
    {
      id: 'puzzle-kruchu-img',
      fallback: './img/kruchuchu-fallback.svg'
    }
  ];

  kruchuchuImages.forEach(({ id, fallback }) => {
    const img = document.getElementById(id);

    if (!img) return;

    img.addEventListener('error', () => {
      img.src = fallback;
    }, { once: true });
  });

  /* --------------------------------------------------------------------------
     HELPERS
     -------------------------------------------------------------------------- */

  function clearMessage() {
    if (!sysMsg) return;

    sysMsg.textContent = '';
    sysMsg.classList.remove('msg-success', 'msg-error');
  }

  function showMessage(text, type) {
    if (!sysMsg) return;

    sysMsg.textContent = text;
    sysMsg.classList.remove('msg-success', 'msg-error');

    if (type) {
      sysMsg.classList.add(type);
    }
  }

  function normalizeInput(value) {
    return value.toUpperCase().replace(/[^А-ЯЁ]/g, '');
  }

  function revealRow(rowIndex, rowLetters) {
    const start = rowIndex * 5;

    for (let i = 0; i < 5; i += 1) {
      const cell = cells[start + i];
      if (!cell) continue;

      cell.textContent = rowLetters[i];
      cell.classList.add('revealed');
    }
  }

  function showStage(stageEl) {
    if (!stageEl) return;

    stageEl.style.display = 'block';

    requestAnimationFrame(() => {
      stageEl.classList.add('show');
    });
  }

  function hideStage(stageEl) {
    if (!stageEl) return;

    stageEl.classList.remove('show');
    stageEl.style.display = 'none';
  }

  function scrollToBlock(el, block = 'start') {
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block
    });
  }

  function observeAndStart(stage) {
    if (!stage) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stage.classList.add('show');
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(stage);
  }

  function resetStages() {
    hideStage(paradeStage);
    hideStage(anthemStage);
    hideStage(lessonsStage);
    hideStage(videoStage);

    if (stageBreak) {
      stageBreak.classList.remove('show');
    }
  }

  /* --------------------------------------------------------------------------
     MAIN SEQUENCE
     -------------------------------------------------------------------------- */

  function runVictorySequence() {
    // 1. Показываем поздравление
    setTimeout(() => {
      if (victoryArea) {
        victoryArea.style.display = 'block';
        scrollToBlock(victoryArea, 'center');
      }
    }, 150);

    // 2. Прокрутка к параду
    setTimeout(() => {
      if (paradeStage) {
        paradeStage.style.display = 'block';
        scrollToBlock(paradeStage, 'start');
        observeAndStart(paradeStage);
      }
    }, 2600);

    // 3. После полного парада показываем "Торжественный момент"
    setTimeout(() => {
      if (stageBreak) {
        scrollToBlock(stageBreak, 'center');
        stageBreak.classList.add('show');
      }
    }, 11800);

    // 4. Потом идём к гимну
    setTimeout(() => {
      if (anthemStage) {
        anthemStage.style.display = 'block';
        scrollToBlock(anthemStage, 'start');
        observeAndStart(anthemStage);
      }
    }, 13800);

    // 5. После гимна — уроки
    setTimeout(() => {
      if (lessonsStage) {
        lessonsStage.style.display = 'block';
        scrollToBlock(lessonsStage, 'start');

        requestAnimationFrame(() => {
          lessonsStage.classList.add('show');
        });
      }
    }, 18800);

    // 6. Потом видео
    setTimeout(() => {
      if (videoStage) {
        videoStage.style.display = 'block';
        scrollToBlock(videoStage, 'start');

        requestAnimationFrame(() => {
          videoStage.classList.add('show');
        });
      }
    }, 21000);
  }

  /* --------------------------------------------------------------------------
     RESET
     -------------------------------------------------------------------------- */

  function resetMatrix() {
    currentRow = 0;

    cells.forEach((cell) => {
      cell.textContent = '?';
      cell.classList.remove('revealed');
    });

    if (codeInput) {
      codeInput.value = '';
      codeInput.placeholder = 'Введи 5 букв...';
      codeInput.maxLength = 5;
    }

    if (victoryArea) {
      victoryArea.style.display = 'none';
    }

    resetStages();

    if (deepStartScreen) {
      deepStartScreen.hidden = false;
      deepStartScreen.style.display = '';
    }

    if (demoVideoBlock) {
      demoVideoBlock.hidden = true;
      demoVideoBlock.style.display = '';
    }

    if (clubVideo) {
      clubVideo.pause();
      clubVideo.currentTime = 0;
    }

    clearMessage();
  }

  /* --------------------------------------------------------------------------
     COMPLETE
     -------------------------------------------------------------------------- */

  function completeMatrix() {
    if (codeInput) {
      codeInput.value = '';
      codeInput.blur();
    }

    showMessage('Браво! Весь парад собран правильно!', 'msg-success');

    if (victoryArea) {
      victoryArea.style.display = 'block';
    }

    runVictorySequence();
  }

  function checkCurrentRow() {
    if (!codeInput) return;
    if (currentRow >= targetRows.length) return;

    const value = normalizeInput(codeInput.value);

    if (value.length < 5) return;

    const target = targetRows[currentRow];

    if (value === target) {
      revealRow(currentRow, target);
      currentRow += 1;

      if (currentRow === 1) {
        showMessage('Ура! Первая шеренга встала правильно!', 'msg-success');
      } else if (currentRow === 2) {
        showMessage('Отлично! Вторая шеренга уже на месте!', 'msg-success');
      } else if (currentRow === 3) {
        showMessage('Здорово! Третья шеренга собрана!', 'msg-success');
      } else if (currentRow === 4) {
        completeMatrix();
        return;
      }

      codeInput.value = '';
      return;
    }

    const funnyText = funnyErrors[Math.floor(Math.random() * funnyErrors.length)];
    showMessage(funnyText, 'msg-error');

    setTimeout(() => {
      if (codeInput) {
        codeInput.value = '';
      }
    }, 1200);
  }

  /* --------------------------------------------------------------------------
     EVENTS
     -------------------------------------------------------------------------- */

  if (codeInput) {
    codeInput.addEventListener('input', () => {
      codeInput.value = normalizeInput(codeInput.value).slice(0, 5);

      if (codeInput.value.length === 5) {
        checkCurrentRow();
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetMatrix);
  }

  if (btnStartDeep && deepStartScreen && demoVideoBlock) {
    btnStartDeep.addEventListener('click', () => {
      deepStartScreen.hidden = true;
      deepStartScreen.style.display = 'none';

      demoVideoBlock.hidden = false;
      demoVideoBlock.style.display = 'block';

      if (clubVideo) {
        clubVideo.play().catch(() => {});
      }

      demoVideoBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  /* --------------------------------------------------------------------------
     INIT
     -------------------------------------------------------------------------- */

  resetMatrix();
});