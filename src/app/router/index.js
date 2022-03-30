"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Layout_1 = __importDefault(require("app/elements/layout/Layout"));
const actions_1 = require("app/router/actions");
const updateURL_1 = require("app/router/actions/updateURL");
const appUrls_1 = require("app/router/appUrls");
const Content_1 = __importDefault(require("app/router/Content"));
const Section_1 = __importDefault(require("documents/templates/Section"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class App extends react_1.default.Component {
    componentDidMount() {
        const url = this.props.url || this.props.route.pathname;
        /* TODO: Virkar ekki ef maður er ekki loggaður inn þar sem schedule er ekki búið að initialiseras */
        if (url === "/" && (0, actions_1.isVocabularyTheFrontpage)()) {
            (0, updateURL_1.updateURL)("/vocabulary");
        }
    }
    render() {
        let Element = () => null;
        const url = this.props.url || this.props.route.pathname;
        if (url in appUrls_1.app_urls) {
            Element = appUrls_1.app_urls[url].component; //|| components["/vocabulary"];
            let Section2 = Section_1.default;
            if (url === "/vocabulary/play" || url === "/vocabulary") {
                Section2 = (props) => props.children;
            }
            (0, actions_1.index)(false);
            return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsx)(Section2, { children: (0, jsx_runtime_1.jsx)(Element, { prerender: this.props.prerender }, url) }) }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsx)(Content_1.default, { prerender: this.props.prerender }, url) }));
        }
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    route: state.route,
}))(App);
