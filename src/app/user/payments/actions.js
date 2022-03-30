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
exports.parsePrice = exports.continueAfterPaying = exports.MAX_PRICE = exports.MIN_PRICE = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const updateURL_1 = require("app/router/actions/updateURL");
exports.MIN_PRICE = 3;
exports.MAX_PRICE = 200;
const continueAfterPaying = ({ price, transaction_id }) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.post("/api/pwyw", {
        price,
        transaction_id,
    });
    if (price) {
        (0, updateURL_1.updateURL)("/signup/done");
    }
    else {
        (0, updateURL_1.updateURL)("/");
        // updateURL("/signup/welcome");
    }
});
exports.continueAfterPaying = continueAfterPaying;
const parsePrice = (price) => {
    price = price
        .toString()
        .replace(/\s/g, "")
        .replace(/\$/g, "")
        .replace(/,([0-9]{1,2})$/, ".$1")
        .replace(/,/, "");
    price = price || "0";
    if (/[^0-9.]/.test(price) || price.split(".").length > 2) {
        return { error: "INVALID_NUMBER" };
    }
    const [d, c] = price.split(".");
    const cents = parseInt(d) * 100 +
        (c ? Math.floor((parseInt(c) / Math.pow(10, c.length)) * 100) : 0);
    if (cents > exports.MAX_PRICE * 100) {
        return { error: "TOO_LARGE" };
    }
    if (cents < exports.MIN_PRICE * 100) {
        return { error: "TOO_SMALL" };
    }
    return (cents / 100).toFixed(2);
};
exports.parsePrice = parsePrice;
