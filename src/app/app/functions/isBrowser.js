"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsTouch = exports.hasLocalStorage = exports.isBrowser = void 0;
exports.isBrowser = typeof window !== "undefined" && "document" in window;
exports.hasLocalStorage = exports.isBrowser && typeof localStorage !== "undefined";
exports.supportsTouch = exports.isBrowser && ("ontouchstart" in window || "msMaxTouchPoints" in navigator);
