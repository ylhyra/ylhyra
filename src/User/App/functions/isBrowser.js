export const isBrowser = (typeof window !== 'undefined')
export const hasLocalStorage = isBrowser && (typeof localStorage !== 'undefined')
export const supportsTouch = isBrowser && ('ontouchstart' in window || navigator.msMaxTouchPoints);
