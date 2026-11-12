#!/bin/bash
cd "$(dirname "$0")"; n=0; start=$(date +%s)
for f in 2024/*.pdf 2025/*.pdf 2026/*.pdf; do
  t="${f%.pdf}.txt"
  [ -s "$t" ] && [ $(wc -c < "$t") -gt 500 ] && continue
  [ $(( $(date +%s) - start )) -gt 140 ] && { echo "TIME; stopping"; exit 0; }
  tmp=$(mktemp -d /tmp/ocr.XXXX); pdftoppm -r 250 -gray "$f" "$tmp/p"; : > "$t.part"
  for img in "$tmp"/p-*.pgm; do tesseract "$img" - 2>/dev/null >> "$t.part"; printf "\n----- page -----\n" >> "$t.part"; done
  mv "$t.part" "$t"; rm -rf "$tmp"; n=$((n+1)); echo "done $f $(wc -w < "$t")"
done
echo "remaining: $(for f in 2024/*.pdf 2025/*.pdf 2026/*.pdf; do t=${f%.pdf}.txt; [ -s "$t" ] && [ $(wc -c < "$t") -gt 500 ] || echo x; done | wc -l)"
