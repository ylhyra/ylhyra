"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (state = {
    soundList: [],
    sounds: {}, // Shorter sound bites
}, action) => {
    var _a;
    switch (action.type) {
        case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
            if ((_a = action.currentDocumentData) === null || _a === void 0 ? void 0 : _a.short_audio) {
                return action.currentDocumentData.short_audio;
            }
            return state;
        case "UPDATE_DEFINITION":
            return Object.assign(Object.assign({}, state), { areSoundsUpdated: false });
        case "SOUND_BITE_LIST":
            return Object.assign(Object.assign({}, state), { areSoundsUpdated: true, soundList: action.soundList, wordID_to_text: action.wordID_to_text });
        case "SOUND_BITE_IS_UPDATED":
            return Object.assign(Object.assign({}, state), { areSoundsUpdated: true });
        case "SOUND":
            return Object.assign(Object.assign({}, state), { sounds: Object.assign(Object.assign({}, state.sounds), action.sound) });
        case "SOUND_BITE_FILE": // Recorder
            return Object.assign(Object.assign({}, state), { sounds: Object.assign(Object.assign({}, state.sounds), { [action.word]: [
                        action.filename,
                        ...(state.sounds[action.word] || []),
                    ] }) });
        default:
            return state;
    }
};
