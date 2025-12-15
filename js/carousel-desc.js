(() => {
  const carouselEl = document.getElementById("casosFibraCarousel");
  const descEl = document.getElementById("projectSlideDesc");
  if (!carouselEl || !descEl) return;

  const descriptions = [
    "Acceso seguro al sistema con control por roles (Administrador / Técnico).",
    "Panel administrativo con control general de casos y estados.",
    "Registro estructurado de casos y citas de clientes.",
    "Reportes administrativos para medir la efectividad de las planillas.",
    "Vista del técnico con solo los casos asignados a su cuadrilla.",
  ];

  // Texto inicial
  descEl.textContent = descriptions[0];

  carouselEl.addEventListener("slid.bs.carousel", (e) => {
    descEl.textContent = descriptions[e.to] || descriptions[0];
  });
})();
