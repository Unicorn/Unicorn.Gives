#!/usr/bin/env python3
"""
Audit all links in the markdown files to identify:
- Working internal links
- Broken internal links (missing pages)
- External links
- Links to PDFs/forms
"""

import re
import json
from pathlib import Path
from collections import defaultdict

CONTENT_DIR = "src/content/pages"

# Pages we currently have
EXISTING_PAGES = set()

# Track all link references
internal_links = defaultdict(list)  # url -> [files that reference it]
external_links = defaultdict(list)
missing_pages = defaultdict(list)
pdf_links = defaultdict(list)


def get_existing_pages():
    """Get all existing page slugs."""
    content_path = Path(CONTENT_DIR)
    for md_file in content_path.glob('*.md'):
        # Extract slug from filename
        slug = md_file.stem
        if slug != 'index':
            EXISTING_PAGES.add(f'/{slug}')
        else:
            EXISTING_PAGES.add('/')


def extract_links(content, filename):
    """Extract all links from markdown content."""
    # Find markdown links: [text](url)
    markdown_links = re.findall(r'\[([^\]]+)\]\(([^\)]+)\)', content)

    for text, url in markdown_links:
        # Skip anchors and empty links
        if not url or url.startswith('#'):
            continue

        # Categorize links
        if url.startswith('http://') or url.startswith('https://'):
            external_links[url].append(filename)
        elif url.endswith('.pdf') or '/forms/' in url:
            pdf_links[url].append(filename)
        elif url.startswith('/'):
            # Internal link
            # Remove anchor if present
            clean_url = url.split('#')[0]
            if clean_url:
                if clean_url in EXISTING_PAGES or clean_url == '/':
                    internal_links[clean_url].append(filename)
                else:
                    missing_pages[clean_url].append(filename)
        elif url.endswith('.htm'):
            # Relative link to .htm page
            clean_url = '/' + url.replace('.htm', '').replace('.html', '')
            if clean_url in EXISTING_PAGES:
                internal_links[clean_url].append(filename)
            else:
                missing_pages[clean_url].append(filename)


def audit_all_files():
    """Audit all markdown files."""
    content_path = Path(CONTENT_DIR)

    for md_file in content_path.glob('*.md'):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        extract_links(content, md_file.name)


def print_report():
    """Print a comprehensive audit report."""
    print("\n" + "=" * 70)
    print("LINK AUDIT REPORT")
    print("=" * 70)

    print(f"\n📄 Existing Pages: {len(EXISTING_PAGES)}")
    for page in sorted(EXISTING_PAGES):
        print(f"  ✓ {page}")

    print(f"\n🔗 Working Internal Links: {len(internal_links)}")
    for url, files in sorted(internal_links.items()):
        print(f"  ✓ {url} (referenced in {len(files)} files)")

    print(f"\n❌ Missing Pages: {len(missing_pages)}")
    print("\nThese pages are linked to but don't exist:")
    missing_sorted = sorted(missing_pages.items(), key=lambda x: len(x[1]), reverse=True)

    for url, files in missing_sorted:
        print(f"\n  ❌ {url}")
        print(f"     Referenced by: {', '.join(files[:5])}")
        if len(files) > 5:
            print(f"     ... and {len(files) - 5} more files")

    print(f"\n📎 PDF/Form Links: {len(pdf_links)}")
    for url, files in sorted(pdf_links.items()):
        print(f"  📎 {url} (in {len(files)} files)")

    print(f"\n🌐 External Links: {len(external_links)}")
    # Just show unique domains
    domains = defaultdict(int)
    for url in external_links.keys():
        domain = re.search(r'https?://([^/]+)', url)
        if domain:
            domains[domain.group(1)] += 1

    for domain, count in sorted(domains.items()):
        print(f"  🌐 {domain} ({count} links)")


def generate_scraping_list():
    """Generate a list of pages that need to be scraped."""
    print("\n" + "=" * 70)
    print("PAGES TO SCRAPE")
    print("=" * 70)

    # Map missing URLs to their original lincolntwp.com URLs
    url_mapping = {
        '/faq': 'faq.htm',
        '/assessor': 'assessor.htm',
        '/board': 'board.htm',
        '/planning-commission': 'planning_commission.htm',
        '/planning_commission': 'planning_commission.htm',
        '/seniors': 'seniors.htm',
        '/permits-forms': 'permits_forms.htm',
        '/permits_forms': 'permits_forms.htm',
        '/zba': 'zba.htm',
        '/links': 'links.htm',
        '/lakes': 'lakes.htm',
        '/parks': 'parks.htm',
        '/subscribe': 'subscribe.htm',
    }

    priority_pages = []
    for url, files in missing_sorted:
        if url in url_mapping:
            priority_pages.append({
                'url': url,
                'source': url_mapping[url],
                'references': len(files),
                'priority': 'HIGH' if len(files) >= 5 else 'MEDIUM' if len(files) >= 2 else 'LOW'
            })

    # Sort by number of references
    priority_pages.sort(key=lambda x: x['references'], reverse=True)

    print("\nPriority order (by number of references):\n")
    for i, page in enumerate(priority_pages, 1):
        print(f"{i}. {page['url']:<30} [{page['priority']}]")
        print(f"   Source: https://lincolntwp.com/{page['source']}")
        print(f"   Referenced: {page['references']} times\n")

    # Save to JSON for the scraper
    with open('scripts/scraper/missing-pages.json', 'w') as f:
        json.dump(priority_pages, f, indent=2)

    print(f"\n✓ Saved missing pages list to scripts/scraper/missing-pages.json")


if __name__ == '__main__':
    print("Starting link audit...")

    # Get existing pages
    get_existing_pages()

    # Audit all files
    audit_all_files()

    # Print report
    print_report()

    # Generate scraping list
    missing_sorted = sorted(missing_pages.items(), key=lambda x: len(x[1]), reverse=True)
    generate_scraping_list()

    print("\n" + "=" * 70)
    print("✓ Audit complete!")
    print("=" * 70)
