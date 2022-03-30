"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const store_1 = __importDefault(require("app/app/store"));
const Link_1 = __importDefault(require("app/router/Link"));
exports.default = () => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Link_1.default, Object.assign({ href: "/vocabulary" }, { children: "Exit" })), (0, jsx_runtime_1.jsx)("div", { children: "Done for today!" }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: () => store_1.default.getState().vocabulary.deck.continueStudying() }, { children: "Continue studying" })) })] }));
