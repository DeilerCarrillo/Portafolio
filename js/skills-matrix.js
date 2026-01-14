(() => {
  // ==========================================================
  // Skills Matrix (Home)
  // - Chips de certificado: llevan a certificados.html con filtros
  // - Chips de evidencia: abren el modal de imagen (reusa imgModal)
  // ==========================================================
  const root = document.getElementById("skillsMatrix");
  if (!root) return;

  const toCert = ({ tag, q }) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (q) params.set("q", q);
    window.location.href = `certificados.html?${params.toString()}`;
  };

  const matrix = [
    {
      title: "Backend",
      icon: "bi-database",
      items: [
        {
            name: "ASP.NET Core",
            chips: [
              { kind: "udemy", label: "Master API RESTful (.NET 9)", to: { tag: "backend", q: "ASP.NET Core Web API .NET 9" } },
              { kind: "practice", badge: "Proyecto", label: "Sistema de Casos y Citas (Roles)" },
              {
                kind: "evidence",
                badge: "Evidencia",
                label: "Capturas del sistema",
                modal: {
                  title: "Sistema de Gestión de Casos y Citas",
                  caption: "Evidencia práctica: roles, asignación, historial y reportes.",
                  gallery: [
                    "img/Proyecto/casos-1-login.png",
                    "img/Proyecto/casos-2-reporte.png",
                    "img/Proyecto/casos-3-crear-usuario.png",
                    "img/Proyecto/casos-4-crear-rol.png",
                    "img/Proyecto/casos-5-lista-roles.png",
                    "img/Proyecto/casos-6-nuevo-caso.png",
                    "img/Proyecto/casos-7-lista-casos.png",
                    "img/Proyecto/casos-8-reportes.png"
                  ],
                  alt: "Capturas del sistema de casos y citas",
                },
              },
            ],
          },
        {
          name: "EF Core",
          chips: [
            { kind: "udemy", badge: "Udemy", label: "Web API (.NET 9) + EF Core", to: { tag: "backend", q: "Web API" } },
          ],
        },
        {
          name: "SQL Server",
          chips: [
            { kind: "udemy", badge: "Udemy", label: "SQL + API REST (.NET 9)", to: { tag: "backend", q: ".NET 9" } },
          ],
        },
        {
          name: "SOLID / Clean Code",
          chips: [
            { kind: "udemy", badge: "Udemy", label: "Principios SOLID y Clean Code", to: { tag: "backend", q: "SOLID" } },
          ],
        },
      ],
    },
    {
      title: "Frontend",
      icon: "bi-braces",
      items: [
        {
          name: "HTML / CSS",
          chips: [
            { kind: "practice", badge: "Práctica", label: "Proyecto Diser (Sitio corporativo)", to: null },
          ],
        },
        {
          name: "React",
          chips: [
            { kind: "udemy", badge: "Udemy", label: "React: De cero a experto", to: { tag: "frontend", q: "React" } },
          ],
        },
      ],
    },
    {
      title: "DevOps",
      icon: "bi-gear",
      items: [
        {
          name: "Git",
          chips: [
            { kind: "udemy", badge: "Udemy", label: "Git + GitHub (control de versiones)", to: { tag: "devops", q: "Git GitHub" } },
          ],
        },
        {
          name: "Docker",
          chips: [
            { kind: "udemy", badge: "Udemy", label: "Docker (guía práctica)", to: { tag: "devops", q: "Docker" } },
          ],
        },
        {
          name: "Linux",
          chips: [
            { kind: "cisco", badge: "Cisco", label: "Linux Essentials", to: { tag: "sistemas", q: "Linux Essentials" } },
          ],
        },
      ],
    },
    {
      title: "Data & BI",
      icon: "bi-bar-chart",
      items: [
        {
          name: "Power BI / ETL",
          chips: [
            { kind: "practice", badge: "Práctica", label: "Investigación + implementación (Universidad)", to: null },
            {
              kind: "evidence",
              badge: "Evidencia",
              label: "Reportes (capturas)",
              modal: {
                gallery: [
                  "img/powerbi/powerbi-1.png",
                  "img/powerbi/powerbi-2.png",
                  "img/powerbi/powerbi-3.png",
                  "img/powerbi/powerbi-4.png",
                  "img/powerbi/powerbi-5.png",
                ],
                title: "Evidencia: Reportes Power BI",
                caption: "Capturas reales de reportes en Power BI (análisis, visualizaciones y modelado).",
                alt: "Reportes Power BI",
              },
            },
          ],
        },
        {
          name: "Power Query / DAX",
          chips: [
            { kind: "practice", badge: "Práctica", label: "Transformaciones + modelado", to: null },
          ],
        },
      ],
    },
  ];

  const makeChip = (chip) => {
    const baseClass = "sm-chip";
    const variant =
      chip.kind === "cisco"
        ? "sm-chip--cisco"
        : chip.kind === "practice"
          ? "sm-chip--practice"
          : chip.kind === "evidence"
            ? "sm-chip--evidence"
            : "sm-chip--udemy";

    // Evidence opens modal via global delegation (carousel-controls.js)
    if (chip.kind === "evidence" && chip.modal) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `${baseClass} ${variant}`;
      btn.setAttribute("data-open", "img-modal");
      // Si viene una galería, el modal podrá navegar con Prev/Next.
      if (chip.modal.gallery && chip.modal.gallery.length) {
        btn.setAttribute("data-gallery", chip.modal.gallery.join("|"));
        btn.setAttribute("data-index", "0");
        btn.setAttribute("data-src", chip.modal.gallery[0]);
      } else {
        btn.setAttribute("data-src", chip.modal.src);
      }
      btn.setAttribute("data-title", chip.modal.title || "Vista previa");
      btn.setAttribute("data-caption", chip.modal.caption || "");
      btn.setAttribute("data-alt", chip.modal.alt || chip.modal.title || "");
      btn.innerHTML = `<span class="sm-chip__badge">${chip.badge}</span><span>${chip.label}</span>`;
      return btn;
    }

    // Clickable chip to certificates
    if (chip.to) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `${baseClass} ${variant}`;
      btn.addEventListener("click", () => toCert(chip.to));
      btn.innerHTML = `<span class="sm-chip__badge">${chip.badge}</span><span>${chip.label}</span>`;
      return btn;
    }

    // Non-clickable informational chip
    const span = document.createElement("span");
    span.className = `${baseClass} ${variant}`;
    span.style.cursor = "default";
    span.innerHTML = `<span class="sm-chip__badge">${chip.badge}</span><span>${chip.label}</span>`;
    return span;
  };

  const render = () => {
    root.innerHTML = "";
    matrix.forEach((cat) => {
      const card = document.createElement("article");
      card.className = "sm-card";

      const head = document.createElement("div");
      head.className = "sm-card__head";
      head.innerHTML = `<i class="bi ${cat.icon}"></i> <span>${cat.title}</span>`;

      const body = document.createElement("div");
      body.className = "sm-card__body";

      cat.items.forEach((it) => {
        const skill = document.createElement("div");
        skill.className = "sm-skill";

        const name = document.createElement("div");
        name.className = "sm-skill__name";
        name.textContent = it.name;

        const chips = document.createElement("div");
        chips.className = "sm-chips";
        it.chips.forEach((c) => chips.appendChild(makeChip(c)));

        skill.appendChild(name);
        skill.appendChild(chips);
        body.appendChild(skill);
      });

      card.appendChild(head);
      card.appendChild(body);
      root.appendChild(card);
    });
  };

  document.addEventListener("DOMContentLoaded", render);
})();
