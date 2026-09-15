// Runs synchronously after the server HTML is parsed but before React
// hydrates. Some browser extensions (security/shopping tools) inject
// attributes like bis_skin_checked / bis_register into every element on
// the page during this window, which otherwise makes React think the
// server and client HTML don't match ("hydration mismatch") — even on
// elements that belong to Next.js's own internals, which app code can't
// individually annotate with suppressHydrationWarning. Stripping the
// known extension attributes here, before hydration compares the DOM,
// removes the mismatch at the source instead of chasing it per-element.
const EXTENSION_ATTRS = ["bis_skin_checked", "bis_register"];

function stripExtensionAttributes() {
  const selector = EXTENSION_ATTRS.map((attr) => `[${attr}]`).join(",");
  document.querySelectorAll(selector).forEach((el) => {
    for (const attr of EXTENSION_ATTRS) el.removeAttribute(attr);
  });
}

stripExtensionAttributes();
