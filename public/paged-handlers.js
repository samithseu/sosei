/**
 * Custom Header/Footer System for SoSei
 * Bypasses Paged.js margin boxes to prevent style overrides
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
      });

      // Set page number for all .page-number elements (with or without data-page-range)
      const pageNumberElements = pageElement.querySelectorAll(".page-number");
      pageNumberElements.forEach((element) => {
        element.setAttribute("data-page-number", pageNumber.toString());
      });

      // Set total pages for all .total-pages elements
      const totalPagesElements = pageElement.querySelectorAll(".total-pages");
      totalPagesElements.forEach((element) => {
        element.textContent = allPages.length.toString();
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

/**
 * Clones custom headers and footers to each page.
 * This bypasses Paged.js margin boxes entirely.
 */
class CustomHeadersFooters extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.headerTemplate = null;
    this.footerTemplate = null;
  }

  beforeParsed(content) {
    // Store the original header and footer templates
    const originalHeader = content.querySelector(".custom-header");
    const originalFooter = content.querySelector(".custom-footer");

    if (originalHeader) {
      this.headerTemplate = originalHeader.cloneNode(true);
      // Remove the original from the flow - we'll clone it to each page
      originalHeader.remove();
    }

    if (originalFooter) {
      this.footerTemplate = originalFooter.cloneNode(true);
      // Remove the original from the flow
      originalFooter.remove();
    }
  }

  afterPageLayout(pageElement, page, breakToken) {
    // Clone header to this page if template exists
    if (this.headerTemplate) {
      const pageBox = pageElement.querySelector(".pagedjs_pagebox");
      if (pageBox && !pageElement.querySelector(".custom-header")) {
        const headerClone = this.headerTemplate.cloneNode(true);
        // Insert at the beginning of the page box
        pageBox.insertBefore(headerClone, pageBox.firstChild);
      }
    }

    // Clone footer to this page if template exists
    if (this.footerTemplate) {
      const pageBox = pageElement.querySelector(".pagedjs_pagebox");
      if (pageBox && !pageElement.querySelector(".custom-footer")) {
        const footerClone = this.footerTemplate.cloneNode(true);
        // Insert at the end of the page box
        pageBox.appendChild(footerClone);
      }
    }
  }

  afterPreview(pages) {
    // Hide Paged.js default margin boxes after everything is rendered
    const selectors = [
      ".pagedjs_margin-top",
      ".pagedjs_margin-bottom",
      ".pagedjs_margin-top-left-corner-holder",
      ".pagedjs_margin-top-right-corner-holder",
      ".pagedjs_margin-bottom-left-corner-holder",
      ".pagedjs_margin-bottom-right-corner-holder",
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.display = "none";
      });
    });

    // Apply page range visibility to cloned headers/footers
    const allPages = Object.values(pages);
    allPages.forEach((page, index) => {
      const pageNumber = index + 1;
      const pageElement = page.element;

      const rangeElements = pageElement.querySelectorAll(
        ".custom-header[data-page-range], .custom-footer[data-page-range]"
      );

      rangeElements.forEach((element) => {
        const range = element.getAttribute("data-page-range");
        if (range && !this.isPageInRange(pageNumber, range)) {
          element.style.display = "none";
        }
      });
    });
  }

  isPageInRange(pageNumber, range) {
    if (!range) return true;
    if (!range.includes("-")) {
      return pageNumber === parseInt(range, 10);
    }
    const [start, end] = range.split("-");
    const startPage = parseInt(start, 10) || 1;
    const endPage = end ? parseInt(end, 10) : Infinity;
    return pageNumber >= startPage && pageNumber <= endPage;
  }
}

// Register handlers
Paged.registerHandlers(PageRangeVisibility);
Paged.registerHandlers(CustomHeadersFooters);

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
