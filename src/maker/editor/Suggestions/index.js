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
exports.applySuggestions = exports.receiveSuggestions = exports.MakeSuggestions = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const error_1 = __importDefault(require("app/app/error"));
const store_1 = __importDefault(require("app/app/store"));
const web_socket_1 = require("maker/editor/web-socket");
/*

  TODO Check if suggestions are needed before sending

*/
const MakeSuggestions = () => {
    const { list, tokenized, suggestions, translation } = store_1.default.getState().editor;
    // Information is sent through a WebSocket
    console.log("%c [Requesting suggestions...]", "color: RoyalBlue");
    var api = new mw.Api();
    api
        .get({
        action: "session_verification",
        format: "json",
    })
        .done(function (data) {
        const session_verification_token = data.session_verification.token;
        if (!session_verification_token) {
            (0, error_1.default)("Server could not verify that you are logged in");
            return console.log(data);
        }
        (0, web_socket_1.send)({
            type: "REQUEST_SUGGESTIONS",
            list: list,
            tokenized,
            suggestions,
            translation,
            session_verification_token,
            // from: metadata.from,
            // to: metadata.to,
        });
    });
};
exports.MakeSuggestions = MakeSuggestions;
const receiveSuggestions = (action) => __awaiter(void 0, void 0, void 0, function* () {
    /* Suggest analysis */
    let grammatical_analysis = {};
    store_1.default.getState().list.arrayOfAllWordIDs.forEachAsync(() => {
        return new Promise(() => __awaiter(void 0, void 0, void 0, function* () { }));
    });
    yield action.analysis.forEachAsync((item) => {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            /* Temporary, only allow one word at a time */
            if (!item.ids || item.ids.length > 1)
                return resolve();
            const id = item.ids[0];
            if (!id)
                return resolve();
            const analysis = item.analysis[0].analysis;
            const data = (yield axios_1.default.post(`/api/inflection/find_inflection_id`, {
                analysis: item.analysis[0],
            })).data;
            /*
              TODO: Currently only fetches one match.
              Should show more bin leaf matches and ALSO more options inside each word
            */
            const BIN_id = data.length > 0 && data[0].BIN_id;
            grammatical_analysis[id] = Object.assign(Object.assign({}, analysis), { BIN_id });
            resolve();
        }));
    });
    store_1.default.dispatch({
        type: "GRAMMATICAL_ANALYSIS",
        grammatical_analysis,
    });
});
exports.receiveSuggestions = receiveSuggestions;
const applySuggestions = () => {
    const { list, translation, suggestions } = store_1.default.getState().editor;
    for (let id of Object.keys(suggestions)) {
        if (!(id in translation.words) && !(id in translation.sentences)) {
            if (id in list.words) {
                store_1.default.dispatch({
                    type: "UPDATE_DEFINITION",
                    definition: suggestions[id][0].definition,
                    selected: [id], // TODO!! "INCLUDES OTHER WORDS"
                });
            }
            else {
                store_1.default.dispatch({
                    type: "UPDATE_SENTENCE",
                    content: suggestions[id][0].definition,
                    sentence_id: id,
                });
            }
        }
    }
};
exports.applySuggestions = applySuggestions;
