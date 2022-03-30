"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const user = (state = null, action) => {
    switch (action.type) {
        case "LOAD_USER":
            return action.content;
        default:
            return state;
    }
};
exports.user = user;
