/**
 * Minimal Paged.js handlers for SoSei print layouts
 * Handles page range visibility for components
 */

/**
 * Handles visibility of elements based on page ranges.
 * Supports formats: "1-3", "5", "2-", etc.
 */
class PageRangeVisibility extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  afterPreview(pages) {
    const allPages = Object.values(pages);

    allPages.forEach((page, index) => {
      const pageNumber = index + 1;
      const pageElement = page.element;

      // Find all elements with data-page-range attribute within this page
      const rangeElements = pageElement.querySelectorAll("[data-page-range]");

      rangeElements.forEach((element) => {
        const range = element.getAttribute("data-page-range");

        if (range && !this.isPageInRange(pageNumber, range)) {
          // Hide element if not in range
          element.style.display = "none";
        }

        // For page-number elements, set the actual page number
        if (element.classList.contains("page-number")) {
          element.setAttribute("data-page-number", pageNumber.toString());
        }
      });
    });
  }

  /**
   * Check if a page number is within the specified range.
   * @param {number} pageNumber - The current page number.
   * @param {string} range - The range string (e.g., "1-3", "5", "2-").
   * @returns {boolean} True if page is in range.
   */
  isPageInRange(pageNumber, range) {
    if (!range) return true;

    // Handle single page: "5"
    if (!range.includes("-")) {
      return pageNumber === parseInt(range, 10);
    }

    // Handle range: "1-3" or "2-"
    const [start, end] = range.split("-");
    const startPage = parseInt(start, 10) || 1;
    const endPage = end ? parseInt(end, 10) : Infinity;

    return pageNumber >= startPage && pageNumber <= endPage;
  }
}

// Register handlers
Paged.registerHandlers(PageRangeVisibility);

// Manually start preview after handlers are registered
if (
  window.PagedPolyfill &&
  typeof window.PagedPolyfill.preview === "function"
) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.PagedPolyfill.preview();
    });
  } else {
    window.PagedPolyfill.preview();
  }
}
