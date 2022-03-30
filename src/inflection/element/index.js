"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inflectionElement = void 0;
const get_by_id_1 = __importDefault(require("inflection/server/server-standalone/get_by_id"));
const tables_1 = __importDefault(require("inflection/tables"));
const inflectionElement = (id, parameters) => {
    return new Promise((resolve) => {
        let params = {};
        parameters.replace(/([^&=]+)=([^&=]+)/g, (x, parameter, value) => {
            params[parameter] = value;
        });
        (0, get_by_id_1.default)(id, (rows) => {
            resolve(`<div class="inflection_wrapper"><div>${(0, tables_1.default)(rows, Object.assign({ single: true, simplifyTerms: true }, params))}</div></div>`);
        });
    });
};
exports.inflectionElement = inflectionElement;
