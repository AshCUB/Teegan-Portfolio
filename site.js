loadPortfolio().then(({ sections }) => {
  const $ = (sel) => document.querySelector(sel);
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s = "") =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const items = sections.flatMap((s) =>
    s.pieces.map((p, i) => ({ ...p, section: s.id, sectionTitle: s.title, n: i + 1 }))
  );

  document.querySelectorAll("[data-wordmark]").forEach((el) => (el.innerHTML = window.WORDMARK));
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const pdfPages = $("#pdf-pages");
  if (pdfPages) pdfPages.textContent = 2 + sections.reduce((n, s) => n + 1 + s.pieces.length, 0);

  const marquee = $("#marquee");
  if (marquee) {
    const lists = sections.map((s) => s.pieces).reverse();
    const mixed = [];
    for (let i = 0; i < Math.max(0, ...lists.map((l) => l.length)); i++) {
      lists.forEach((l) => l[i] && mixed.push(l[i]));
    }
    const strip = mixed.map((p) => `<img src="${p.image}" alt="" loading="eager">`).join("");
    marquee.innerHTML = strip + strip;
  }

  const slides = $("#hero-slides");
  const art = sections.filter((s) => s.slideshow).flatMap((s) => s.pieces);
  if (!art.length) art.push(...sections.flatMap((s) => s.pieces));
  if (slides && art.length) {
    slides.innerHTML = art
      .map((p, i) => {
        const focus = p.heroFocus || "50% 30%";
        return `<div class="hero-slide${i ? "" : " is-active"}"><img src="${p.image}" alt="" style="object-position:${focus};transform-origin:${focus}"${i > 1 ? ' loading="lazy"' : ""}></div>`;
      })
      .join("");
    const els = [...slides.children];
    let cur = 0;
    setInterval(() => {
      const prev = els[cur];
      cur = (cur + 1) % els.length;
      els.forEach((el) => el.classList.remove("is-leaving"));
      prev.classList.replace("is-active", "is-leaving");
      els[cur].classList.add("is-active");
      setTimeout(() => prev.classList.remove("is-leaving"), 2000);
    }, 7000);
  }

  const grid = $("#grid");
  if (grid) {
    grid.innerHTML = items
      .map(
        (p, i) => `
        <li class="card reveal" data-section="${p.section}">
          <button type="button" class="card-btn" data-index="${i}" aria-label="View ${esc(p.title)}">
            <span class="card-media"><img src="${p.image}" alt="${esc(p.title)}" loading="lazy"></span>
            <span class="card-meta">
              <span class="card-num">${pad(p.n)}</span>
              <span class="card-title">${esc(p.title)}${p.subtitle ? ` <em>${esc(p.subtitle)}</em>` : ""}</span>
              <span class="card-medium">${esc(p.medium)}</span>
            </span>
          </button>
        </li>`
      )
      .join("");

    const filters = $("#filters");
    filters.innerHTML = [{ id: "all", title: "All", count: items.length }, ...sections.map((s) => ({ ...s, count: s.pieces.length }))]
      .map(
        (f, i) =>
          `<button type="button" class="filter${i ? "" : " is-active"}" data-filter="${f.id}" aria-pressed="${!i}">${esc(f.title)}<sup>${pad(f.count)}</sup></button>`
      )
      .join("");

    const applyFilter = (id) => {
      filters.querySelectorAll(".filter").forEach((b) => {
        const on = b.dataset.filter === id;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on);
      });
      grid.querySelectorAll(".card").forEach((c) => {
        c.hidden = id !== "all" && c.dataset.section !== id;
        c.classList.add("is-in");
      });
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (b) applyFilter(b.dataset.filter);
    });

    const lb = $("#lightbox");
    const lbImg = $("#lb-img");
    let current = 0;
    const visible = () => items.map((_, i) => i).filter((i) => !grid.children[i].hidden);
    const show = (i) => {
      current = i;
      const p = items[i];
      const list = visible();
      lbImg.src = p.image;
      lbImg.alt = p.title;
      $("#lb-count").textContent = `${pad(list.indexOf(i) + 1)} / ${pad(list.length)}`;
      $("#lb-section").textContent = `${p.sectionTitle} — ${pad(p.n)}`;
      $("#lb-title").textContent = p.title;
      $("#lb-sub").textContent = p.subtitle || "";
      $("#lb-blurb").textContent = p.blurb;
      $("#lb-medium").textContent = p.medium;
    };
    const step = (d) => {
      const list = visible();
      show(list[(list.indexOf(current) + d + list.length) % list.length]);
    };
    grid.addEventListener("click", (e) => {
      const b = e.target.closest(".card-btn");
      if (!b) return;
      show(Number(b.dataset.index));
      lb.showModal();
      document.documentElement.classList.add("lb-open");
    });
    lb.addEventListener("close", () => document.documentElement.classList.remove("lb-open"));
    lb.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]") || e.target === lb) lb.close();
      if (e.target.closest("[data-prev]")) step(-1);
      if (e.target.closest("[data-next]")) step(1);
    });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }
});
