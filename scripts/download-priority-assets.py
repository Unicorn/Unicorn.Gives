#!/usr/bin/env python3
"""
Download priority PDF assets from Wayback Machine.
Focuses on the most important documents first.
"""

import os
import re
import time
from pathlib import Path
import requests

WAYBACK_BASE = "https://web.archive.org/web/20251102121853/"
SITE_BASE = "https://www.lincolntwp.com/"

# Alternate Wayback snapshots
ALTERNATE_SNAPSHOTS = [
    "https://web.archive.org/web/20211102121619/",
    "https://web.archive.org/web/20201102000000/",
]


def extract_pdf_references():
    """Extract all PDF references from markdown files."""
    content_dir = Path('src/content/pages')
    pdf_refs = set()

    for md_file in content_dir.glob('*.md'):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
        matches = re.findall(r'\(([^)]+\.pdf)\)', content)
        for match in matches:
            match = match.lstrip('/')
            pdf_refs.add(match)

    return sorted(pdf_refs)


def download_asset(asset_path, retry=0):
    """Download a single asset from Wayback Machine."""
    if retry == 0:
        wayback_base = WAYBACK_BASE
    elif retry <= len(ALTERNATE_SNAPSHOTS):
        wayback_base = ALTERNATE_SNAPSHOTS[retry - 1]
    else:
        return False

    wayback_url = wayback_base + SITE_BASE + asset_path
    local_path = Path('public') / asset_path

    if local_path.exists():
        return True

    try:
        response = requests.get(wayback_url, timeout=30, stream=True)
        response.raise_for_status()

        content_type = response.headers.get('content-type', '')
        if 'text/html' in content_type and 'application/pdf' not in content_type:
            return False

        local_path.parent.mkdir(parents=True, exist_ok=True)

        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        file_size = local_path.stat().st_size
        if file_size < 1000:
            local_path.unlink()
            return False

        print(f"  ✓ {asset_path} ({file_size:,} bytes)")
        return True

    except Exception as e:
        if retry < len(ALTERNATE_SNAPSHOTS):
            time.sleep(1)
            return download_asset(asset_path, retry + 1)
        return False


def prioritize_pdfs(pdf_refs):
    """Prioritize PDFs by importance."""
    priority = {
        'forms': 1,  # Permit forms - critical
        'ordinances': 2,  # Legal documents - important
        'docs': 3,  # Various documents - useful
        'archive': 4,  # Meeting minutes - archival
    }

    categorized = {}
    for ref in pdf_refs:
        category = ref.split('/')[0] if '/' in ref else 'root'
        if category not in categorized:
            categorized[category] = []
        categorized[category].append(ref)

    sorted_refs = []
    for cat in sorted(categorized.keys(), key=lambda x: priority.get(x, 999)):
        sorted_refs.extend(categorized[cat])

    return sorted_refs


def main():
    """Main download workflow."""
    print("\n" + "=" * 70)
    print("DOWNLOADING PRIORITY PDF ASSETS")
    print("=" * 70 + "\n")

    pdf_refs = extract_pdf_references()
    print(f"Found {len(pdf_refs)} unique PDF references\n")

    # Categorize
    categories = {}
    for ref in pdf_refs:
        category = ref.split('/')[0] if '/' in ref else 'root'
        categories[category] = categories.get(category, 0) + 1

    print("By category:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count} files")
    print()

    # Prioritize
    sorted_refs = prioritize_pdfs(pdf_refs)

    print("Download order:")
    print("  1. Forms (permit applications)")
    print("  2. Ordinances (legal documents)")
    print("  3. Docs (plat maps, lake docs, zoning docs)")
    print("  4. Archive (meeting minutes)\n")

    successful = 0
    failed = 0
    failed_assets = []

    for i, asset_path in enumerate(sorted_refs, 1):
        category = asset_path.split('/')[0]
        print(f"[{i}/{len(sorted_refs)}] [{category}] ", end='')

        result = download_asset(asset_path)

        if result:
            successful += 1
        else:
            print(f"  ✗ {asset_path}")
            failed += 1
            failed_assets.append(asset_path)

        time.sleep(1)  # Be respectful

    print("\n" + "=" * 70)
    print("DOWNLOAD SUMMARY")
    print("=" * 70)
    print(f"\n✓ Successfully downloaded: {successful}")
    print(f"✗ Failed to download: {failed}")
    print(f"\n📊 Total processed: {len(pdf_refs)}")

    if failed > 0:
        print(f"\nFailed downloads:")
        for asset in failed_assets[:10]:
            print(f"  - {asset}")
        if len(failed_assets) > 10:
            print(f"  ... and {len(failed_assets) - 10} more")


if __name__ == '__main__':
    main()
