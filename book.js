loadPortfolio().then(({ artist, title, subtitle, coverImage, sections }) => {
  const book = document.getElementById("book");
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s = "") =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  const pages = [];
  const footer = (label) => `
    <footer class="folio">
      <span>${esc(artist)}</span>
      <span>${esc(label)}</span>
      <span class="folio-num"></span>
    </footer>`;

  const startPages = {};
  let count = 2;
  sections.forEach((s) => {
    startPages[s.id] = count;
    count += 1 + s.pieces.length;
  });

  pages.push(`
    <section class="page cover" id="cover">
      <div class="cover-text">
        <div class="cover-mark" data-wordmark></div>
        <h1 class="cover-title">${esc(title)}</h1>
        <p class="cover-sub">${esc(subtitle)}</p>
        <ol class="cover-toc">
          ${sections
            .map(
              (s, i) => `<li><a href="#${s.id}"><span>${pad(i + 1)}</span>${esc(s.title)}<em>p. ${startPages[s.id]}</em></a></li>`
            )
            .join("")}
        </ol>
      </div>
      <div class="cover-image"><img src="${coverImage}" alt=""></div>
    </section>`);

  // 6 x 4 collage grids keyed by piece count. pN = piece N, t = title tile, n = intro tile.
  const collages = {
    5: ["p0 p0 p2 p2 t t", "p0 p0 p2 p2 t t", "p0 p0 p3 p1 n n", "p0 p0 p4 p4 n n"],
    12: ["p3 p0 p0 p4 p1 p1", "p5 t t p4 p6 p7", "p5 t t p8 p6 p9", "p10 p11 n n p2 p2"],
  };

  // Any other count: 6-column grid, title + intro tiles 2x2 each, then widen the first images to fill empty cells.
  const autoLayout = (n) => {
    if (n <= 4) {
      const small = { 1: ["grid-column:span 2;grid-row:span 2"], 2: ["grid-row:span 2", "grid-row:span 2"], 3: ["grid-row:span 2"] };
      return { rows: 2, style: (i) => (small[n] || [])[i] || "" };
    }
    const rows = Math.ceil((n + 8) / 6);
    const wide = rows * 6 - (n + 8);
    return { rows, style: (i) => (i < wide ? "grid-column:span 2" : "") };
  };

  sections.forEach((s, si) => {
    const areas = collages[s.pieces.length];
    const auto = areas ? null : autoLayout(s.pieces.length);
    const gridStyle = areas
      ? `grid-template-areas:${areas.map((r) => `'${r}'`).join(" ")}`
      : `grid-template-rows:repeat(${auto.rows}, 1fr)`;
    const tileStyle = (i) => (areas ? `grid-area:p${i}` : auto.style(i));
    pages.push(`
      <section class="page collage${areas ? "" : " collage-auto"}" id="${s.id}" style="${gridStyle}">
        <div class="tile tile-title">
          <p class="eyebrow">Section ${pad(si + 1)}</p>
          <h2 class="collage-title">${esc(s.title)}</h2>
        </div>
        <div class="tile tile-intro">
          <p>${esc(s.intro)}</p>
          <p class="tile-count">${pad(s.pieces.length)} pieces</p>
        </div>
        ${s.pieces
          .map(
            (p, i) => `
            <a class="tile tile-img" href="#${s.id}-${i + 1}" style="${tileStyle(i)}">
              <img src="${p.image}" alt=""${p.focus ? ` style="object-position:${p.focus}"` : ""}>
              <span>${pad(i + 1)}</span>
            </a>`
          )
          .join("")}
      </section>`);

    s.pieces.forEach((p, i) => {
      pages.push(`
        <section class="page piece ${i % 2 ? "piece-flip" : ""}" id="${s.id}-${i + 1}">
          <figure class="piece-image"><img src="${p.image}" alt="${esc(p.title)}"></figure>
          <div class="piece-text">
            <p class="eyebrow">${esc(s.title)}</p>
            <div class="piece-info">
              <span class="piece-num">${pad(i + 1)}</span>
              <h3 class="piece-title">${esc(p.title)}</h3>
              ${p.subtitle ? `<p class="piece-subtitle">${esc(p.subtitle)}</p>` : ""}
              <hr>
              <p class="piece-blurb">${esc(p.blurb)}</p>
              <p class="piece-medium">${esc(p.medium)}</p>
            </div>
          </div>
          ${footer(s.title)}
        </section>`);
    });
  });

  pages.push(`
    <section class="page closing">
      <div class="closing-mark" data-wordmark></div>
      <p class="closing-text">Thank you for viewing</p>
    </section>`);

  book.innerHTML = pages.join("");
  book.querySelectorAll(".folio-num").forEach((el) => {
    el.textContent = [...book.children].indexOf(el.closest(".page")) + 1;
  });
  document.querySelectorAll("[data-wordmark]").forEach((el) => (el.innerHTML = window.WORDMARK));
});
