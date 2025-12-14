(() => {
  const carouselEl = document.getElementById("casosFibraCarousel");
  if (!carouselEl) return;

  const intervalMs =
    Number(carouselEl.getAttribute("data-bs-interval")) || 3500;

  const toggleBtn = document.getElementById("carouselToggle");
  const bar = document.getElementById("carouselProgressBar");

  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
    ride: true,
    interval: intervalMs,
    pause: "hover",
    touch: true,
  });

  let isPaused = false;
  let rafId = null;
  let startTs = null;

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

  // Modal al hacer click en imagen
  const modalEl = document.getElementById("imgModal");
  const modalImg = document.getElementById("imgModalSrc");
  const modalTitle = document.getElementById("imgModalTitle");

  if (modalEl && modalImg && modalTitle) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    carouselEl.querySelectorAll("img").forEach((img) => {
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt || "Imagen del proyecto";
        modalTitle.textContent = img.alt || "Vista previa";
        modal.show();
      });
    });
  }
})();

(() => {
  const carouselEl = document.getElementById("casosFibraCarousel");
  const descEl = document.getElementById("projectSlideDesc");
  if (!carouselEl || !descEl) return;

  const descriptions = [
    "Login seguro con roles (Admin / Técnico) y control de acceso.",
    "Panel de administración: listado completo de casos y estados.",
    "Creación de casos: datos del cliente, ubicación, prioridad y notas.",
    "Reportes para dueño/admin: métricas, cierres, tiempos y productividad.",
    "Vista técnico: solo casos asignados a su cuadrilla (agenda/pendientes).",
  ];

  // Al iniciar, setear el texto correcto
  descEl.textContent = descriptions[0];

  carouselEl.addEventListener("slid.bs.carousel", (e) => {
    const idx = e.to;
    descEl.textContent = descriptions[idx] || descriptions[0];
  });
})();
