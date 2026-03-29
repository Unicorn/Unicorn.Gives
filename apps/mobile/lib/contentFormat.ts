/**
 * Content format detection and conversion.
 *
 * All seeded content is markdown. The TipTap editor works with HTML.
 * This module auto-detects the format and converts markdown→HTML on load,
 * so the editor always works with HTML. Saves are always HTML.
 *
 * The public-facing MarkdownRenderer handles both markdown and HTML.
 */
import { marked } from 'marked';

// Configure marked for clean output
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Detect whether a body string is HTML or markdown.
 * Returns 'html' if it contains block-level HTML tags, 'markdown' otherwise.
 */
export function detectContentFormat(body: string): 'html' | 'markdown' {
  if (!body || !body.trim()) return 'markdown';

  // Check for block-level HTML tags that TipTap would produce
  const htmlBlockPattern = /<(?:p|h[1-6]|ul|ol|li|blockquote|pre|div|table|hr)\b[^>]*>/i;
  if (htmlBlockPattern.test(body)) return 'html';

  return 'markdown';
}

/**
 * Convert markdown to HTML for the TipTap editor.
 * If the content is already HTML, returns it as-is.
 */
export function markdownToHtml(body: string): string {
  if (!body || !body.trim()) return '';

  const format = detectContentFormat(body);
  if (format === 'html') return body;

  // Convert markdown to HTML
  const html = marked.parse(body) as string;
  return html;
}

/**
 * Check if content is markdown (for display purposes).
 */
export function isMarkdown(body: string): boolean {
  return detectContentFormat(body) === 'markdown';
}
