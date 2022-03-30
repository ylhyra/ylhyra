"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class User extends react_1.Component {
    render() {
        const { user } = this.props;
        if (!user)
            return (0, jsx_runtime_1.jsx)("div", { children: "LOG IN" });
        return ((0, jsx_runtime_1.jsxs)("div", { children: ["Logged in as ", (0, jsx_runtime_1.jsx)("b", { children: user.name })] }));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    user: state.user,
}))(User);
