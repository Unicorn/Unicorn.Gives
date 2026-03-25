import type { NavigationCategory, NavigationSubcategory } from '../config/navigation';
import { navigationStructure } from '../config/navigation';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface NavigationPath {
  category: NavigationCategory | null;
  subcategory: NavigationSubcategory | null;
  pageSlug: string;
}

/**
 * Find the navigation path (category and subcategory) for a given page slug
 */
export function findNavigationPath(slug: string): NavigationPath {
  for (const category of navigationStructure) {
    for (const subcategory of category.subcategories) {
      if (subcategory.pages.includes(slug)) {
        return {
          category,
          subcategory,
          pageSlug: slug
        };
      }
    }
  }

  return {
    category: null,
    subcategory: null,
    pageSlug: slug
  };
}

/**
 * Generate breadcrumb trail for a given page
 */
export function generateBreadcrumbs(slug: string, pageTitle: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/'
    }
  ];

  // Homepage has no additional breadcrumbs
  if (slug === '' || slug === 'index') {
    return breadcrumbs;
  }

  const navPath = findNavigationPath(slug);

  // Add category if found
  if (navPath.category) {
    breadcrumbs.push({
      label: navPath.category.label,
      href: `#${navPath.category.id}` // Categories don't have their own pages, link to anchor
    });
  }

  // Add subcategory if found
  if (navPath.subcategory) {
    const subcatHref = navPath.subcategory.microsite
      ? navPath.subcategory.microsite.basePath
      : `#${navPath.subcategory.id}`;
    breadcrumbs.push({
      label: navPath.subcategory.label,
      href: subcatHref
    });
  }

  // For microsites, the page title IS the subcategory (tabs handle sub-navigation)
  // so we end the breadcrumb at the subcategory level
  if (navPath.subcategory?.microsite) {
    // Make the last breadcrumb (subcategory) the current page
    const last = breadcrumbs[breadcrumbs.length - 1];
    last.href = ''; // No link for current page
  } else {
    // Add current page (no link)
    breadcrumbs.push({
      label: pageTitle,
      href: '' // Empty href for current page
    });
  }

  return breadcrumbs;
}

/**
 * Get all pages organized by category and subcategory
 */
export function getOrganizedPages() {
  return navigationStructure;
}

/**
 * Check if a page slug is in the navigation structure
 */
export function isPageInNavigation(slug: string): boolean {
  const path = findNavigationPath(slug);
  return path.category !== null;
}
