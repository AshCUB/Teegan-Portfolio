# Teegan Reed — Art Portfolio

Portfolio website for Teegan Reed (ceramics and digital illustration), with a print-ready PDF edition and a password-protected editor.

- `index.html` — main site
- `pdf.html` — view / download the PDF
- `book.html` — print layout used to generate the PDF
- `content/portfolio.json` — all sections, pieces, titles, descriptions, and images (edited through the editor)
- `admin/` — the portfolio editor ([Decap CMS](https://decapcms.org/))

## Editing the portfolio

Go to **https://ashcub.github.io/Teegan-Portfolio/admin/** and log in with your email and password.

1. Open **Portfolio → Portfolio pieces**.
2. Expand a section to edit its name or intro, or expand a piece to change its title, description, medium, or image.
3. **Add** a piece with the "Add piece" button, **remove** one with its ✕, and **reorder** by dragging the ≡ handle.
4. Click **Publish → Publish now**.

The website and the downloadable PDF update automatically about 1–2 minutes after publishing.

## How it works

- Logins are handled by [DecapBridge](https://decapbridge.com/). Editors are invited by email from the DecapBridge dashboard; they don't need a GitHub account.
- Saving in the editor commits to this repository. Every push runs `.github/workflows/deploy.yml`, which rebuilds the PDF from `book.html` and deploys the site to GitHub Pages.

### One-time setup

1. **GitHub Pages:** Settings → Pages → *Source*: **GitHub Actions**.
2. **DecapBridge:** create an account, add a site for `AshCUB/Teegan-Portfolio` with a fine-grained GitHub token (Contents: read & write on this repo only), login URL `https://ashcub.github.io/Teegan-Portfolio/admin/index.html`, auth type *Classic*. Copy the site's `identity_url` into `admin/config.yml`.
3. **Invite editors** from the DecapBridge dashboard (Manage collaborators).

### Testing the editor locally

Run `npx decap-server` in this folder, serve the folder on any local web server, and open `/admin/`. Changes are written straight to your local files.

## Fonts

This project uses the following typefaces. They are owned and licensed by their respective foundries and are **not** covered by this repository. If you reuse any of this code, obtain the fonts from the sources below under your own license terms.

| Font | Used for | Source |
| --- | --- | --- |
| Bedross | Headings | [Envato](https://app.envato.com/search/fonts/7e19a6af-c2b4-42b1-a992-3a27966934e7?itemType=fonts&itemReference=7e19a6af-c2b4-42b1-a992-3a27966934e7&filter.categories_gemini=serif) |
| Calibre | Body text | [Klim Type Foundry](https://klim.co.nz/retail-fonts/calibre/) |

Font files go in `assets/fonts/` as `Bedross-Regular.ttf`, `Bedross-Italic.ttf`, and `Calibre-Regular.otf`.

## Exporting the PDF locally

On Windows with Chrome or Edge installed, double-click `export-pdf.cmd`. It renders `book.html` to `Teegan Reed - Portfolio.pdf` (11 × 8.5 in, landscape). The live site builds its own copy automatically.
