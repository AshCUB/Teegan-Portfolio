// Loads the CMS-managed content. XHR (not fetch) so it also works from file:// during PDF export.
const getJSON = (url) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}?v=${Date.now()}`);
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (e) {
        reject(e);
      }
    };
    xhr.onerror = reject;
    xhr.send();
  });

window.loadPortfolio = () =>
  Promise.all([getJSON("content/portfolio.json"), getJSON("content/slideshow.json").catch(() => ({}))]).then(
    ([data, show]) => normalize(data, show)
  );

// CMS stores "/assets/..."; make it relative so it works on the GitHub Pages subpath and from file://.
const rel = (p) => String(p || "").replace(/^\/+/, "");

// Fill in defaults so missing or blank fields from the CMS never break the layout.
function normalize(data, show) {
  const used = new Set();
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
  data.slides = ((show && show.slides) || [])
    .filter((s) => s && s.image)
    .map((s) => ({ image: rel(s.image), focus: `${s.horizontal || "50%"} ${s.vertical || "30%"}` }));
  data.showClosing = data.showClosing !== false;
  data.coverImage = rel(data.coverImage) || data.sections.flatMap((s) => s.pieces)[0]?.image || "";
  return data;
}
