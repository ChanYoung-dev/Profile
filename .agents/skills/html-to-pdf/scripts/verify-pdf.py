#!/usr/bin/env python3
"""
verify-pdf.py — Inspect a generated PDF for the common html-to-pdf bugs.

Usage:  verify-pdf.py <pdf-path> [dpi]
Default dpi=110 (good for Read-tool inspection).

Outputs:
  - Page count + per-page line count + first/last lines
  - PNG previews to /tmp/htmlpdf_p<N>.png (overwrites)
  - Heuristic warnings for:
      * orphan-footer pages (line count ≤ 3 → likely empty)
      * very heavy pages (line count > 120 → may indicate cramming)

After running this, pick at least one PNG to Read with the Read tool.
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("[verify-pdf] PyMuPDF not installed. Run: pip3 install pymupdf", file=sys.stderr)
    sys.exit(1)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        return 2

    pdf_path = Path(sys.argv[1]).expanduser().resolve()
    dpi = int(sys.argv[2]) if len(sys.argv) > 2 else 110

    if not pdf_path.is_file():
        print(f"[verify-pdf] not found: {pdf_path}", file=sys.stderr)
        return 1

    doc = fitz.open(pdf_path)
    n = len(doc)
    print(f"PDF: {pdf_path}")
    print(f"Pages: {n}")
    print(f"PNG previews → /tmp/htmlpdf_p1.png .. /tmp/htmlpdf_p{n}.png  (dpi={dpi})")
    print()

    warnings: list[str] = []

    for i, page in enumerate(doc):
        png = Path(f"/tmp/htmlpdf_p{i + 1}.png")
        page.get_pixmap(dpi=dpi).save(str(png))

        text = page.get_text()
        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        first = lines[0] if lines else "(empty)"
        last = lines[-1] if lines else "(empty)"
        size = page.rect

        print(
            f"  Page {i + 1}: {len(lines):3d} lines  "
            f"({size.width:.0f}×{size.height:.0f} pt)"
        )
        print(f"    first: {first[:90]}")
        if len(lines) > 1:
            print(f"    last:  {last[:90]}")

        if len(lines) <= 3:
            warnings.append(
                f"Page {i + 1} has only {len(lines)} lines — likely an orphan-footer page. "
                f"Hide .foot in @media print."
            )
        if len(lines) > 120:
            warnings.append(
                f"Page {i + 1} has {len(lines)} lines — may be cramming. "
                f"Check for clipped content visually."
            )

    doc.close()

    if warnings:
        print()
        print("Heuristic warnings:")
        for w in warnings:
            print(f"  ⚠ {w}")
        return 0  # warnings are not failures

    print()
    print("No heuristic problems detected. Still read at least one PNG visually.")
    return 0


if __name__ == "__main__":
    sys.exit(main())