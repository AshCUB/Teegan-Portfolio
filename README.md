# Teegan Reed — Art Portfolio

Portfolio website for Teegan Reed (ceramics and digital illustration), with a print-ready PDF edition and a GitHub-based editor.

- `index.html` — main site
- `pdf.html` — view / download the PDF
- `book.html` — print layout used to generate the PDF
- `content/portfolio.json` — all sections, pieces, titles, descriptions, and images (edited through the editor)
- `.pages.yml` — editor configuration for [Pages CMS](https://pagescms.org/)

## Editing the portfolio

Go to **https://app.pagescms.org**, sign in with GitHub, and open **AshCUB/Teegan-Portfolio**.

1. Open **Portfolio**.
2. Expand a section to edit its name or intro, or expand a piece to change its title, description, medium, or image.
3. Add a piece with **Add an entry**, remove one with its delete button, and reorder by dragging.
4. Click **Save**.

The website and the downloadable PDF update automatically about 1–2 minutes after saving.

## How it works

- Pages CMS signs in with GitHub and commits changes straight to this repository.
- Every push runs `.github/workflows/deploy.yml`, which rebuilds the PDF from `book.html` and deploys the site to GitHub Pages.

### One-time setup

1. **GitHub Pages:** Settings → Pages → *Source*: **GitHub Actions**.
2. **Pages CMS:** sign in at https://app.pagescms.org with GitHub and install the Pages CMS GitHub App on this repository.
3. **Editors:** add them as collaborators on this GitHub repo (Settings → Collaborators, *Write* access), or invite them by email from the repo's settings inside Pages CMS (no GitHub account needed).

## Fonts

This project uses the following typefaces. They are owned and licensed by their respective foundries and are **not** covered by this repository. If you reuse any of this code, obtain the fonts from the sources below under your own license terms.

| Font | Used for | Source |
| --- | --- | --- |
| Bedross | Headings | [Envato](https://app.envato.com/search/fonts/7e19a6af-c2b4-42b1-a992-3a27966934e7?itemType=fonts&itemReference=7e19a6af-c2b4-42b1-a992-3a27966934e7&filter.categories_gemini=serif) |
| Calibre | Body text | [Klim Type Foundry](https://klim.co.nz/retail-fonts/calibre/) |

Font files go in `assets/fonts/` as `Bedross-Regular.ttf`, `Bedross-Italic.ttf`, and `Calibre-Regular.otf`.

## Exporting the PDF locally

On Windows with Chrome or Edge installed, double-click `export-pdf.cmd`. It renders `book.html` to `Teegan Reed - Portfolio.pdf` (11 × 8.5 in, landscape). The live site builds its own copy automatically.
