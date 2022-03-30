"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScrollingElement = exports.removeClass = exports.addClass = void 0;
const addClass = (ids, cssClass = "audio") => {
    ids = Array.isArray(ids) ? ids : [ids];
    ids.forEach((id) => {
        const element = document.getElementById(id);
        if (!element)
            return;
        element.classList.add(cssClass);
    });
};
exports.addClass = addClass;
const removeClass = (ids, cssClass = "audio") => {
    ids = Array.isArray(ids) ? ids : [ids];
    ids.forEach((id) => {
        const element = document.getElementById(id);
        if (!element)
            return;
        element.classList.remove(cssClass);
    });
};
exports.removeClass = removeClass;
const getScrollingElement = () => {
    return document.scrollingElement || document.documentElement;
    // document.documentElement //|| document.body || document.body.parentNode || document.documentElement
};
exports.getScrollingElement = getScrollingElement;
