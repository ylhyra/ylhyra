"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
exports.default = (props) => {
    return ((0, jsx_runtime_1.jsx)("h1", Object.assign({ id: props.id }, { children: (0, jsx_runtime_1.jsx)("span", { children: props.children }) })));
};
