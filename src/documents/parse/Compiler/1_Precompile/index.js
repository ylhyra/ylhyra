"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MergePunctuation_1 = __importDefault(require("documents/parse/Compiler/1_Precompile/MergePunctuation"));
const MergeWords_1 = __importDefault(require("documents/parse/Compiler/1_Precompile/MergeWords"));
const TempIDs_1 = require("documents/parse/Compiler/1_Precompile/TempIDs");
// import PronunciationAndSound from './PronunciationAndSound'
// import WrapInTags from 'Editor/2-Parse/2.3-WrapInTags'
const Compile = ({ json, data }) => {
    let output = json;
    output = (0, TempIDs_1.TempIDs)(output);
    output = (0, MergeWords_1.default)(output, data.translation);
    output = (0, MergePunctuation_1.default)(output, data.translation);
    output = (0, TempIDs_1.RemoveTempIDs)(output);
    /* Disabled due to audio sync */
    // output = NiceIDs(output /*data.id*/);
    // console.log(output)
    // console.log(JSON.stringify(output, null, 2))
    return output;
};
exports.default = Compile;
