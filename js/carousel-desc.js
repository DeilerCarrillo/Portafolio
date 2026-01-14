(() => {
  // ==========================================================
  // Multi-project slide descriptions
  // Lee data-descriptions="texto1||texto2||..." en .js-project
  // y lo sincroniza con el carrusel dentro del bloque.
  // ==========================================================
  const projects = document.querySelectorAll(".js-project");

  projects.forEach((project) => {
    const carouselEl = project.querySelector(".js-project-carousel");
    const descEl = project.querySelector(".js-slide-desc");
    if (!carouselEl || !descEl) return;

    const raw = project.getAttribute("data-descriptions") || "";
    const descriptions = raw
      .split("||")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!descriptions.length) return;

    // Texto inicial
    descEl.textContent = descriptions[0];

    carouselEl.addEventListener("slid.bs.carousel", (e) => {
      const idx = typeof e.to === "number" ? e.to : 0;
      descEl.textContent = descriptions[idx] || descriptions[0];
    });
  });
})();