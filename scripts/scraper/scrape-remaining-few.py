#!/usr/bin/env python3
"""
Scrape the last few remaining pages that might exist in Wayback Machine.
"""

import os
import re
import time
from datetime import datetime
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import requests

WAYBACK_BASE = "https://web.archive.org/web/20251102121853/"
SITE_BASE = "https://www.lincolntwp.com/"


def clean_content(soup):
    """Remove navigation, header, footer from the page."""
    for element in soup.find_all(['nav', 'header', 'footer', 'script', 'style']):
        element.decompose()

    # Remove wayback machine toolbar
    for element in soup.find_all(id=re.compile('wm-')):
        element.decompose()
    for element in soup.find_all(class_=re.compile('wm-')):
        element.decompose()

    return soup


def extract_main_content(html):
    """Extract the main content from the HTML."""
    soup = BeautifulSoup(html, 'html.parser')
    soup = clean_content(soup)

    main_content = (
        soup.find('main') or
        soup.find('article') or
        soup.find(id='content') or
        soup.find(id='main') or
        soup.find(class_='content') or
        soup.find('body')
    )

    if main_content:
        return str(main_content)
    return str(soup)


def html_to_markdown(html):
    """Convert HTML content to Markdown."""
    markdown = md(html, heading_style="ATX", bullets="-", strip=['script', 'style'])
    markdown = re.sub(r'\n\n\n+', '\n\n', markdown)
    return markdown.strip()


def generate_slug(url_path):
    """Generate clean slug from URL path."""
    # Remove .htm/.html extension
    slug = re.sub(r'\.(htm|html)$', '', url_path)
    # Remove leading slash
    slug = slug.lstrip('/')
    # Replace underscores and special chars with hyphens
    slug = re.sub(r'[_/]', '-', slug)
    slug = re.sub(r'[^a-z0-9-]', '-', slug.lower())
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug if slug else 'index'


def generate_frontmatter(title, description="", order=999):
    """Generate YAML frontmatter."""
    title = title.replace('"', '\\"')
    description = description.replace('"', '\\"')

    frontmatter = f'''---
title: "{title}"
description: "{description}"
lastUpdated: "{datetime.now().strftime('%Y-%m-%d')}"
order: {order}
---

'''
    return frontmatter


def scrape_page(url_path, wayback_base=WAYBACK_BASE):
    """Scrape a single page from Wayback Machine."""
    slug = generate_slug(url_path)
    wayback_url = wayback_base + SITE_BASE + url_path.lstrip('/')

    print(f"Scraping: {url_path}")
    print(f"  Slug: {slug}")
    print(f"  URL: {wayback_url}")

    try:
        response = requests.get(wayback_url, timeout=25)
        response.raise_for_status()

        # Check if it's an error page
        if "Error. Page cannot be displayed" in response.text or len(response.text) < 500:
            print(f"  ✗ Error page or empty content")
            return False

        # Extract main content
        main_html = extract_main_content(response.text)
        markdown_content = html_to_markdown(main_html)

        # Extract title
        title_match = re.search(r'#\s+(.+)', markdown_content)
        if title_match:
            title = title_match.group(1).strip()
        else:
            # Generate title from path
            title = slug.replace('-', ' ').title()

        # Generate frontmatter
        frontmatter = generate_frontmatter(title)
        full_content = frontmatter + markdown_content

        # Save file
        filename = f"{slug}.md"
        filepath = os.path.join('src/content/pages', filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_content)

        print(f"  ✓ Saved: {filepath}\n")
        return True

    except Exception as e:
        print(f"  ✗ Error: {e}\n")
        return False


def main():
    """Main scraping workflow."""
    print("\n" + "=" * 70)
    print("SCRAPING REMAINING FEW PAGES")
    print("=" * 70 + "\n")

    # Create content directory if not exists
    os.makedirs('src/content/pages', exist_ok=True)

    # Pages to try
    pages_to_scrape = [
        'subscribe.htm',
        'zba-plancomm_minutes.htm',
        'ordinances/zoning_ord_creation.htm',
    ]

    successful = 0
    failed = 0

    for page in pages_to_scrape:
        result = scrape_page(page)
        if result:
            successful += 1
        else:
            failed += 1
        time.sleep(2)

    # Final summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"\n✓ Successfully scraped: {successful}")
    print(f"✗ Failed to scrape: {failed}")


if __name__ == '__main__':
    main()
