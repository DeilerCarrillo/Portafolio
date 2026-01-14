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
  const modalPrev = document.getElementById("imgModalPrev");
  const modalNext = document.getElementById("imgModalNext");
  const modalCounter = document.getElementById("imgModalCounter");

  const modal =
    modalEl && window.bootstrap ? new bootstrap.Modal(modalEl) : null;

  // Estado para galería
  let gallery = null; // string[] | null
  let galleryIndex = 0;
  let baseTitle = "Vista previa";

  function updateNavUI() {
    const isGallery = !!(gallery && gallery.length > 1);

    if (modalPrev) modalPrev.hidden = !isGallery;
    if (modalNext) modalNext.hidden = !isGallery;
    if (modalCounter) modalCounter.hidden = !isGallery;

    if (!isGallery) return;

    if (modalPrev) modalPrev.disabled = galleryIndex <= 0;
    if (modalNext) modalNext.disabled = galleryIndex >= gallery.length - 1;

    if (modalCounter) {
      modalCounter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
    }

    if (modalTitle) {
      modalTitle.textContent = `${baseTitle} (${galleryIndex + 1}/${gallery.length})`;
    }
  }

  function renderModal({ src, title, caption, alt }) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || caption || title || "Vista previa";
    baseTitle = title || "Vista previa";
    if (modalTitle) modalTitle.textContent = baseTitle;
    if (modalCaption) modalCaption.textContent = caption || "";
    updateNavUI();
  }

  function openImageModal({ src, title, caption, alt, gallery: g, index = 0 }) {
    if (!modal || !modalImg) return;

    // Configurar galería si existe
    gallery = Array.isArray(g) && g.length ? g : null;
    galleryIndex = Number.isFinite(index) ? index : 0;

    const realSrc = gallery ? gallery[Math.max(0, Math.min(galleryIndex, gallery.length - 1))] : src;
    renderModal({ src: realSrc, title, caption, alt });
    modal.show();
  }

  function showAt(idx) {
    if (!gallery || !modalImg) return;
    const nextIdx = Math.max(0, Math.min(idx, gallery.length - 1));
    galleryIndex = nextIdx;
    modalImg.src = gallery[galleryIndex];
    updateNavUI();
  }

  if (modalPrev) modalPrev.addEventListener("click", () => showAt(galleryIndex - 1));
  if (modalNext) modalNext.addEventListener("click", () => showAt(galleryIndex + 1));

  // Teclado: flechas para navegar cuando el modal está abierto
  document.addEventListener("keydown", (e) => {
    if (!modalEl || !modalEl.classList.contains("show")) return;
    if (!gallery || gallery.length < 2) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showAt(galleryIndex - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      showAt(galleryIndex + 1);
    }
  });

  // Reset al cerrar
  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", () => {
      gallery = null;
      galleryIndex = 0;
      baseTitle = "Vista previa";
      if (modalCounter) modalCounter.textContent = "";
      if (modalPrev) modalPrev.hidden = true;
      if (modalNext) modalNext.hidden = true;
      if (modalCounter) modalCounter.hidden = true;
    });
  }

  // Delegación: cualquier elemento con data-open="img-modal"
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest('[data-open="img-modal"]');
    if (!trigger) return;

    // Evita abrir modal al hacer click en enlaces internos (ej: "Validar")
    if (e.target.closest("[data-skip-modal]")) return;

    const galleryAttr = trigger.getAttribute("data-gallery");
    const galleryList = galleryAttr ? galleryAttr.split("|").map((s) => s.trim()).filter(Boolean) : null;
    const idx = Number(trigger.getAttribute("data-index") || 0);

    const src =
      (galleryList && galleryList.length ? galleryList[Math.max(0, Math.min(idx, galleryList.length - 1))] : null) ||
      trigger.getAttribute("data-src") ||
      trigger.getAttribute("src");

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

    openImageModal({ src, title, caption, alt, gallery: galleryList, index: idx });
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