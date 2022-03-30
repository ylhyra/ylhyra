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
exports.synchronize = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const error_1 = __importDefault(require("app/app/error"));
const store_1 = __importDefault(require("app/app/store"));
const _2_Merge_short_words_1 = __importDefault(require("maker/editor/Long_audio/Synchronize/2-Merge-short-words"));
const _3_Flatten_1 = __importDefault(require("maker/editor/Long_audio/Synchronize/3-Flatten"));
const _4_Make_list_1 = __importDefault(require("maker/editor/Long_audio/Synchronize/4-Make-list"));
// const TESTING_WITH_LOCALHOST = true
/*
  We use [Aeneas](https://github.com/readbeyond/aeneas/) to synchronize audio and text.
  It returns a JSON array of text fragments as can be seen in the file "Synchronize/3_Flatten.js"
*/
const synchronize = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const { long_audio } = store_1.default.getState().editor;
    try {
        /*
          TODO!!!
          Switch to web-socket
        */
        const data = (yield axios_1.default.post(`/api/audio/synchronize`, Object.assign({ filename }, long_audio[filename]))).data;
        if (data.fragments) {
            const list = (0, _4_Make_list_1.default)((0, _3_Flatten_1.default)((0, _2_Merge_short_words_1.default)(data.fragments)));
            // console.log(list)
            store_1.default.dispatch({
                type: "SYNC",
                filename,
                content: {
                    // sectionHash,
                    original_sync_data: data,
                    list,
                },
            });
        }
    }
    catch (e) {
        (0, error_1.default)("Could not synchronize audio");
        console.error(e);
    }
});
exports.synchronize = synchronize;
