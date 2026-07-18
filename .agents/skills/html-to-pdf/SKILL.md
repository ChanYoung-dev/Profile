---
name: html-to-pdf
description: Use when the user wants to generate a PDF directly from a local HTML file (e.g. resume, portfolio, report) and the browser's "Print → Save as PDF" produces cut-off content, blank pages, or wrong page counts. Uses headless Chrome to render the HTML exactly as the CSS specifies, then verifies the result page-by-page.
---

# HTML → PDF (headless Chrome)

Generate a PDF from a local HTML file using headless Chrome, then verify each page visually before reporting success.

This is the right tool when:
- The HTML uses `@page`, `@media print`, `page-break-*`, `print-color-adjust`, etc., and the user wants the **exact** result the CSS specifies.
- Browser "Print → PDF" preview is producing blank pages, missing content, or wrong page counts.
- The user wants a one-shot, scripted PDF (no manual print dialog).

## Prerequisites (check first)

```bash
# Chrome
ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Python + PyMuPDF (for verification)
python3 -c "import fitz" || pip3 install pymupdf
```

If Chrome is missing, fall back to Edge/Brave (same `--headless=new --print-to-pdf` flags) or `wkhtmltopdf`. Don't try `weasyprint` for CSS that uses modern Grid/Flex print rules — it diverges from browser rendering.

## The recipe

### 1. Serve the HTML over HTTP (don't use `file://`)

`file://` URLs cause headless Chrome to silently fail on `<link>` stylesheets, web fonts, and same-origin checks. Always serve over a local HTTP port:

```bash
cd /path/to/project
python3 -m http.server 8765 --bind 127.0.0.1 > /tmp/htmlpdf.log 2>&1 &
echo $! > /tmp/htmlpdf.pid
sleep 1
curl -s -o /dev/null -w "ok? %{http_code}\n" "http://127.0.0.1:8765/the-page.html"
```

### 2. Run headless Chrome

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --no-margins \
  --virtual-time-budget=10000 \
  --print-to-pdf-no-header \
  --print-to-pdf=/abs/path/to/output.pdf \
  "http://127.0.0.1:8765/the-page.html"
```

Key flags:
- `--headless=new` — modern headless mode. Old `--headless` works but renders fonts differently.
- `--virtual-time-budget=10000` — wait up to 10s for web fonts (Pretendard, Google Fonts) to load. Without this, Korean text often falls back to default fonts.
- `--no-pdf-header-footer` + `--print-to-pdf-no-header` — strip Chrome's auto-added URL/date headers (both flags needed for safety).
- `--no-margins` — let CSS `@page { margin: ... }` control margins, not the browser.
- Always pass an **absolute path** to `--print-to-pdf`. Relative paths land in unpredictable cwd.

### 3. Stop the server

```bash
kill $(cat /tmp/htmlpdf.pid) 2>/dev/null
rm -f /tmp/htmlpdf.pid
```

### 4. Verify (mandatory)

A PDF that opens without error is **not** proof of correctness. Always verify:

```bash
python3 ~/.Codex/skills/html-to-pdf/scripts/verify-pdf.py /abs/path/to/output.pdf
```

The script prints page count + line count per page and emits PNG previews to `/tmp/htmlpdf_p*.png`. Then **read at least one PNG** with the Read tool and confirm:
- No content is cut off at page bottoms.
- No nearly-empty pages (a footer-only page is the classic symptom — see Pitfalls below).
- Background colors / accent highlights actually render (proves `print-color-adjust: exact` is working).

If anything is wrong, fix the CSS and regenerate. Don't ship a PDF you haven't seen.

## Pitfalls (these have all bitten before)

### Pitfall 1 — A nearly-empty page with only a page number / footer

**Symptom**: Page count is one higher than expected. The orphan page contains only `.foot` / `.footer` / page number, nothing else.

**Cause**: A `.foot` element at the bottom of a `.page` section couldn't fit on the same printed page as the content above it, so it got pushed to the next physical page. Then the next `.page` section's `page-break-before: always` rule started yet another page.

**Fix**: In `@media print`, hide page-number footers — they're meaningless inside a PDF anyway:

```css
@media print {
  .foot { display: none !important; }
}
```

### Pitfall 2 — Content gets cut off (lost) at page boundaries

**Symptom**: Mid-paragraph text or whole sections vanish.

**Cause**: CSS forces `.page { height: 297mm; overflow: hidden; }` to "guarantee" one section per A4 page. Anything beyond 297mm is silently clipped.

**Fix**: Don't strait-jacket sections to a fixed height. Let content flow:

```css
@media print {
  .page {
    width: 210mm;
    min-height: 0;
    height: auto;
    max-height: none;
    overflow: visible;
    padding: 12mm 14mm;
    box-sizing: border-box;
  }
  .page + .page {
    page-break-before: always;
    break-before: page;
  }
}
```

This lets a long section span multiple printed pages naturally instead of clipping.

### Pitfall 3 — Background colors and highlights don't print

**Symptom**: Card backgrounds, callout boxes, accent stripes are missing in the PDF.

**Fix**:
```css
html, body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
```

### Pitfall 4 — Browser's default print margin doubles up with `@page` margin

**Symptom**: Content appears smaller / shifted in PDF vs. screen preview.

**Fix**: Set `@page { margin: 0; }` and handle safe-area padding inside `.page`:

```css
@page { size: A4; margin: 0; }
@media print {
  .page { padding: 12mm 14mm; box-sizing: border-box; }
}
```

Combined with Chrome's `--no-margins` flag, this guarantees no double margin.

### Pitfall 5 — Fonts render as system default

**Symptom**: Korean falls back to Apple SD Gothic Neo or similar despite `<link>`-loaded Pretendard.

**Cause**: Headless Chrome printed the PDF before the web font finished downloading.

**Fix**: Add `--virtual-time-budget=10000` (10 seconds) to the Chrome command. For very heavy pages, increase to 20000.

### Pitfall 6 — Relative paths in `<img src="..." />` 404 silently

**Symptom**: An image is missing in the PDF; HTML looks fine in the browser.

**Cause**: You served the HTTP server from the wrong directory. The image path is relative to the HTML file's location, not the cwd at server start.

**Fix**: Always `cd` to the project root before starting `python3 -m http.server`. Verify with `curl` that the image returns 200 before generating the PDF.

## End-to-end checklist

Use TaskCreate to track these for any non-trivial PDF generation:

1. Confirm Chrome path and PyMuPDF availability.
2. Skim `@media print` block of the source CSS for the 6 pitfalls above. Fix any obvious ones inline before generating.
3. Start local HTTP server from the correct project root.
4. Generate PDF with the full Chrome command (absolute output path).
5. Stop the server.
6. Run `verify-pdf.py` to dump page count + PNG previews.
7. **Read at least one suspicious PNG** with the Read tool — usually the last page (truncation check) and any short-line-count page (orphan-footer check).
8. If problems found, edit CSS → regenerate → re-verify. Don't claim success until the visual pass is clean.
9. Report PDF path, page count, and a one-line summary of each page's content to the user.

## Helper scripts

- `scripts/generate-pdf.sh <html-path> <output-pdf>` — full pipeline (server + Chrome + cleanup).
- `scripts/verify-pdf.py <pdf-path> [dpi]` — page count, line counts, PNG dumps.

Both are idempotent; rerun freely while iterating on CSS.