(() => {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  const brandEye = nav.querySelector(".brand-eye");
  const eyeTomoe = nav.querySelector(".eye--tomoe");
  const eyeMangekyou = nav.querySelector(".eye--mangekyou");

  function setEye(isScrolled) {
    if (!eyeTomoe || !eyeMangekyou) return;

    eyeTomoe.classList.toggle("is-active", !isScrolled);
    eyeMangekyou.classList.toggle("is-active", isScrolled);
  }

  function onScroll() {
    const scrolled = window.scrollY > 40;

    // Tu efecto existente del navbar
    nav.classList.toggle("scrolled", scrolled);

    // Cambia Tomoe <-> Mangekyou
    setEye(scrolled);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
