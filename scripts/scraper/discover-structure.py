#!/usr/bin/env python3
"""
Discover and map the structure of lincolntwp.com from Wayback Machine.
This script crawls the site and creates a sitemap of all pages.
"""

import json
import re
import time
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import requests

# Base URLs
WAYBACK_BASE = "https://web.archive.org/web/20251102121853/"
SITE_BASE = "https://www.lincolntwp.com/"
WAYBACK_SITE = WAYBACK_BASE + SITE_BASE

# Track visited URLs to avoid duplicates
visited_urls = set()
discovered_pages = []


def is_valid_url(url):
    """Check if URL is valid for scraping."""
    # Parse URL
    parsed = urlparse(url)

    # Must be from lincolntwp.com
    if "lincolntwp.com" not in parsed.netloc and "lincolntwp.com" not in url:
        return False

    # Skip certain file types
    skip_extensions = ('.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.jpg', '.jpeg', '.png', '.gif')
    if any(url.lower().endswith(ext) for ext in skip_extensions):
        return False

    # Skip anchors
    if '#' in url:
        return False

    return True


def normalize_url(url):
    """Normalize URL for comparison."""
    # Remove wayback machine prefix if present
    if "web.archive.org" in url:
        # Extract original URL from wayback URL
        match = re.search(r'web\.archive\.org/web/\d+/(.*)', url)
        if match:
            url = match.group(1)

    # Ensure it starts with site base
    if not url.startswith('http'):
        url = urljoin(SITE_BASE, url)

    # Remove trailing slash for consistency
    url = url.rstrip('/')

    return url


def discover_links(url):
    """Fetch a page and discover all links."""
    print(f"Discovering: {url}")

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract page title
        title = soup.find('title')
        title_text = title.get_text().strip() if title else "Untitled"

        # Get page metadata
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        description = meta_desc.get('content', '').strip() if meta_desc else ""

        # Store page info
        normalized_url = normalize_url(url)
        page_info = {
            'url': normalized_url,
            'wayback_url': url,
            'title': title_text,
            'description': description
        }

        discovered_pages.append(page_info)

        # Find all links
        links = []
        for link in soup.find_all('a', href=True):
            href = link.get('href')

            # Convert relative URLs to absolute
            if href.startswith('/'):
                absolute_url = WAYBACK_SITE.rstrip('/') + href
            elif href.startswith('http'):
                # If it's already absolute, add wayback prefix if needed
                if 'web.archive.org' not in href and 'lincolntwp.com' in href:
                    absolute_url = WAYBACK_BASE + href
                else:
                    absolute_url = href
            else:
                # Relative URL
                absolute_url = urljoin(url, href)

            if is_valid_url(absolute_url):
                normalized = normalize_url(absolute_url)
                if normalized not in visited_urls:
                    links.append(absolute_url)

        return links

    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []


def crawl_site(start_url, max_pages=100):
    """Crawl the site starting from the homepage."""
    to_visit = [start_url]
    pages_crawled = 0

    while to_visit and pages_crawled < max_pages:
        current_url = to_visit.pop(0)
        normalized = normalize_url(current_url)

        if normalized in visited_urls:
            continue

        visited_urls.add(normalized)

        # Discover links on this page
        new_links = discover_links(current_url)

        # Add new links to visit queue
        for link in new_links:
            if normalize_url(link) not in visited_urls:
                to_visit.append(link)

        pages_crawled += 1

        # Be respectful - add delay between requests
        time.sleep(2)

    print(f"\nCrawled {pages_crawled} pages")
    print(f"Discovered {len(discovered_pages)} unique pages")


def save_sitemap(filename='sitemap.json'):
    """Save discovered pages to JSON file."""
    output = {
        'site': SITE_BASE,
        'wayback_snapshot': WAYBACK_BASE,
        'pages_discovered': len(discovered_pages),
        'pages': discovered_pages
    }

    filepath = f"scripts/scraper/{filename}"
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nSitemap saved to {filepath}")

    # Print summary
    print("\n=== Discovered Pages ===")
    for page in discovered_pages:
        print(f"- {page['title']}")
        print(f"  URL: {page['url']}")


if __name__ == '__main__':
    print("Starting site discovery...")
    print(f"Target: {SITE_BASE}")
    print(f"Wayback snapshot: {WAYBACK_BASE}")
    print("=" * 60)

    crawl_site(WAYBACK_SITE)
    save_sitemap()

    print("\n✓ Site structure discovery complete!")
