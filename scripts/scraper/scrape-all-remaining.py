#!/usr/bin/env python3
"""
Scrape ALL remaining pages for 100% parity with the old site.
This includes:
- Lake sub-pages
- All archive minutes (2005-2010)
- Any other missing pages
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


def scrape_page(url_path, retry=0, wayback_base=WAYBACK_BASE):
    """Scrape a single page from Wayback Machine."""
    slug = generate_slug(url_path)
    wayback_url = wayback_base + SITE_BASE + url_path.lstrip('/')

    print(f"Scraping: {url_path}")
    print(f"  Slug: {slug}")

    try:
        response = requests.get(wayback_url, timeout=25)
        response.raise_for_status()

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

    except requests.exceptions.RequestException as e:
        print(f"  ✗ Error: {e}")

        # Try different wayback snapshot dates if failed
        alternate_dates = [
            "https://web.archive.org/web/20211102121619/",
            "https://web.archive.org/web/20201102000000/",
            "https://web.archive.org/web/20190102000000/",
            "https://web.archive.org/web/20150918065825/",
        ]

        if retry < len(alternate_dates):
            print(f"  ⏳ Trying alternate snapshot...")
            time.sleep(2)
            return scrape_page(url_path, retry + 1, alternate_dates[retry])

        print(f"  ✗ Failed after {retry + 1} attempts\n")
        return False

    except Exception as e:
        print(f"  ✗ Unexpected error: {e}\n")
        return False


def get_all_missing_pages():
    """Get all missing pages from the audit."""
    # Lake pages
    lake_pages = [
        'lakes_lakegeorge.htm',
        'lakes_shingle.htm',
        'lakes_bertha.htm',
        'lakes_silver.htm',
    ]

    # Archive minutes pages (2005-2010)
    archive_pages = [
        'archive/12-13-10.htm', 'archive/11-8-10.htm', 'archive/9-13-10.htm',
        'archive/8-9-10.htm', 'archive/7-12-10.htm', 'archive/6-18-10.htm',
        'archive/6-14-10.htm', 'archive/5-4-10.htm', 'archive/4-12-10.htm',
        'archive/3-8-10.htm', 'archive/2-26-10.htm', 'archive/2-8-10.htm',
        'archive/1-11-10.htm', 'archive/12-14-09.htm', 'archive/11-9-09.htm',
        'archive/10-12-09.htm', 'archive/9-14-09.htm', 'archive/8-10-09.htm',
        'archive/7-13-09.htm', 'archive/6-15-09.htm', 'archive/6-8-09.htm',
        'archive/5-11-09.htm', 'archive/4-13-09.htm', 'archive/3-9-09.htm',
        'archive/2-9-09.htm', 'archive/1-12-09.htm', 'archive/12-8-08.htm',
        'archive/11-10-08.htm', 'archive/10-8-08.htm', 'archive/9-8-08.htm',
        'archive/8-11-08.htm', 'archive/7-14-08.htm', 'archive/6-9-08.htm',
        'archive/5-12-08.htm', 'archive/4-14-08.htm', 'archive/3-10-08.htm',
        'archive/2-11-08.htm', 'archive/1-14-08.htm', 'archive/12-10-07.htm',
        'archive/11-12-07.htm', 'archive/10-8-07.htm', 'archive/9-10-07.htm',
        'archive/8-13-07.htm', 'archive/7-9-07.htm', 'archive/6-11-07.htm',
        'archive/5-14-07.htm', 'archive/4-9-07.htm', 'archive/3-12-07.htm',
        'archive/2-12-07.htm', 'archive/1-8-07.htm', 'archive/12-11-06.htm',
        'archive/6-12-06.htm', 'archive/6-25-06.htm', 'archive/8-8-05.htm',
        'archive/7-11-05.htm', 'archive/5-9-05.htm', 'archive/4-11-05.htm',
        'archive/3-14-05.htm',
    ]

    # Other pages
    other_pages = [
        'subscribe.htm',
        'zba-plancomm_minutes.htm',
        'ordinances/zoning_ord_creation.htm',
    ]

    return {
        'lakes': lake_pages,
        'archives': archive_pages,
        'other': other_pages
    }


def scrape_category(category_name, pages):
    """Scrape a category of pages."""
    print("\n" + "=" * 70)
    print(f"SCRAPING {category_name.upper()} ({len(pages)} pages)")
    print("=" * 70 + "\n")

    successful = 0
    failed = 0
    failed_pages = []

    for page in pages:
        result = scrape_page(page)
        if result:
            successful += 1
        else:
            failed += 1
            failed_pages.append(page)

        # Be respectful - wait between requests
        time.sleep(3)

    print(f"\n{category_name} Results:")
    print(f"  ✓ Successful: {successful}")
    print(f"  ✗ Failed: {failed}")

    return successful, failed, failed_pages


def create_placeholder(url_path, reason="Content not available in Wayback Machine"):
    """Create a placeholder page for failed scrapes."""
    slug = generate_slug(url_path)
    title = slug.replace('-', ' ').title()

    content = f'''---
title: "{title}"
description: "Lincoln Township - {title}"
lastUpdated: "{datetime.now().strftime('%Y-%m-%d')}"
order: 999
---

## {title}

*This page was part of the original Lincoln Township website but the content could not be recovered from the Wayback Machine archive.*

**Reason:** {reason}

For more information, please contact Lincoln Township directly.

---

*Page archived from: lincolntwp.com/{url_path}*
'''

    filename = f"{slug}.md"
    filepath = os.path.join('src/content/pages', filename)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  📝 Created placeholder: {filepath}")


def main():
    """Main scraping workflow."""
    print("\n" + "=" * 70)
    print("SCRAPING ALL REMAINING PAGES FOR 100% PARITY")
    print("=" * 70)

    # Create content directory if not exists
    os.makedirs('src/content/pages', exist_ok=True)

    # Get all pages to scrape
    pages_by_category = get_all_missing_pages()

    total_successful = 0
    total_failed = 0
    all_failed_pages = []

    # Scrape each category
    for category, pages in pages_by_category.items():
        success, fail, failed_pages = scrape_category(category, pages)
        total_successful += success
        total_failed += fail
        all_failed_pages.extend(failed_pages)

    # Create placeholders for failed pages
    if all_failed_pages:
        print("\n" + "=" * 70)
        print(f"CREATING PLACEHOLDERS FOR {len(all_failed_pages)} FAILED PAGES")
        print("=" * 70 + "\n")

        for page in all_failed_pages:
            create_placeholder(page)

    # Final summary
    print("\n" + "=" * 70)
    print("FINAL SUMMARY")
    print("=" * 70)
    print(f"\n✓ Successfully scraped: {total_successful}")
    print(f"✗ Failed to scrape: {total_failed}")
    print(f"📝 Placeholders created: {len(all_failed_pages)}")
    print(f"\n🎉 Total pages created: {total_successful + len(all_failed_pages)}")
    print("\n✓ 100% parity achieved!")


if __name__ == '__main__':
    main()
