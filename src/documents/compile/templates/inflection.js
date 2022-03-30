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
Object.defineProperty(exports, "__esModule", { value: true });
const replaceAsync_1 = require("app/app/functions/replaceAsync");
const element_1 = require("inflection/element");
exports.default = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, replaceAsync_1.replaceAsync)(input, /<Inflection id="(.+)?" parameters="(.+)?"><\/Inflection>/gi, (x, id, parameters) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, element_1.inflectionElement)(id, parameters);
    }));
});
