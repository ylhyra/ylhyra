"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
exports.default = (props) => {
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: `ylhyra_image ${props.position || "center"}`, "data-no-translate": true }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ style: props.style || {} }, { children: props.children })) })));
};
