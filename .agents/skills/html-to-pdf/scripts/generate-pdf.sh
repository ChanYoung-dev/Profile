#!/usr/bin/env bash
#
# generate-pdf.sh — Render a local HTML file to PDF via headless Chrome.
#
# Usage:  generate-pdf.sh <html-path-relative-to-project-root> <output-pdf-abs-path> [port]
# Example: generate-pdf.sh resume-magazine.html docs/resume_magazine.pdf 8765
#
# The script:
#   1. cd's to the html file's directory so relative <img>/<link> paths resolve
#   2. starts python3 http.server on the chosen port
#   3. invokes Chrome headless with all the safe flags (no header/footer, virtual time budget for fonts, no margins)
#   4. tears the server down even on failure
#
# Requires: Chrome installed at the standard macOS path, python3 in PATH.

set -euo pipefail

HTML_PATH="${1:?usage: generate-pdf.sh <html-path> <output-pdf-abs> [port]}"
OUT_PDF="${2:?usage: generate-pdf.sh <html-path> <output-pdf-abs> [port]}"
PORT="${3:-8765}"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ ! -x "$CHROME" ]]; then
  # Fall back to other Chromium-family browsers
  for alt in \
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
      "/Applications/Chromium.app/Contents/MacOS/Chromium"; do
    if [[ -x "$alt" ]]; then CHROME="$alt"; break; fi
  done
fi
if [[ ! -x "$CHROME" ]]; then
  echo "[generate-pdf] no Chromium-family browser found" >&2
  exit 1
fi

# Resolve absolute paths
HTML_ABS="$(cd "$(dirname "$HTML_PATH")" && pwd)/$(basename "$HTML_PATH")"
if [[ ! -f "$HTML_ABS" ]]; then
  echo "[generate-pdf] html not found: $HTML_ABS" >&2
  exit 1
fi

# Output dir must exist
OUT_DIR="$(dirname "$OUT_PDF")"
mkdir -p "$OUT_DIR"
# Convert OUT_PDF to absolute
OUT_PDF_ABS="$(cd "$OUT_DIR" && pwd)/$(basename "$OUT_PDF")"

# Serve from the html file's parent so relative asset paths work
SERVE_DIR="$(dirname "$HTML_ABS")"
HTML_FILE="$(basename "$HTML_ABS")"

PID_FILE="/tmp/htmlpdf-$PORT.pid"
LOG_FILE="/tmp/htmlpdf-$PORT.log"

cleanup() {
  if [[ -f "$PID_FILE" ]]; then
    kill "$(cat "$PID_FILE")" 2>/dev/null || true
    rm -f "$PID_FILE"
  fi
}
trap cleanup EXIT

# Kill any leftover server on this port
if lsof -ti :"$PORT" > /dev/null 2>&1; then
  echo "[generate-pdf] port $PORT busy, killing previous server" >&2
  lsof -ti :"$PORT" | xargs kill 2>/dev/null || true
  sleep 1
fi

(cd "$SERVE_DIR" && python3 -m http.server "$PORT" --bind 127.0.0.1 > "$LOG_FILE" 2>&1) &
echo $! > "$PID_FILE"
sleep 1

URL="http://127.0.0.1:$PORT/$HTML_FILE"

# Sanity check
if ! curl -fsS -o /dev/null "$URL"; then
  echo "[generate-pdf] server did not return 200 for $URL" >&2
  cat "$LOG_FILE" >&2
  exit 1
fi

echo "[generate-pdf] rendering $URL → $OUT_PDF_ABS"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --no-margins \
  --virtual-time-budget=10000 \
  --print-to-pdf-no-header \
  --print-to-pdf="$OUT_PDF_ABS" \
  "$URL" 2>&1 | tail -3

if [[ ! -s "$OUT_PDF_ABS" ]]; then
  echo "[generate-pdf] PDF was not produced" >&2
  exit 1
fi

SIZE=$(stat -f%z "$OUT_PDF_ABS")
echo "[generate-pdf] OK — $OUT_PDF_ABS ($SIZE bytes)"