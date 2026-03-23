document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initReveal();
  initSmartBrief();
});

function initStickyHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const toggleHeaderState = () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  };

  toggleHeaderState();
  window.addEventListener("scroll", toggleHeaderState, { passive: true });
}

function initReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function initSmartBrief() {
  const form = document.getElementById("smart-brief-form");
  const helperBlock = document.getElementById("dynamic-helper");
  const roleRadios = document.querySelectorAll('input[name="user-role"]');

  if (!form || !helperBlock || !roleRadios.length) return;

  const helperTexts = {
    parent:
      "Укажите возраст ребёнка, текущий уровень чтения и вашу готовность работать дома по маршруту «первые 100 слов».",
    educator:
      "Опишите ваши ключевые сложности в обучении чтению, опыт работы по разворотам / слогам и готовность делиться результатами в методсообществе.",
    dou:
      "Укажите номер ДОУ и уровень готовности: провести демо-урок, внедрить годовую программу или подготовить детей к Дошкольной Аттестации.",
    partner:
      "Укажите ваше издание или организацию, а также формат предполагаемого сотрудничества: интервью, статья, спонсорство, внедрение."
  };

  const updateHelperText = (role) => {
    helperBlock.style.opacity = "0";

    window.setTimeout(() => {
      helperBlock.textContent = helperTexts[role] || helperTexts.parent;
      helperBlock.style.opacity = "1";
    }, 180);
  };

  roleRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      updateHelperText(event.target.value);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    alert("Бриф успешно отправлен в Приёмную Института. Мы свяжемся с вами после обработки заявки.");

    form.reset();
    updateHelperText("parent");
  });
}