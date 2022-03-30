"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const route = (state = {
    pathname: isBrowser_1.isBrowser ? window.location.pathname : "/",
}, action) => {
    switch (action.type) {
        case "ROUTE":
            return Object.assign(Object.assign({}, state), action.content);
        case "LOAD_ROUTE_CONTENT":
            return Object.assign(Object.assign({}, state), { data: action.data });
        default:
            return state;
    }
};
exports.route = route;
