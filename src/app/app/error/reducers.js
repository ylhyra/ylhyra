"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (state = null, action) => {
    switch (action.type) {
        case "ERROR":
            return action.content;
        default:
            return state;
    }
};
