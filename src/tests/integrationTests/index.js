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
exports.wait = exports.notNull = exports.assert = exports.shouldEqual = void 0;
const array_foreach_async_1 = __importDefault(require("app/app/functions/array-foreach-async"));
const recipes_1 = require("tests/integrationTests/recipes");
const underscore_1 = __importDefault(require("underscore"));
const logger = window.logToPuppeteer || console.log;
/* Main test runner */
exports.default = (only_run) => __awaiter(void 0, void 0, void 0, function* () {
    const toRun = Object.assign(Object.assign(Object.assign(Object.assign({}, require("tests/integrationTests/vocabulary/articles.test").default), require("tests/integrationTests/vocabulary/easiness.test").default), require("tests/integrationTests/vocabulary/session_logging.test")
        .default), require("tests/integrationTests/vocabulary/sync.test").default);
    yield (0, array_foreach_async_1.default)(underscore_1.default.shuffle(Object.keys(toRun)), (key) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            if (only_run && key !== only_run)
                return resolve();
            logger(`Starting test "${key}"`);
            yield recipes_1.run.reset();
            try {
                yield toRun[key]();
            }
            catch (e) {
                !("logToPuppeteer" in window) && console.trace();
                console.error(`Error in test "${key}": ${e.toString()}`);
                return;
            }
            logger(`%cThe test "${key}" is good!`, "font-size: larger");
            resolve();
        }));
    }));
    !only_run && console.log("%cAll tests good!", "font-size: x-large");
});
const shouldEqual = (first, second) => {
    if (first !== second) {
        throw new Error(`NOT EQUAL: Received ${first} and ${second}`);
    }
};
exports.shouldEqual = shouldEqual;
const assert = (i, ...description) => {
    if (!i) {
        // log(description);
        throw new Error(description);
    }
};
exports.assert = assert;
const notNull = (...vals) => {
    vals.forEach((val) => {
        if (!(val && val !== "0")) {
            throw new Error("Received a null");
        }
    });
};
exports.notNull = notNull;
const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms || 20);
    });
};
exports.wait = wait;
// const isDeckInitialized = async () => {
//   if (!deck) {
//     logger("Waiting for deck...");
//     await wait(300);
//     await isDeckInitialized();
//   }
// };
