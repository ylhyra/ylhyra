"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const UpdateID_1 = require("documents/parse/Compiler/1_Precompile/UpdateID");
// /*
//   [optional] Temporarily mute the audio in development
// */
// const muted = false
exports.default = (audioId, inlineAudioPlayer, editor) => {
    var _a, _b, _c;
    const { audio } = editor;
    const hash = (_b = (_a = audio.sections) === null || _a === void 0 ? void 0 : _a.find((section) => section.audioElementId === audioId)) === null || _b === void 0 ? void 0 : _b.hash;
    if (!hash) {
        // console.warn(`No hash for ${audioId}`)
        return null;
    }
    const file = (_c = audio.files[hash]) === null || _c === void 0 ? void 0 : _c.filename;
    const sync = audio.sync[hash];
    if (!file) {
        // console.warn(`No file for ${audioId}`)
        // console.warn({ hash, audio })
        return null;
    }
    let props = {};
    if (inlineAudioPlayer === true || inlineAudioPlayer === "true") {
        props["data-inline"] = true;
    }
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "audioContainer", "data-id": audioId, "data-synchronization-list": sync && JSON.stringify(updateIDs(sync.list)), "data-src": `/media/${file}?v=1` }, props))
    // <div className="audioPlayer">
    //   <audio
    //     data-id={audioId}
    //     data-synchronization-list={sync && JSON.stringify(updateIDs(sync.list))}
    //     // xxautoplay
    //     // xxcontrols
    //     // xxpreload="auto"
    //     // ${muted && process.env.NODE_ENV !== 'production' ? 'muted' : ''}
    //     >
    //     <source onError="window.audioLoadError()" src={`/media/${file}?v=1`} type="audio/mp3"/>
    //   </audio>
    //   <div className="audioPlayButton"></div>
    //   <div className="loader"></div>
    //   <div className="form-error"><span>Audio file missing.</span></div>
    //   <div className="time-wrapper">
    //     <span className="currentTime">-:--</span>
    //     <div className="slider-wrapper">
    //       <div className="slider-background"></div>
    //       <div className="slider-progress-indicator"></div>
    //       <div className="slider-playhead-container">
    //         <div className="slider-playhead"></div>
    //       </div>
    //     </div>
    //     <span className="duration">-:--</span>
    //   </div>
    // </div>
    );
};
const updateIDs = (input) => {
    return input.map((i) => (Object.assign(Object.assign({}, i), { elements: i.elements.map((id) => (0, UpdateID_1.getUpdatedID)(id)) })));
};
