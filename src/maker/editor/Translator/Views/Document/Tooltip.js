"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordTooltip = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const border_color = "#BFBFBF";
const WordWrapper = styled_components_1.default.div `
  display: ${(props) => (props.visible ? "flex" : "none")};
  width: 240px;
  height: 100px;
  bottom: 22px;
  margin-left: -${240 / 2}px;
  left: 50%;
  flex-direction: column;
  position: absolute;
`;
const Flex = styled_components_1.default.div `
  flex: 1;
`;
const Element = styled_components_1.default.div `
  z-index: 100;
  margin: auto;
  display: inline-block;

  background: #ffffff;
  border: 1px solid ${border_color};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.07), 0 2px 3px 0 rgba(0, 0, 0, 0.06);
  border-radius: 3px;

  font-size: 13px;
  line-height: 1.4em;

  .kafli {
    padding: 4px 7px;
    &:not(:last-child) {
      border-bottom: 1px solid ${border_color};
    }
    &.gray {
      background: #eee;
    }
    &.meaning {
      font-size: 14px;
    }
    div {
      font-weight: bold;
    }
    label {
      font-size: 11px;
      color: #7a7a7a;
      text-transform: uppercase;
    }
  }
`;
/*    _       __               __
     | |     / /___  _________/ /
     | | /| / / __ \/ ___/ __  /
     | |/ |/ / /_/ / /  / /_/ /
     |__/|__/\____/_/   \__,_/   */
class wordTooltip extends react_1.default.PureComponent {
    render() {
        const { definition } = this.props;
        return ((0, jsx_runtime_1.jsxs)(WordWrapper, Object.assign({ visible: this.props.visible }, { children: [(0, jsx_runtime_1.jsx)(Flex, {}), (0, jsx_runtime_1.jsxs)(Element, { children: [definition.meaning && ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "kafli meaning" }, { children: (0, jsx_runtime_1.jsx)("div", { children: definition.meaning }) }))), definition.direct && ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "kafli gray" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Direct translation" }), (0, jsx_runtime_1.jsx)("div", { children: definition.direct })] }))), definition.orð_í_grunnútgáfu && ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "kafli gray" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Word in base position (?)" }), (0, jsx_runtime_1.jsx)("div", { children: definition.orð_í_grunnútgáfu })] }))), definition.dæmi_um_setningu && ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "kafli gray" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Example usage" }), (0, jsx_runtime_1.jsx)("div", { children: definition.dæmi_um_setningu })] })))] })] })));
    }
}
exports.wordTooltip = wordTooltip;
