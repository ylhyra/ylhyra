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
exports.load = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const store_1 = __importDefault(require("app/app/store"));
const actions_1 = require("maker/vocabulary_maker/actions/actions");
const sound_1 = require("maker/vocabulary_maker/actions/sound");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const parse_vocabulary_file_1 = require("maker/vocabulary_maker/compile/parse_vocabulary_file");
const load = () => __awaiter(void 0, void 0, void 0, function* () {
    // window.skip_hash = true;
    console.log((0, functions_1.getDeckName)());
    let vocabulary = (yield axios_1.default.post(`/api/vocabulary_maker/get`, {
        deckName: (0, functions_1.getDeckName)(),
    })).data;
    actions_1.Database.sound = (vocabulary === null || vocabulary === void 0 ? void 0 : vocabulary.sound) || [];
    actions_1.Database.rows = (vocabulary === null || vocabulary === void 0 ? void 0 : vocabulary.rows) || [];
    actions_1.Database.rows.forEach((row) => {
        actions_1.Database.maxID = Math.max(actions_1.Database.maxID, row.row_id);
    });
    actions_1.Database.rows = actions_1.Database.rows.map((row) => {
        // if (row.importance) {
        //   row.importance += 3;
        // }
        return row;
    });
    Object.assign(actions_1.Database, (0, parse_vocabulary_file_1.parse_vocabulary_file)(vocabulary));
    if (store_1.default.getState().route.pathname === "/maker/record") {
        setTimeout(() => {
            (0, sound_1.setupSound)();
        }, 1000);
    }
    (0, actions_1.findMissingDependencies)();
    (0, actions_1.refreshRows)();
});
exports.load = load;
