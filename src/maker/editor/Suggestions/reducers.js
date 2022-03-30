"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysis = exports.suggestions = void 0;
const suggestions = (state = {}, action) => {
    var _a;
    let update = {};
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            // console.warn(action)
            return ((_a = action.currentDocumentData) === null || _a === void 0 ? void 0 : _a.suggestions) || {};
        case "SUGGEST":
            /* Suggest translation */
            Object.keys(action.definitions).forEach((id) => {
                update[id] = [...(state[id] || []), ...(action.definitions[id] || [])];
            });
            return Object.assign(Object.assign({}, state), update);
        default:
            return state;
    }
};
exports.suggestions = suggestions;
const analysis = (state = {}, action) => {
    var _a;
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            return ((_a = action.currentDocumentData) === null || _a === void 0 ? void 0 : _a.analysis) || {};
        case "GRAMMATICAL_ANALYSIS":
            return Object.assign(Object.assign({}, state), action.grammatical_analysis);
        default:
            return state;
    }
};
exports.analysis = analysis;
/*
Analysis is returned on the form:

[{
 "ids": ["w_t7ra1"],
 "analysis": [{
   "text": "Við",
   "analysis": {
     "part_of_speech": "pfn",
     "inflection_form": "NFFT",
     "context_free_grammar": "pfn_ft_nf",
     "base_word": "ég",
     "type": "WORD"
   }
 }]
}, {
 "ids": ["w_t7ra2"],
 "analysis": [{
   "text": "sjáumst",
   "analysis": {
     "part_of_speech": "so",
     "inflection_form": "MM-FH-NT-1P-FT",
     "context_free_grammar": "so_0_ft_p1",
     "base_word": "sjá",
     "type": "WORD"
   }
 }]
}]
*/
