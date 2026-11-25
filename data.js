// Loads the CMS-managed content. XHR (not fetch) so it also works from file:// during PDF export.
window.loadPortfolio = () =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "content/portfolio.json?v=" + Date.now());
    xhr.onload = () => {
      try {
        resolve(normalize(JSON.parse(xhr.responseText)));
      } catch (e) {
        reject(e);
      }
    };
    xhr.onerror = reject;
    xhr.send();
  });

// Fill in defaults so missing or blank fields from the CMS never break the layout.
function normalize(data) {
  const used = new Set();
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  // CMS stores "/assets/..."; make it relative so it works on the GitHub Pages subpath and from file://.
  const rel = (p) => String(p || "").replace(/^\/+/, "");
  data.sections = (data.sections || []).map((s, i) => {
    let id = slug(s.title) || `section-${i + 1}`;
    while (used.has(id)) id += "-" + (i + 1);
    used.add(id);
    return {
      ...s,
      id,
      title: s.title || "",
      intro: s.intro || "",
      pieces: (s.pieces || [])
        .filter((p) => p && p.image)
        .map((p) => ({ ...p, image: rel(p.image), title: p.title || "Untitled", medium: p.medium || "", blurb: p.blurb || "" })),
    };
  });
  data.coverImage = rel(data.coverImage) || data.sections.flatMap((s) => s.pieces)[0]?.image || "";
  return data;
}
