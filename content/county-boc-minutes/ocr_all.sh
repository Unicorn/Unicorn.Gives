#!/bin/bash
cd "$(dirname "$0")"
for f in 2024/*.pdf 2025/*.pdf 2026/*.pdf; do
  t="${f%.pdf}.txt"
  [ -s "$t" ] && [ $(wc -c < "$t") -gt 500 ] && continue
  tmp=$(mktemp -d /tmp/ocr.XXXX)
  pdftoppm -r 300 -gray "$f" "$tmp/p" 
  : > "$t"
  for img in "$tmp"/p-*.pgm; do tesseract "$img" - 2>/dev/null >> "$t"; echo -e "\n----- page -----\n" >> "$t"; done
  rm -rf "$tmp"
  echo "done $f $(wc -w < "$t")" >> ocr.log
done
echo ALLDONE >> ocr.log
