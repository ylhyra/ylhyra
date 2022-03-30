"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Documentation:
  https://ylhyra.is/Software:Suggestions
*/
const suggestions = (state = {}, action) => {
    let update = {};
    switch (action.type) {
        case "LOAD_EDITOR":
            return action.content.suggestions || {};
        case "SUGGEST":
            /* Suggest translation */
            Object.keys(action.content).forEach((id) => {
                update[id] = [...(state[id] || []), ...(action.content[id] || [])];
            });
            return Object.assign(Object.assign({}, state), update);
        // case 'SUGGEST_ANALYSIS':
        //   /* Suggest analysis */
        //   action.suggestions.forEach(item => {
        //
        //   })
        //   return {
        //     ...state,
        //     ...update,
        //   }
        case "GOOGLE_TRANSLATE":
            Object.keys(action.translation).forEach((id) => {
                update[id] = [
                    ...(state[id] || []),
                    {
                        definition: {
                            meaning: action.translation[id],
                        },
                    },
                ];
            });
            return Object.assign(Object.assign({}, state), update);
        default:
            return state;
    }
};
exports.default = suggestions;
