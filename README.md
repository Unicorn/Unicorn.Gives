# unicorn.gives

Official website replica for Lincoln Township, Michigan, built with Astro and featuring unicorn.love branding.

## Features

- 🎨 **unicorn.love Branding** - Purple color scheme, Barlow fonts
- 🚀 **Astro Static Site** - Fast, SEO-optimized static generation
- 📝 **Git-based CMS** - Edit content as Markdown files
- 📱 **Responsive Design** - Mobile-friendly with hamburger menu
- 🔍 **SEO Optimized** - Meta tags, Open Graph, structured data, sitemap
- 🤖 **Auto Deploy** - GitHub Actions → Cloudflare Pages

## Project Structure

```
/
├── public/
│   ├── assets/          # Images, PDFs, documents
│   └── robots.txt
├── scripts/
│   └── scraper/         # Python scraping scripts
├── src/
│   ├── components/      # Astro components
│   ├── content/
│   │   ├── config.ts    # Content schema
│   │   └── pages/       # Markdown content files
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   └── styles/          # Global styles
├── .github/
│   └── workflows/       # GitHub Actions
└── astro.config.mjs
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/unicorn-gives.git
cd unicorn-gives

# Install Node dependencies
npm install

# Set up Python virtual environment (for scraping)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install waybackpy beautifulsoup4 requests lxml markdownify
```

## Development

```bash
# Start dev server
npm run dev
# → http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview
```

## Content Management

### Adding/Editing Pages

1. Navigate to `src/content/pages/`
2. Create or edit `.md` files
3. Use this frontmatter format:

```markdown
---
title: "Page Title"
description: "SEO description (max 160 chars)"
lastUpdated: "2024-11-02"
order: 1
---

## Your Content Here

Write your content in Markdown...
```

4. Commit and push to deploy

### Navigation Order

Pages appear in the navigation based on the `order` field (lower = earlier).

## Scraping Lincoln Township Content

To extract content from the archived lincolntwp.com site:

```bash
# Activate Python environment
source venv/bin/activate

# Step 1: Discover site structure
python scripts/scraper/discover-structure.py

# Step 2: Scrape all pages
python scripts/scraper/scrape-wayback.py

# Step 3: Download assets
python scripts/scraper/download-assets.py
```

**Note**: Scraping takes time due to rate limiting (2-second delays between requests).

## Deployment

### GitHub Actions (Automatic)

Push to `main` branch → Auto-builds and deploys to Cloudflare Pages.

### Cloudflare Pages Setup

1. Create new project: "unicorn-gives"
2. Connect GitHub repository
3. Build settings:
   - Framework: **Astro**
   - Build command: `npm run build`
   - Build output: `dist`
4. Add GitHub secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. Configure custom domain: `unicorn.gives`

## Branding

### Colors

- Primary: `#6361ad` (purple)
- Link: `#7c7ac8`
- Hover: `#47458f`
- Selection: `#c5cde9`

### Fonts

- Body: Barlow
- Headings: Barlow Condensed
- Titles: Bebas Neue

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Content**: Markdown with Content Collections
- **Styling**: CSS with CSS Variables
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **Scraping**: Python (BeautifulSoup, markdownify)

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

## Contributing

1. Create a new branch
2. Make your changes
3. Test locally with `npm run dev`
4. Build to verify: `npm run build`
5. Commit and push
6. Create a pull request

## Content Guidelines

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for detailed editing instructions.

## License

© 2024 Lincoln Township. All rights reserved.

## Support

For issues or questions, contact the repository owner or file an issue on GitHub.

---

Built with ❤️ using [Astro](https://astro.build) and [unicorn.love](https://unicorn.love) branding.
