/**
 * Body scroll lock shared by every overlay (modals, drawers, dropdown sheets).
 *
 * Reference counted: nested overlays each call `lockBodyScroll`, and the page
 * only regains scroll when the last one unlocks. The scrollbar width is padded
 * back onto <body> so content doesn't jump sideways when the bar disappears.
 */

let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;

  lockCount += 1;
  if (lockCount > 1) return;

  const body = document.body;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
  }

  body.style.overflow = "hidden";
}

export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  const body = document.body;
  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
}

/** Escape hatch for hot-reload / unmount edge cases where counts can drift. */
export function resetBodyScrollLock(): void {
  if (lockCount === 0) return;
  lockCount = 1; // so the unlock below is the "last" one and restores styles
  unlockBodyScroll();
}