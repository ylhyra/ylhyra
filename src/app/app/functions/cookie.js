"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eraseCookie = exports.getCookie = exports.setCookie = void 0;
function setCookie(name, value, days, options) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
        name + "=" + (value || "") + expires + `;${options || ""} path=/`;
}
exports.setCookie = setCookie;
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ")
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
exports.getCookie = getCookie;
function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}
exports.eraseCookie = eraseCookie;
