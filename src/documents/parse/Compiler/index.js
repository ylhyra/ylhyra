"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html2json_1 = require("app/app/functions/html2json");
const _1_Precompile_1 = __importDefault(require("documents/parse/Compiler/1_Precompile"));
const UpdateID_1 = require("documents/parse/Compiler/1_Precompile/UpdateID");
const Traverse_1 = __importDefault(require("documents/parse/Compiler/2_CompileToHTML/Traverse"));
const PrepareJSONForReact_1 = __importDefault(require("documents/parse/Compiler/PrepareJSONForReact"));
const html_entities_1 = require("html-entities");
const server_1 = __importDefault(require("react-dom/server"));
const entities = new html_entities_1.AllHtmlEntities();
const TextCompiler = ({ json, data, }) => {
    (0, UpdateID_1.resetIDs)(); // TEMP
    let output;
    output = data ? (0, _1_Precompile_1.default)({ json, data }) : json;
    output = (0, PrepareJSONForReact_1.default)(output);
    output = (0, Traverse_1.default)({ json: output, data });
    output = server_1.default.renderToStaticMarkup(output);
    output = entities.decode(output);
    output = (0, html2json_1.html2json)(output);
    output = (0, PrepareJSONForReact_1.default)(output);
    return output;
};
exports.default = TextCompiler;
