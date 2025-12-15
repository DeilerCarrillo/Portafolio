(() => {
  // =========================
  // 1) Referencias al carrusel
  // =========================
  const carouselEl = document.getElementById("casosFibraCarousel");
  if (!carouselEl) return;

  const intervalMs =
    Number(carouselEl.getAttribute("data-bs-interval")) || 3500;

  const toggleBtn = document.getElementById("carouselToggle");
  const bar = document.getElementById("carouselProgressBar");

  // =========================
  // 2) Inicializar carrusel Bootstrap
  // =========================
  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
    ride: true,
    interval: intervalMs,
    pause: "hover",
    touch: true,
  });

  let isPaused = false;
  let rafId = null;
  let startTs = null;

  // =========================
  // 3) Progress bar (sincronizada con interval)
  // =========================
  function resetProgress() {
    if (bar) bar.style.width = "0%";
    startTs = null;
  }

  function animateProgress(ts) {
    if (isPaused) return;
    if (!startTs) startTs = ts;

    const elapsed = ts - startTs;
    const pct = Math.min(100, (elapsed / intervalMs) * 100);
    if (bar) bar.style.width = pct + "%";

    if (pct < 100) rafId = requestAnimationFrame(animateProgress);
  }

  function startProgress() {
    cancelAnimationFrame(rafId);
    resetProgress();
    rafId = requestAnimationFrame(animateProgress);
  }

  startProgress();

  carouselEl.addEventListener("slid.bs.carousel", () => {
    if (!isPaused) startProgress();
  });

  // =========================
  // 4) Botón Pausar/Reanudar
  // =========================
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isPaused = !isPaused;

      if (isPaused) {
        carousel.pause();
        cancelAnimationFrame(rafId);
        toggleBtn.textContent = "Reanudar";
      } else {
        carousel.cycle();
        toggleBtn.textContent = "Pausar";
        startProgress();
      }
    });
  }

  // =========================
  // 5) Caption dinámica
  // =========================
  function ensureCaption() {
    let cap = carouselEl.querySelector(".custom-caption");
    if (!cap) {
      cap = document.createElement("div");
      cap.className = "carousel-caption custom-caption";
      cap.innerHTML = `<span class="caption-tag"></span>`;
      carouselEl.querySelector(".carousel-inner")?.appendChild(cap);
    }
    return cap.querySelector(".caption-tag");
  }

  const captionTag = ensureCaption();

  function updateCaption() {
    const activeImg = carouselEl.querySelector(".carousel-item.active img");
    if (captionTag && activeImg) captionTag.textContent = activeImg.alt || "";
  }

  updateCaption();
  carouselEl.addEventListener("slid.bs.carousel", updateCaption);

  // =========================
  // Modal click en imagen abre vista previa
  // =========================
  const modalEl = document.getElementById("imgModal");
  const modalImg = document.getElementById("imgModalSrc");
  const modalTitle = document.getElementById("imgModalTitle");
  const modalCaption = document.getElementById("imgModalCaption");

  if (modalEl && modalImg && modalTitle) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    carouselEl.querySelectorAll("img").forEach((img) => {
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt || "Imagen del proyecto";

        modalTitle.textContent =
          "Sistema de Gestión de Casos y Citas (Fibra Óptica)";

        if (modalCaption) {
          modalCaption.textContent = img.alt || "";
        }

        modal.show();
      });
    });
  }
})();
