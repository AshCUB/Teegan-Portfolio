(() => {
  const { artist, title, subtitle, coverImage, sections } = window.PORTFOLIO;
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

  sections.forEach((s, si) => {
    pages.push(`
      <section class="page divider" id="${s.id}">
        <div class="divider-text">
          <p class="eyebrow">Section ${pad(si + 1)}</p>
          <h2 class="divider-title">${esc(s.title)}</h2>
          <p class="divider-intro">${esc(s.intro)}</p>
        </div>
        <ol class="thumbs thumbs-${s.pieces.length > 6 ? "many" : "few"}">
          ${s.pieces
            .map(
              (p, i) => `<li><a href="#${s.id}-${i + 1}"><img src="${p.image}" alt=""><span>${pad(i + 1)}</span></a></li>`
            )
            .join("")}
        </ol>
        ${footer(s.title)}
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
})();
