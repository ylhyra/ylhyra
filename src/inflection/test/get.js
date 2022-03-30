"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const get_by_id_1 = __importDefault(require("inflection/server/server-standalone/get_by_id"));
const word_1 = __importDefault(require("inflection/tables/word"));
/*
  Testing helper function
  Callback is a Word
*/
let cache = {};
const get = (id, done, input_function, dont_keep_in_cache) => {
    if (cache[id]) {
        try {
            input_function(new word_1.default(cache[id]));
        }
        catch (error) {
            done(error);
        }
    }
    else {
        (0, get_by_id_1.default)(id, (server_results) => {
            if (server_results === null) {
                throw new Error("Server request failed");
            }
            if (!dont_keep_in_cache) {
                cache[id] = server_results;
            }
            try {
                input_function(new word_1.default(server_results));
            }
            catch (error) {
                console.log(error);
                done(error);
            }
        });
    }
};
exports.get = get;
