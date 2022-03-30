"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
class ScrollToTop extends react_1.default.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            document.getElementById("root").scrollTo(0, 0);
        }
    }
    render() {
        return this.props.children;
    }
}
exports.default = ScrollToTop;
