(() => {
  // ==========================================================
  // Certificados: filtros + búsqueda (solo en certificados.html)
  // ==========================================================
  const grid = document.getElementById("certGrid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".cert-card"));
  const filterButtons = Array.from(
    document.querySelectorAll(".cert-filters [data-filter]")
  );
  const searchInput = document.getElementById("certSearch");
  const clearBtn = document.getElementById("certClear");
  const emptyEl = document.getElementById("certEmpty");

  let activeFilter = "all";

  const normalize = (s) => {
    return (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // sin acentos
      .replace(/[^a-z0-9]+/g, " ")      // quita símbolos (+,/,etc)
      .trim();
  };

  // ------------------------------------------
  // Soporte de URL params: ?tag=backend&q=react
  // ------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const initialTag = normalize(urlParams.get("tag"));
  const initialQuery = (urlParams.get("q") || "").toString().trim();

  if (initialQuery && searchInput) {
    searchInput.value = initialQuery;
  }

  if (initialTag && initialTag !== "all") {
    // Activa el botón si existe
    const btn = filterButtons.find((b) => normalize(b.getAttribute("data-filter")) === initialTag);
    if (btn) {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = initialTag;
    }
  }

  function cardMatches(card) {
    const provider = normalize(card.dataset.provider);
    const tags = (card.dataset.tags || "")
      .split(",")
      .map((t) => normalize(t))
      .filter(Boolean);

    const title = normalize(card.dataset.title);
    const caption = normalize(card.dataset.caption);
    const metaText = normalize(card.querySelector(".cert-meta")?.textContent);

    const q = normalize(searchInput?.value);

    // Filtro por proveedor o por tags
    let okFilter = true;
    if (activeFilter !== "all") {
      if (activeFilter === "udemy" || activeFilter === "cisco") {
        okFilter = provider === activeFilter;
      } else {
        okFilter = tags.includes(activeFilter);
      }
    }

    // Búsqueda
    let okSearch = true;
    if (q) {
      okSearch =
        title.includes(q) ||
        caption.includes(q) ||
        metaText.includes(q) ||
        provider.includes(q) ||
        tags.join(" ").includes(q);
    }

    return okFilter && okSearch;
  }

  function apply() {
    let visible = 0;

    cards.forEach((card) => {
      const ok = cardMatches(card);
      card.classList.toggle("is-hidden", !ok);
      if (ok) visible++;
    });

    if (emptyEl) {
      emptyEl.classList.toggle("d-none", visible !== 0);
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter || "all";
      apply();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", apply);
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      apply();
      searchInput.focus();
    });
  }

  apply();
})();