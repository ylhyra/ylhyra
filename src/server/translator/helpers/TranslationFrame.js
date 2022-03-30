"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simplifyString_1 = __importDefault(require("server/translator/helpers/simplifyString"));
exports.default = (words, index, contains) => {
    let translation_frame = {};
    let spaces = 0;
    /*
      -3, -2, -1,
    */
    for (let i = -1; i + spaces >= -3; i--) {
        const word = words[index + i];
        if (word === " ") {
            spaces++;
            continue;
        }
        else if (typeof word === "string" || !word) {
            break;
        }
        translation_frame[i + spaces] = word;
    }
    /*
      0, +1, +2, +3,
    */
    spaces = 0;
    for (let i = 0; i - spaces <= 3; i++) {
        const word = words[index + i];
        if (word === " ") {
            spaces++;
            continue;
        }
        else if (typeof word === "string" || !word) {
            break;
        }
        translation_frame[i - spaces] = word;
    }
    return Object.keys(translation_frame)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((key) => {
        const word = translation_frame[key];
        return Object.assign(Object.assign({}, word), { text: (0, simplifyString_1.default)(word.text), position_relative_to_center_word: parseInt(key), is_part_of_definition: contains === null || contains === void 0 ? void 0 : contains.includes(word.id) });
    });
};
