#!/usr/bin/env python3
"""
Download assets (images, PDFs, documents) from Wayback Machine.
Scans all markdown files for asset URLs and downloads them.
"""

import json
import os
import re
import time
from urllib.parse import urljoin, urlparse
from pathlib import Path
import requests


WAYBACK_BASE = "https://web.archive.org/web/20251102121853/"
SITE_BASE = "https://www.lincolntwp.com/"
WAYBACK_SITE = WAYBACK_BASE + SITE_BASE

# Track downloaded assets
asset_manifest = {
    'images': [],
    'documents': [],
    'other': []
}


def get_asset_type(url):
    """Determine asset type from URL."""
    ext = Path(url).suffix.lower()

    image_exts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico']
    doc_exts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt']

    if ext in image_exts:
        return 'images'
    elif ext in doc_exts:
        return 'documents'
    else:
        return 'other'


def extract_assets_from_markdown(filepath):
    """Extract asset URLs from markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    assets = []

    # Find markdown images: ![alt](url)
    markdown_images = re.findall(r'!\[.*?\]\((.*?)\)', content)
    assets.extend(markdown_images)

    # Find HTML img tags: <img src="url">
    html_images = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    assets.extend(html_images)

    # Find links to documents: [text](url.pdf)
    doc_links = re.findall(r'\[.*?\]\((.*?\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx))\)', content, re.IGNORECASE)
    assets.extend(doc_links)

    # Find HTML links to documents
    html_doc_links = re.findall(r'<a[^>]+href=["\']([^"\']+\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx))["\']', content, re.IGNORECASE)
    assets.extend(html_doc_links)

    return assets


def normalize_asset_url(url):
    """Normalize and convert asset URL to wayback URL."""
    # If it's already a full wayback URL, return it
    if 'web.archive.org' in url:
        return url

    # If it's a relative URL, make it absolute
    if not url.startswith('http'):
        url = urljoin(SITE_BASE, url)

    # Add wayback prefix
    wayback_url = WAYBACK_BASE + url

    return wayback_url


def download_asset(wayback_url, original_url):
    """Download an asset from Wayback Machine."""
    asset_type = get_asset_type(original_url)

    # Determine save directory
    base_dir = f"public/assets/{asset_type}"
    os.makedirs(base_dir, exist_ok=True)

    # Generate filename from URL
    parsed = urlparse(original_url)
    filename = os.path.basename(parsed.path)

    # Handle empty filename
    if not filename:
        filename = 'asset_' + str(hash(original_url))[:8]

    filepath = os.path.join(base_dir, filename)

    # Skip if already downloaded
    if os.path.exists(filepath):
        print(f"  Skipped (exists): {filename}")
        return filepath

    try:
        print(f"  Downloading: {filename}")
        response = requests.get(wayback_url, timeout=30, stream=True)
        response.raise_for_status()

        # Save file
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        # Record in manifest
        asset_manifest[asset_type].append({
            'original_url': original_url,
            'wayback_url': wayback_url,
            'local_path': filepath,
            'filename': filename
        })

        return filepath

    except Exception as e:
        print(f"  Error downloading {filename}: {e}")
        return None


def update_markdown_urls(filepath, url_mapping):
    """Update asset URLs in markdown file to point to local assets."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace URLs
    for old_url, new_url in url_mapping.items():
        content = content.replace(old_url, new_url)

    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  Updated URLs in: {filepath}")


def process_all_assets():
    """Process and download all assets from markdown files."""
    content_dir = 'src/content/pages'

    if not os.path.exists(content_dir):
        print(f"Error: {content_dir} does not exist!")
        print("Please run scrape-wayback.py first.")
        return

    # Get all markdown files
    markdown_files = list(Path(content_dir).glob('*.md'))

    print(f"Found {len(markdown_files)} markdown files")
    print("=" * 60)

    all_assets = set()

    # Extract all asset URLs
    print("\nExtracting asset URLs from markdown files...")
    for md_file in markdown_files:
        assets = extract_assets_from_markdown(md_file)
        all_assets.update(assets)

    print(f"Found {len(all_assets)} unique assets")
    print("\nDownloading assets...")
    print("=" * 60)

    # Download assets
    url_mapping = {}
    successful = 0
    failed = 0

    for asset_url in all_assets:
        wayback_url = normalize_asset_url(asset_url)
        local_path = download_asset(wayback_url, asset_url)

        if local_path:
            # Create new URL for markdown (relative to public/)
            new_url = '/' + local_path.replace('public/', '')
            url_mapping[asset_url] = new_url
            successful += 1
        else:
            failed += 1

        # Be respectful - add delay
        time.sleep(1)

    print("\n" + "=" * 60)
    print(f"Asset download complete!")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")

    # Update markdown files with new URLs
    if url_mapping:
        print("\nUpdating markdown files with local asset URLs...")
        for md_file in markdown_files:
            update_markdown_urls(md_file, url_mapping)

    # Save manifest
    save_asset_manifest()


def save_asset_manifest():
    """Save asset manifest to JSON."""
    manifest_path = 'scripts/scraper/asset-manifest.json'

    output = {
        'total_images': len(asset_manifest['images']),
        'total_documents': len(asset_manifest['documents']),
        'total_other': len(asset_manifest['other']),
        'assets': asset_manifest
    }

    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nAsset manifest saved to {manifest_path}")


if __name__ == '__main__':
    print("Starting asset download...")
    print("=" * 60)

    try:
        process_all_assets()
        print("\n✓ Asset download complete!")
    except Exception as e:
        print(f"\n✗ Error: {e}")
