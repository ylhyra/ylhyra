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
exports.IsAvailableOnGoogleTranslate = void 0;
const store_1 = __importDefault(require("app/app/store"));
const GoogleTranslate_1 = __importDefault(require("maker/editor/Suggestions/previous/GoogleTranslate/GoogleTranslate"));
const languages_1 = require("server/datasets/languages");
// import { saveEditor } from 'Editor/actions'
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    return;
    const { suggestions, list, translation } = store_1.default.getState().editor;
    const { items, arrayOfAllItemIDs } = list;
    // const { from, to } = store.getState().editor.metadata
    // const sourceLang = get_ISO_639_1(from)
    // const targetLang = get_ISO_639_1(to)
    // if (!IsAvailableOnGoogleTranslate(from, to)) return;
    const sourceLang = "is";
    const targetLang = "en";
    // return;
    /*
      Loop over all items (words & wentences)
    */
    yield arrayOfAllItemIDs
        .filter((id) => !(id in suggestions))
        .filter((id) => !(id in translation.words) && !(id in translation.sentences))
        // .slice(0, 5)
        .forEachAsync((id) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            const translations = yield (0, GoogleTranslate_1.default)({
                input: items[id].text,
                sourceLang,
                targetLang,
                // sentenceSuggestions: editor.suggestions[items[itemID].belongsToSentence] // TODO ADD AGAIN
            });
            if (translations) {
                /*
                  Save suggestions
                */
                store_1.default.dispatch({
                    type: "SUGGEST",
                    content: {
                        [id]: translations.map((translation) => ({
                            definition: {
                                meaning: translation,
                            },
                        })),
                    },
                });
            }
            resolve();
        }));
    }));
    // saveEditor()
});
/*
  TODO:
  List of available languages isn't finished.
*/
const IsAvailableOnGoogleTranslate = (from, to) => {
    const AvailableLanguages = [
        "en",
        "is",
        "de",
        "es",
        "fr",
        "da",
        "sv",
        "no",
        "af",
        "sq",
        "am",
        "ar",
        "hy",
        "az",
        "eu",
        "be",
        "bn",
        "bs",
        "bg",
        "ca",
        "TODO!! FINISH LIST",
    ];
    return ((0, languages_1.get_ISO_639_1)(from) &&
        (0, languages_1.get_ISO_639_1)(to) &&
        AvailableLanguages.includes((0, languages_1.get_ISO_639_1)(from)) &&
        AvailableLanguages.includes((0, languages_1.get_ISO_639_1)(to)));
};
exports.IsAvailableOnGoogleTranslate = IsAvailableOnGoogleTranslate;
