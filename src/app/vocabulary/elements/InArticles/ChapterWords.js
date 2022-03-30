"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
exports.default = (props) => {
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "toc-vocabulary-list" }, { children: props.data.sentences.join(" • ") })));
};
