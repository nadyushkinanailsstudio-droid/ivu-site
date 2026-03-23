document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dou-application');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Заявка успешно отправлена. Представитель Института свяжется с вами.');
  });
});