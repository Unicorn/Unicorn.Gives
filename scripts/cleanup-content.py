#!/usr/bin/env python3
"""
Clean up scraped content:
- Rename files to have cleaner slugs
- Replace Wayback Machine URLs with local links
- Update frontmatter
"""

import os
import re
from pathlib import Path

CONTENT_DIR = "src/content/pages"

# Slug mapping - old filename to new filename
SLUG_MAPPING = {
    "www-lincolntwp-com-bd-minutes.md": "board-minutes.md",
    "www-lincolntwp-com-building.md": "building.md",
    "www-lincolntwp-com-calendar.md": "calendar.md",
    "www-lincolntwp-com-cemeteries.md": "cemeteries.md",
    "www-lincolntwp-com-compost-field.md": "compost.md",
    "www-lincolntwp-com-elections.md": "elections.md",
    "www-lincolntwp-com-fire.md": "fire.md",
    "www-lincolntwp-com-foia.md": "foia.md",
    "www-lincolntwp-com-newsletters.md": "newsletters.md",
    "www-lincolntwp-com-ordinances.md": "ordinances.md",
    "www-lincolntwp-com-plat-maps.md": "plat-maps.md",
    "www-lincolntwp-com-zoning.md": "zoning.md",
    "archive-minutes.md": "minutes-archive.md",
}

# URL replacements
def clean_urls(content):
    """Replace Wayback Machine URLs with local or external links."""

    # First, clean up malformed Wayback URLs in PDF links
    # Pattern: (/web/20211102121619/http://www.lincolntwp.com/forms/file.pdf)
    # Should be: (/forms/file.pdf)
    content = re.sub(
        r'\(/web/\d+/https?://(?:www\.)?lincolntwp\.com/',
        r'(',
        content
    )

    # Also fix broken patterns like (http://www.lincolntwp.com/file.pdf)
    content = re.sub(
        r'\(https?://(?:www\.)?lincolntwp\.com/',
        r'(',
        content
    )

    # Replace archive.org URLs with local page links
    url_mapping = {
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/board\.htm': '/board',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/building\.htm': '/building',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/bd_minutes\.htm': '/board-minutes',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/calendar\.htm': '/calendar',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/cemeteries\.htm': '/cemeteries',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/compost_field\.htm': '/compost',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/elections\.htm': '/elections',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/fire\.htm': '/fire',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/foia\.htm': '/foia',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/newsletters\.htm': '/newsletters',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/ordinances\.htm': '/ordinances',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/plat_maps\.htm': '/plat-maps',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/zoning\.htm': '/zoning',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/(?:index\.html?)?': '/',
        r'https://web\.archive\.org/web/\d+/https?://(?:www\.)?lincolntwp\.com/archive_minutes\.htm': '/minutes-archive',

        # Remove other wayback URLs (external links)
        r'https://web\.archive\.org/web/\d+/': '',
    }

    for pattern, replacement in url_mapping.items():
        content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)

    # Also fix relative .htm links and underscore variants
    htm_links = {
        '/board.htm': '/board',
        '/building.htm': '/building',
        '/bd_minutes.htm': '/board-minutes',
        '/bd_minutes': '/board-minutes',
        '/calendar.htm': '/calendar',
        '/cemeteries.htm': '/cemeteries',
        '/compost_field.htm': '/compost',
        '/compost_field': '/compost',
        '/elections.htm': '/elections',
        '/fire.htm': '/fire',
        '/foia.htm': '/foia',
        '/newsletters.htm': '/newsletters',
        '/ordinances.htm': '/ordinances',
        '/plat_maps.htm': '/plat-maps',
        '/plat_maps': '/plat-maps',
        '/zoning.htm': '/zoning',
        '/faq.htm': '/faq',
        '/assessor.htm': '/assessor',
        '/links.htm': '/links',
        '/seniors.htm': '/seniors',
        '/parks.htm': '/parks',
        '/planning_commission.htm': '/planning-commission',
        '/planning_commission': '/planning-commission',
        '/permits_forms.htm': '/permits-forms',
        '/permits_forms': '/permits-forms',
        '/zba.htm': '/zba',
        '/lakes.htm': '/lakes',
        '/lakes_lakegeorge.htm': '/lakes-lakegeorge',
        '/lakes_shingle.htm': '/lakes-shingle',
        '/lakes_bertha.htm': '/lakes-bertha',
        '/lakes_silver.htm': '/lakes-silver',
        '/archive_minutes.htm': '/minutes-archive',
        '/archive_minutes': '/minutes-archive',
        '/subscribe.htm': '/subscribe',
        '/subscribe': '/subscribe',
        '/zba-plancomm_minutes.htm': '/zba-plancomm-minutes',
        '/zba-plancomm_minutes': '/zba-plancomm-minutes',
        '/ordinances/zoning_ord_creation.htm': '/ordinances-zoning-ord-creation',
        'board.htm': '/board',
        'building.htm': '/building',
        'bd_minutes.htm': '/board-minutes',
        'calendar.htm': '/calendar',
        'cemeteries.htm': '/cemeteries',
        'compost_field.htm': '/compost',
        'elections.htm': '/elections',
        'faq.htm': '/faq',
        'fire.htm': '/fire',
        'foia.htm': '/foia',
        'links.htm': '/links',
        'newsletters.htm': '/newsletters',
        'ordinances.htm': '/ordinances',
        'parks.htm': '/parks',
        'permits_forms.htm': '/permits-forms',
        'planning_commission.htm': '/planning-commission',
        'plat_maps.htm': '/plat-maps',
        'seniors.htm': '/seniors',
        'zba.htm': '/zba',
        'lakes_lakegeorge.htm': '/lakes-lakegeorge',
        'lakes_shingle.htm': '/lakes-shingle',
        'lakes_bertha.htm': '/lakes-bertha',
        'lakes_silver.htm': '/lakes-silver',
        'zba-plancomm_minutes.htm': '/zba-plancomm-minutes',
    }

    for old_link, new_link in htm_links.items():
        content = content.replace(old_link, new_link)

    return content


def remove_navigation_tables(content):
    """Remove the navigation tables that were part of the old site."""
    # Remove markdown tables at the beginning (navigation menus)
    lines = content.split('\n')

    # Skip frontmatter
    in_frontmatter = False
    frontmatter_end = 0
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if not in_frontmatter:
                in_frontmatter = True
            else:
                frontmatter_end = i + 1
                break

    # Find where actual content starts (after nav tables)
    content_start = frontmatter_end
    for i in range(frontmatter_end, len(lines)):
        line = lines[i].strip()
        # Skip empty lines and table formatting
        if not line or line.startswith('|') or line.startswith('-'):
            continue
        # Found actual content
        content_start = i
        break

    return '\n'.join(lines[:frontmatter_end] + lines[content_start:])


def clean_file(filepath):
    """Clean up a single markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean URLs
    content = clean_urls(content)

    # Remove navigation tables
    content = remove_navigation_tables(content)

    # Clean up excessive whitespace
    content = re.sub(r'\n\n\n+', '\n\n', content)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  Cleaned: {filepath.name}")


def rename_files():
    """Rename files to have cleaner slugs."""
    content_path = Path(CONTENT_DIR)

    print("Renaming files...")
    for old_name, new_name in SLUG_MAPPING.items():
        old_path = content_path / old_name
        new_path = content_path / new_name

        if old_path.exists():
            old_path.rename(new_path)
            print(f"  Renamed: {old_name} -> {new_name}")


def process_all_files():
    """Process all markdown files in the content directory."""
    content_path = Path(CONTENT_DIR)
    md_files = list(content_path.glob('*.md'))

    print(f"\nCleaning {len(md_files)} files...")
    for filepath in md_files:
        if filepath.name != 'index.md':  # Skip the homepage
            clean_file(filepath)


if __name__ == '__main__':
    print("Starting content cleanup...")
    print("=" * 60)

    # First rename files
    rename_files()

    # Then clean content
    process_all_files()

    print("\n" + "=" * 60)
    print("✓ Content cleanup complete!")
    print("\nNext steps:")
    print("  1. Review cleaned files in src/content/pages/")
    print("  2. Run: npm run build")
    print("  3. Test the site")
