// Selector de paleta, entrada de secciones y año del pie.
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Paleta: la elección se recuerda entre visitas
  const group = document.getElementById("palette");
  const options = group ? [...group.querySelectorAll("[data-palette]")] : [];
  const names = options.map((b) => b.dataset.palette);

  const apply = (name) => {
    if (!names.includes(name)) name = names[0];
    root.setAttribute("data-palette", name);
    options.forEach((b) =>
      b.setAttribute("aria-checked", String(b.dataset.palette === name))
    );
  };

  apply(localStorage.getItem("paleta") || names[0] || "ocean");

  options.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      apply(btn.dataset.palette);
      localStorage.setItem("paleta", btn.dataset.palette);
    });

    // flechas para recorrer el grupo con el teclado
    btn.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
        e.key
      ];
      if (!step) return;
      e.preventDefault();
      const next = options[(i + step + options.length) % options.length];
      next.focus();
      next.click();
    });
  });

  // ── Entrada de secciones
  const targets = document.querySelectorAll(".rise");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("on"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("on");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
});
