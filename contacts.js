document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const successBlock = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (!contactForm || !successBlock || !submitBtn) return;

  let isSubmitting = false;

  function startSubmitSequence() {
    if (isSubmitting) return;
    isSubmitting = true;

    submitBtn.classList.add('sending');
    submitBtn.disabled = true;

    contactForm.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    setTimeout(() => {
      submitBtn.classList.remove('sending');
      completeForm();
    }, 2100);
  }

  function completeForm() {
    contactForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      contactForm.style.display = 'none';

      successBlock.classList.remove('contact-success--hidden');

      requestAnimationFrame(() => {
        successBlock.classList.add('is-visible');
      });

      successBlock.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      contactForm.reset();
      isSubmitting = false;
    }, 400);
  }

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    startSubmitSequence();
  });
});