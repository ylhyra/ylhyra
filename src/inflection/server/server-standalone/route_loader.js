"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("inflection/server/routes"));
const get_by_id_1 = __importDefault(require("inflection/server/server-standalone/get_by_id"));
const search_1 = __importDefault(require("inflection/server/server-standalone/search"));
exports.default = (0, routes_1.default)(search_1.default, get_by_id_1.default);
