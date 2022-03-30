"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDeckFromFile = void 0;
const deck_1 = __importStar(require("app/vocabulary/actions/deck"));
const fs_1 = __importDefault(require("fs"));
const initializeDeckFromFile = () => {
    try {
        const database = JSON.parse(fs_1.default.readFileSync(__basedir + `/build/vocabulary/vocabulary_database.json`, "utf8"));
        new deck_1.default({ database });
        deck_1.deck.alternative_ids = JSON.parse(fs_1.default.readFileSync(__basedir + `/build/vocabulary/alternative_ids.json`, "utf8"));
    }
    catch (e) {
        new deck_1.default({});
        deck_1.deck.alternative_ids = {};
        console.log("No files to initialize from");
    }
};
exports.initializeDeckFromFile = initializeDeckFromFile;
