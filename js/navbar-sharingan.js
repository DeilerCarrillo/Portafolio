(() => {
  const nav = document.querySelector(".navbar");
  const eyeTomoe = document.querySelector(".eye--tomoe");
  const eyeMangekyou = document.querySelector(".eye--mangekyou");

  if (!nav || !eyeTomoe || !eyeMangekyou) return;

  function setEye(isScrolled) {
    // navbar scrolled
    nav.classList.toggle("scrolled", isScrolled);

    // swap eyes
    eyeTomoe.classList.toggle("is-active", !isScrolled);
    eyeMangekyou.classList.toggle("is-active", isScrolled);
  }

  function onScroll() {
    setEye(window.scrollY > 40);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
