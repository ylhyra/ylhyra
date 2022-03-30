export const isBrowser = typeof window !== "undefined" && "document" in window;
export const hasLocalStorage = isBrowser && typeof localStorage !== "undefined";
export const supportsTouch =
  isBrowser && ("ontouchstart" in window || navigator.msMaxTouchPoints);
