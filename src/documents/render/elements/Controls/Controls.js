"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exists_1 = __importDefault(require("app/app/functions/exists"));
exports.default = (audioId, tree) => {
    // // let hasAudio = input.audio.file // TODO Update audio setup.
    // let needsAssist = CheckIfAssistIsNeeded(tree)
    // if (hasAudio || needsAssist) {
    //   return (
    //     <div className="controls">
    //       {AudioPlayer(input)}
    //       {needsAssist && (
    //         <div className="assistOnOff checkbox"
    //           data-checked="true"
    //           onClick="window.assistOnOff(this)"
    //           onTouchStart="window.assistOnOff(this)"
    //           >
    //           <span>Assist</span>
    //         </div>
    //       )}
    //     </div>
    //   )
    // }
    return null;
};
/*
  The "Assist ON / OFF" toggle is only needed when:
    - A word is marked DIFFICULT
    - A word has INLINE TRANSLATION
*/
const CheckIfAssistIsNeeded = (tree) => {
    let needed = false;
    const Traverse = (input, index = 0) => {
        if (!input)
            return null;
        const { node, tag, attr, child, text } = input;
        if (node === "element" || node === "root") {
            if (tag === "word") {
                const { definition } = attr;
                if ((0, exists_1.default)(definition) &&
                    (definition.difficult || definition.show_definition_above)) {
                    needed = true;
                }
            }
            else {
                !needed && (child === null || child === void 0 ? void 0 : child.map((e, i) => Traverse(e, i)));
            }
        }
    };
    Traverse(tree);
    return needed;
};
