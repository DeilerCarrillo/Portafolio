(() => {
  // ==========================================================
  // MULTI-CAROUSEL CONTROLS (Play/Pause + Progress) + Image Modal
  // ==========================================================

  // -------------------------
  // Modal (reutilizado)
  // -------------------------
  const modalEl = document.getElementById("imgModal");
  const modalImg = document.getElementById("imgModalSrc");
  const modalTitle = document.getElementById("imgModalTitle");
  const modalCaption = document.getElementById("imgModalCaption");

  const modal =
    modalEl && window.bootstrap ? new bootstrap.Modal(modalEl) : null;

  function openImageModal({ src, title, caption, alt }) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || caption || title || "Vista previa";
    if (modalTitle) modalTitle.textContent = title || "Vista previa";
    if (modalCaption) modalCaption.textContent = caption || "";
    modal.show();
  }

  // Delegación: cualquier elemento con data-open="img-modal"
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest('[data-open="img-modal"]');
    if (!trigger) return;

    // Evita abrir modal al hacer click en enlaces internos (ej: "Validar")
    if (e.target.closest("[data-skip-modal]")) return;

    const src = trigger.getAttribute("data-src") || trigger.getAttribute("src");
    if (!src) return;

    const title = trigger.getAttribute("data-title") || "Vista previa";
    const caption =
      trigger.getAttribute("data-caption") ||
      trigger.getAttribute("alt") ||
      "";

    const alt =
      trigger.getAttribute("data-alt") ||
      trigger.getAttribute("alt") ||
      caption;

    openImageModal({ src, title, caption, alt });
  });

  // -------------------------
  // Carousel controllers
  // -------------------------
  const carousels = document.querySelectorAll(".js-project-carousel");

  carousels.forEach((carouselEl) => {
    const wrap = carouselEl.closest(".project-card") || carouselEl.parentElement;
    const toggleBtn =
      wrap && wrap.querySelector(".js-carousel-toggle")
        ? wrap.querySelector(".js-carousel-toggle")
        : null;
    const bar =
      wrap && wrap.querySelector(".js-carousel-bar")
        ? wrap.querySelector(".js-carousel-bar")
        : null;

    const intervalMs =
      Number(carouselEl.getAttribute("data-bs-interval")) || 3500;

    // Bootstrap carousel instance
    const carousel =
      window.bootstrap &&
      bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: intervalMs,
        ride: true,
        pause: false,
      });

    if (!carousel) return;

    // Estado por carrusel
    let isPaused = false;
    let rafId = null;
    let startAt = null; // performance.now()
    let elapsed = 0;

    function setBar(pct) {
      if (!bar) return;
      bar.style.width = Math.max(0, Math.min(100, pct)) + "%";
    }

    function stopProgress() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    function resetProgress() {
      startAt = null;
      elapsed = 0;
      setBar(0);
      stopProgress();
    }

    function animate(ts) {
      if (isPaused) return;
      if (startAt === null) startAt = ts;
      const pct = ((ts - startAt) / intervalMs) * 100;
      setBar(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(animate);
      } else {
        stopProgress();
      }
    }

    function startProgress() {
      if (!bar) return;
      stopProgress();
      rafId = requestAnimationFrame(animate);
    }

    // Iniciar
    resetProgress();
    startProgress();

    // Cuando cambia de slide
    carouselEl.addEventListener("slid.bs.carousel", () => {
      resetProgress();
      if (!isPaused) startProgress();
    });

    // Play / Pause
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        isPaused = !isPaused;

        if (isPaused) {
          carousel.pause();
          // guardar tiempo consumido
          if (startAt !== null) elapsed += performance.now() - startAt;
          startAt = null;
          stopProgress();
          toggleBtn.textContent = "Reanudar";
        } else {
          // reanudar desde donde quedó
          carousel.cycle();
          startAt = performance.now() - elapsed;
          startProgress();
          toggleBtn.textContent = "Pausar";
        }
      });
    }
  });
})();