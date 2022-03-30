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
const sounds_1 = __importDefault(require("datasets/sounds"));
const router = require("express").Router();
/*
  Finds PRONUNCIATION and SOUND
*/
exports.default = ({ missingPronunciation, missingSound }, callback) => __awaiter(void 0, void 0, void 0, function* () {
    let pronunciation = {};
    // await Promise.all(missingPronunciation.map(text => (
    //   new Promise(async resolve => {
    //     pronunciation[text] = await Pronunciation(text)
    //     resolve()
    //   })
    // )))
    let sound = {};
    yield Promise.all(missingSound.map((text) => new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        sound[text] = yield (0, sounds_1.default)(text);
        resolve();
    }))));
    callback({ type: "SOUND", pronunciation, sound });
});
