"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
class Collapse extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "collapse" }, { children: this.state.open ? ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "data" }, { children: this.props.children }))) : ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "button", onClick: () => {
                    this.setState({
                        open: true,
                    });
                } }, { children: "Show answer" }))) })));
    }
}
exports.default = Collapse;
