class MyHandler extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }
  afterPageLayout(pageFragment, page) {
    // add html element to the end of body
    const body = pageFragment.parentElement.parentElement;
    const buttonString = `<button onclick="window.print()" class="print_button" title="Print"><svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></g></svg></button>`;
    body.append(convertHtmlStringToElement(buttonString));

    // add preview class to all pages
    pageFragment.classList.add("for-prview-only");
  }
}
Paged.registerHandlers(MyHandler);

// change title before and after printing
let currentTitle = document.title;
const beforePrint = window.addEventListener("beforeprint", () => {
  document.title = "Printed doc using sosei!";
});

const afterPrint = window.addEventListener("afterprint", () => {
  document.title = currentTitle;
});

window.removeEventListener("beforeprint", beforePrint);
window.removeEventListener("afterprint", afterPrint);

/**
 * Converts a string of HTML into a single DOM element.
 * @param {string} htmlString - The HTML string to convert.
 * @returns {Node|null} The resulting DOM node, or null if parsing fails.
 */
function convertHtmlStringToElement(htmlString) {
  // DOMParser is efficient and secure
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Return the first actual node inside the body
  return doc.body.firstChild;
}
