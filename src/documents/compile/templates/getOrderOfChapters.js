"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = void 0;
const compile_1 = __importDefault(require("documents/compile"));
const links_1 = require("server/content/links");
let cachedUrlOrder;
const getOrder = (withDepth, return_unit_to_url) => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedUrlOrder && !withDepth && !return_unit_to_url)
        return cachedUrlOrder;
    const { content } = yield (0, compile_1.default)("course");
    let currentUnit = 0;
    let index = 1;
    let urls = [];
    let units_to_url = [];
    let url_to_unit = {};
    content.replace(/(?:Unit (\d+)|chapter_url="(.+?)")/g, (x, unit, _url) => {
        if (unit) {
            currentUnit = unit;
            index = 1;
            return;
        }
        const { url } = (0, links_1.getValuesForURL)(_url);
        if (!url)
            return;
        urls.push(url);
        units_to_url.push({
            unit: currentUnit,
            prefix: index++,
            url,
        });
        url_to_unit[url] = currentUnit;
    });
    cachedUrlOrder = urls;
    if (withDepth) {
        return units_to_url;
    }
    if (return_unit_to_url) {
        return url_to_unit;
    }
    return cachedUrlOrder;
});
exports.getOrder = getOrder;
