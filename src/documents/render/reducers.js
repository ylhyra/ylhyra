"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const data = (state = {}, action) => {
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            return action.data || state;
        // return flattenData(action.data)
        default:
            return state;
    }
};
exports.data = data;
