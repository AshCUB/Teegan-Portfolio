# Teegan Reed — Art Portfolio

Portfolio website for Teegan Reed (ceramics and digital illustration), with a print-ready PDF edition.

- `index.html` — main site
- `pdf.html` — view / download the PDF
- `book.html` — print layout used to generate the PDF
- `pieces.js` — titles, blurbs, and images for every piece

## Fonts

The font files are **not included** in this repository because they are licensed and can't be redistributed. Obtain them from the foundries under your own license, then place them in `assets/fonts/` with these exact filenames:

| Font | Used for | Filename(s) | Source |
| --- | --- | --- | --- |
| Bedross (Regular, Italic) | Headings | `Bedross-Regular.ttf`, `Bedross-Italic.ttf` | Purchase or download from the font's official foundry / distributor |
| Calibre Regular | Body text | `Calibre-Regular.otf` | [Klim Type Foundry](https://klim.co.nz/retail-fonts/calibre/) |

Without these files the site falls back to Georgia (headings) and Helvetica / Arial (body).

## Exporting the PDF

On Windows with Chrome or Edge installed, double-click `export-pdf.cmd`. It renders `book.html` to `Teegan Reed - Portfolio.pdf` (11 × 8.5 in, landscape).
