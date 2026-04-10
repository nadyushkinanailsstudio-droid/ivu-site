document.addEventListener("DOMContentLoaded", () => {
  const page = document.body;

  if (!page.classList.contains("foundation-page")) return;

  /* ==========================================================================
     FOUNDATION — BOOKS CAROUSEL
     ========================================================================== */

  const track = document.querySelector(".books-track");
  const slides = Array.from(document.querySelectorAll(".book-slide"));
  const btnPrev = document.querySelector(".books-nav--prev");
  const btnNext = document.querySelector(".books-nav--next");

  if (track && slides.length && btnPrev && btnNext) {
    let index = 0;

    function getGap() {
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      return Number.isFinite(gap) ? gap : 0;
    }

    function getVisibleSlides() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getSlideStep() {
      if (!slides[0]) return 0;
      return slides[0].offsetWidth + getGap();
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getVisibleSlides());
    }

    function clampIndex() {
      index = Math.max(0, Math.min(index, getMaxIndex()));
    }

    function updateCarousel() {
      clampIndex();
      const step = getSlideStep();
      track.style.transform = `translateX(-${index * step}px)`;

      btnPrev.disabled = index === 0;
      btnNext.disabled = index >= getMaxIndex();

      btnPrev.setAttribute("aria-disabled", String(index === 0));
      btnNext.setAttribute("aria-disabled", String(index >= getMaxIndex()));
    }

    btnNext.addEventListener("click", () => {
      index += 1;
      updateCarousel();
    });

    btnPrev.addEventListener("click", () => {
      index -= 1;
      updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);

    updateCarousel();
  }

  /* ==========================================================================
     FOUNDATION — LIGHTBOX
     ========================================================================== */

  const lightbox = document.getElementById("foundationLightbox");
  const lightboxImage = document.getElementById("foundationLightboxImage");
  const lightboxTitle = document.getElementById("foundationLightboxTitle");
  const openers = document.querySelectorAll(".js-open-media");
  const closers = document.querySelectorAll("[data-close-lightbox]");

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImage || !lightboxTitle) return;

    lightboxImage.src = src;
    lightboxImage.alt = title || "Просмотр документа";
    lightboxTitle.textContent = title || "Просмотр документа";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.style.overflow = "";
  }

  openers.forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-zoom-src");
      const title = item.getAttribute("data-zoom-title");

      if (!src) return;
      openLightbox(src, title);
    });
  });

  closers.forEach((item) => {
    item.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});