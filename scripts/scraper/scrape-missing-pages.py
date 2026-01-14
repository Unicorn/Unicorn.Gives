#!/usr/bin/env python3
"""
Scrape the missing pages identified by the link audit.
Focuses on high-priority pages first.
"""

import json
import os
import re
import time
from datetime import datetime
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import requests

WAYBACK_BASE = "https://web.archive.org/web/20251102121853/"
SITE_BASE = "https://www.lincolntwp.com/"


def load_missing_pages():
    """Load the list of missing pages."""
    with open('scripts/scraper/missing-pages.json', 'r') as f:
        return json.load(f)


def clean_content(soup):
    """Remove navigation, header, footer from the page."""
    # Remove common navigation elements
    for element in soup.find_all(['nav', 'header', 'footer']):
        element.decompose()

    # Remove script and style tags
    for element in soup.find_all(['script', 'style']):
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

    # Try to find main content area
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
    markdown = md(
        html,
        heading_style="ATX",
        bullets="-",
        strip=['script', 'style']
    )

    # Clean up excessive whitespace
    markdown = re.sub(r'\n\n\n+', '\n\n', markdown)
    markdown = markdown.strip()

    return markdown


def generate_frontmatter(title, description, order):
    """Generate YAML frontmatter."""
    frontmatter = f'''---
title: "{title}"
description: "{description}"
lastUpdated: "{datetime.now().strftime('%Y-%m-%d')}"
order: {order}
---

'''
    return frontmatter


def scrape_page(page_info, retry=0):
    """Scrape a single page."""
    url = page_info['url']
    source = page_info['source']
    priority = page_info['priority']

    # Generate slug from URL
    slug = url.strip('/').replace('_', '-')
    if not slug:
        slug = 'index'

    wayback_url = WAYBACK_BASE + SITE_BASE + source

    print(f"\n[{priority}] Scraping: {url}")
    print(f"  From: {wayback_url}")

    try:
        response = requests.get(wayback_url, timeout=20)
        response.raise_for_status()

        # Extract main content
        main_html = extract_main_content(response.text)

        # Convert to markdown
        markdown_content = html_to_markdown(main_html)

        # Extract title from content or use default
        title_match = re.search(r'#\s+(.+)', markdown_content)
        if title_match:
            title = title_match.group(1).strip()
        else:
            title = url.strip('/').replace('-', ' ').title()

        # Generate frontmatter
        frontmatter = generate_frontmatter(title, '', page_info['references'] * 10)

        # Combine
        full_content = frontmatter + markdown_content

        # Save file
        filename = f"{slug}.md"
        filepath = os.path.join('src/content/pages', filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_content)

        print(f"  ✓ Saved: {filepath}")
        return True

    except requests.exceptions.RequestException as e:
        print(f"  ✗ Error: {e}")

        # Retry with exponential backoff
        if retry < 3:
            wait_time = (retry + 1) * 5
            print(f"  ⏳ Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
            return scrape_page(page_info, retry + 1)

        return False

    except Exception as e:
        print(f"  ✗ Unexpected error: {e}")
        return False


def scrape_all_missing_pages():
    """Scrape all missing pages."""
    pages = load_missing_pages()

    print("=" * 70)
    print("SCRAPING MISSING PAGES")
    print("=" * 70)
    print(f"\nTotal pages to scrape: {len(pages)}")

    successful = 0
    failed = 0

    for page in pages:
        result = scrape_page(page)

        if result:
            successful += 1
        else:
            failed += 1

        # Be respectful - wait between requests
        time.sleep(3)

    print("\n" + "=" * 70)
    print("SCRAPING COMPLETE")
    print("=" * 70)
    print(f"\n✓ Successful: {successful}")
    print(f"✗ Failed: {failed}")
    print(f"\nTotal scraped: {successful}/{len(pages)}")


if __name__ == '__main__':
    scrape_all_missing_pages()
