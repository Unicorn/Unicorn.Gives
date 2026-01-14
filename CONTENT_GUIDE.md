# Content Editing Guide

This guide will help you edit and manage content on the Lincoln Township website (unicorn.gives).

## Overview

This website uses a Git-based content management system. All content is stored as Markdown (`.md`) files in the `src/content/pages/` directory. When you make changes and push them to GitHub, the site automatically rebuilds and deploys within 2-3 minutes.

## Editing Pages

### 1. Find the Page to Edit

Navigate to `src/content/pages/` and find the `.md` file for the page you want to edit.

For example:
- Homepage: `index.md`
- Board of Trustees: `board.md`
- Building Department: `building.md`

### 2. Edit the Frontmatter

At the top of each file, you'll see "frontmatter" between `---` markers. This is metadata about the page:

```yaml
---
title: "Building Department"
description: "Information about building permits and regulations"
layout: page
lastUpdated: 2024-11-02
department: "Building"
order: 3
---
```

**Frontmatter Fields:**

- `title`: Page title (shown in browser tab and as the main heading)
- `description`: SEO description for search engines (keep under 160 characters)
- `layout`: Always `page` (don't change this)
- `lastUpdated`: Date of last update (format: YYYY-MM-DD)
- `department`: Department name (optional)
- `order`: Navigation order (lower numbers appear first in the menu)

### 3. Edit the Content

Below the frontmatter is the page content, written in Markdown format.

**Markdown Formatting Basics:**

```markdown
# This is an H1 heading (automatically created from title)
## This is an H2 heading
### This is an H3 heading

This is a paragraph of text.

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered list item 1
2. Numbered list item 2

[Link text](https://example.com)

![Image alt text](/assets/images/filename.jpg)

**Bold text**
*Italic text*
```

### 4. Working with Images and Documents

**Images:**
- Place images in `public/assets/images/`
- Reference them in markdown: `![Alt text](/assets/images/photo.jpg)`

**PDFs and Documents:**
- Place files in `public/assets/documents/`
- Link to them: `[Download PDF](/assets/documents/filename.pdf)`

### 5. Save and Commit Your Changes

After editing:

1. Save the file
2. Commit your changes to Git:
   ```bash
   git add .
   git commit -m "Update building department information"
   git push
   ```
3. Wait 2-3 minutes for the site to rebuild and deploy

## Adding a New Page

1. Create a new `.md` file in `src/content/pages/`
2. Add frontmatter at the top
3. Write your content
4. Commit and push to GitHub

Example new page:

```markdown
---
title: "New Page Title"
description: "Description of the new page"
layout: page
lastUpdated: 2024-11-02
order: 10
---

## Welcome

This is a new page.
```

## Troubleshooting

### Changes Not Appearing?

- Check that you pushed your changes to GitHub
- Wait 2-3 minutes for the build to complete
- Check GitHub Actions tab for build status

### Build Failed?

Common issues:
- Missing or incorrect frontmatter fields
- Invalid YAML syntax in frontmatter
- Missing closing quote marks

### Need Help?

Contact the technical administrator or refer to:
- [Markdown Guide](https://www.markdownguide.org/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

## Best Practices

1. **Always update the `lastUpdated` field** when editing content
2. **Keep descriptions under 160 characters** for better SEO
3. **Use descriptive titles and headings** for accessibility
4. **Optimize images** before uploading (compress large files)
5. **Test links** to make sure they work
6. **Preview changes locally** before pushing (run `npm run dev`)

## Quick Reference

### Running the Site Locally

```bash
npm run dev
```

Visit `http://localhost:4321` to preview changes.

### Building the Site

```bash
npm run build
```

### Common Git Commands

```bash
git status              # See what files changed
git add .               # Stage all changes
git commit -m "message" # Commit with a message
git push                # Push to GitHub
git pull                # Get latest changes
```

---

For more detailed information, refer to the implementation plan at `.claude/plans/lovely-jumping-feather.md`.
