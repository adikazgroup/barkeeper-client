export function getActualScrollY(): number {
  if (typeof window === "undefined") return 0;

  const bodyStyle = window.getComputedStyle(document.body);
  if (bodyStyle.position === "fixed") {
    const topValue = document.body.style.top;
    return topValue ? Math.abs(Number.parseInt(topValue, 10)) : 0;
  }
  return window.scrollY;
}
