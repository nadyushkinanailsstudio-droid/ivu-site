document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('code-input');
  const btnReset = document.getElementById('btn-reset');
  const sysMsg = document.getElementById('sys-msg');
  const letterGrid = document.getElementById('letter-grid');
  const victoryArea = document.getElementById('victory-area');
  const unlockBtn = document.getElementById('btn-unlock');
  const secretLessons = document.getElementById('secret-lessons');

  const btnStartDeep = document.getElementById('btn-start-deep');
  const deepStartScreen = document.getElementById('deep-start-screen');
  const demoVideoBlock = document.getElementById('demo-video-block');
  const clubVideo = document.getElementById('club-video');

  const targetRows = ['БВГДЖ', 'ЗКЛМШ', 'НПРСЧ', 'ТФХЦЩ'];
  const cells = letterGrid ? Array.from(letterGrid.querySelectorAll('.l-cell')) : [];
  let currentRow = 0;

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

    if (secretLessons) {
      secretLessons.style.display = 'none';
    }

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

  function completeMatrix() {
    if (codeInput) {
      codeInput.value = '';
      codeInput.blur();
    }

    showMessage('Браво! Весь парад собран правильно!', 'msg-success');

    if (victoryArea) {
      victoryArea.style.display = 'block';
      victoryArea.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
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

  showMessage('Почти получилось. Проверь порядок букв в этой шеренге.', 'msg-error');
    // Даем ребенку 1.5 секунды увидеть свою ошибку перед очисткой
    setTimeout(() => {
      codeInput.value = '';
    }, 1500);
  }
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

  if (unlockBtn && secretLessons) {
    unlockBtn.addEventListener('click', () => {
      secretLessons.style.display = 'block';
      secretLessons.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
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

  resetMatrix();
});