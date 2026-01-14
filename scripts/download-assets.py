#!/usr/bin/env python3
"""
Download all PDF and document assets from Wayback Machine.
"""

import os
import re
import time
from pathlib import Path
from urllib.parse import urljoin
import requests

WAYBACK_BASE = "https://web.archive.org/web/20251102121853/"
SITE_BASE = "https://www.lincolntwp.com/"

# Alternate Wayback snapshots to try if primary fails
ALTERNATE_SNAPSHOTS = [
    "https://web.archive.org/web/20211102121619/",
    "https://web.archive.org/web/20201102000000/",
    "https://web.archive.org/web/20190102000000/",
    "https://web.archive.org/web/20150918065825/",
]


def extract_pdf_references():
    """Extract all PDF and document references from markdown files."""
    content_dir = Path('src/content/pages')
    pdf_refs = set()

    for md_file in content_dir.glob('*.md'):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all PDF references
        # Pattern 1: (docs/path/file.pdf) or (/docs/path/file.pdf)
        matches = re.findall(r'\(/?([^)]+\.pdf)\)', content)
        for match in matches:
            # Clean up any wayback URLs
            match = re.sub(r'^/web/\d+/https?://(?:www\.)?lincolntwp\.com/', '', match)
            match = match.lstrip('/')
            pdf_refs.add(match)

    return sorted(pdf_refs)


def download_asset(asset_path, retry=0):
    """Download a single asset from Wayback Machine."""
    # Determine which wayback snapshot to use
    if retry == 0:
        wayback_base = WAYBACK_BASE
    elif retry <= len(ALTERNATE_SNAPSHOTS):
        wayback_base = ALTERNATE_SNAPSHOTS[retry - 1]
    else:
        return False

    # Build full URL
    wayback_url = wayback_base + SITE_BASE + asset_path

    # Determine local path
    local_path = Path('public') / asset_path

    # Skip if already exists
    if local_path.exists():
        print(f"  ✓ Already exists: {asset_path}")
        return True

    print(f"  Downloading: {asset_path}")
    print(f"    From: {wayback_url}")

    try:
        response = requests.get(wayback_url, timeout=30, stream=True)
        response.raise_for_status()

        # Check if we got actual content (not an error page)
        content_type = response.headers.get('content-type', '')
        if 'text/html' in content_type and 'application/pdf' not in content_type:
            print(f"    ✗ Got HTML instead of PDF (probably doesn't exist)")
            return False

        # Create directory if needed
        local_path.parent.mkdir(parents=True, exist_ok=True)

        # Write file
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        file_size = local_path.stat().st_size
        if file_size < 1000:  # Suspiciously small
            print(f"    ✗ File too small ({file_size} bytes), probably error page")
            local_path.unlink()
            return False

        print(f"    ✓ Saved: {local_path} ({file_size:,} bytes)")
        return True

    except Exception as e:
        print(f"    ✗ Error: {e}")

        # Retry with alternate snapshot
        if retry < len(ALTERNATE_SNAPSHOTS):
            print(f"    ⏳ Retrying with alternate snapshot...")
            time.sleep(2)
            return download_asset(asset_path, retry + 1)

        return False


def create_placeholder(asset_path):
    """Create a placeholder text file for missing assets."""
    local_path = Path('public') / asset_path

    # Create directory if needed
    local_path.parent.mkdir(parents=True, exist_ok=True)

    # Create placeholder
    placeholder_path = local_path.with_suffix('.txt')
    with open(placeholder_path, 'w') as f:
        f.write(f"This document ({asset_path}) was part of the original Lincoln Township website ")
        f.write(f"but could not be recovered from the Wayback Machine archive.\n\n")
        f.write(f"For more information, please contact Lincoln Township directly.\n")

    print(f"  📝 Created placeholder: {placeholder_path}")


def main():
    """Main download workflow."""
    print("\n" + "=" * 70)
    print("DOWNLOADING ALL PDF AND DOCUMENT ASSETS")
    print("=" * 70 + "\n")

    # Extract all PDF references
    print("Scanning markdown files for PDF references...")
    pdf_refs = extract_pdf_references()
    print(f"Found {len(pdf_refs)} unique PDF references\n")

    # Group by category
    categories = {}
    for ref in pdf_refs:
        category = ref.split('/')[0] if '/' in ref else 'root'
        if category not in categories:
            categories[category] = []
        categories[category].append(ref)

    print("PDF references by category:")
    for category, refs in sorted(categories.items()):
        print(f"  {category}: {len(refs)} files")
    print()

    # Download all assets
    successful = 0
    failed = 0
    failed_assets = []

    for i, asset_path in enumerate(pdf_refs, 1):
        print(f"\n[{i}/{len(pdf_refs)}]")
        result = download_asset(asset_path)

        if result:
            successful += 1
        else:
            failed += 1
            failed_assets.append(asset_path)

        # Be respectful - wait between requests
        time.sleep(2)

    # Create placeholders for failed downloads
    if failed_assets:
        print("\n" + "=" * 70)
        print(f"CREATING PLACEHOLDERS FOR {len(failed_assets)} MISSING ASSETS")
        print("=" * 70 + "\n")

        for asset_path in failed_assets:
            create_placeholder(asset_path)

    # Final summary
    print("\n" + "=" * 70)
    print("DOWNLOAD SUMMARY")
    print("=" * 70)
    print(f"\n✓ Successfully downloaded: {successful}")
    print(f"✗ Failed to download: {failed}")
    print(f"📝 Placeholders created: {len(failed_assets)}")
    print(f"\n📊 Total assets processed: {len(pdf_refs)}")

    if successful > 0:
        print(f"\n✓ Assets saved to: public/")
        print("\nNext steps:")
        print("  1. Review downloaded files in public/")
        print("  2. Run: npm run build")
        print("  3. Test asset links on the site")


if __name__ == '__main__':
    main()
