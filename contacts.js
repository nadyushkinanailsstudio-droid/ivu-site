document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const successBlock = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  // ВАША ФИРМЕННАЯ ЗАДЕРЖКА ("рукодельная" математика отправки)
  function startSubmitSequence() {
    if (!submitBtn) return;
    submitBtn.classList.add('sending');
    
    // Плавный скролл к форме, чтобы видеть процесс
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Имитация методической обработки (2.1 секунды)
    setTimeout(() => {
      submitBtn.classList.remove('sending');
      completeForm();
    }, 2100);
  }

  // ЗАВЕРШЕНИЕ (ПРЕМИАЛЬНАЯ ПЛАВНАЯ АНИМАЦИЯ СМЕНЫ БЛОКОВ)
  function completeForm() {
    if (!contactForm || !successBlock) return;
    
    // 1. Скрываем форму с плавным растворением (добавить CSS transition для полной магии)
    contactForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      contactForm.style.display = 'none'; // Убираем из потока
      
      // 2. Показываем блок успеха, убирая класс-заглушку
      successBlock.classList.remove('contact-success--hidden');
      
      // Плавное появление (transition прописан в contacts.css для класса contact-success)
      requestAnimationFrame(() => {
        successBlock.style.opacity = '1';
        successBlock.style.transform = 'translateY(0)';
      });

      // Скролл к блоку успеха
      successBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      contactForm.reset(); // Сброс формы
    }, 400); // Тайминг равен CSS transition
  }

  // ОБРАБОТКА ОТПРАВКИ (Ваша логика, не тронута)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      startSubmitSequence();
    });
  }
});