"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.includesAny = void 0;
const react_1 = require("react");
const error_1 = require("app/app/error");
const html2json_1 = require("app/app/functions/html2json");
const store_1 = __importDefault(require("app/app/store"));
const server_1 = __importDefault(require("react-dom/server"));
/*
  Allows just a single audio file
*/
exports.default = () => {
    const { parsed } = store_1.default.getState().editor;
    if (!parsed) {
        return (0, error_1.notify)("There is no {parsed} for Long audio. Consider turning off server-side rendering.");
    }
    /*
      TEMPORARY SOLUTION.
      EXTREMELY HACKY.
      We are using some components in the Compile() stage that need to be rendered for this to work.
    */
    const json = (0, html2json_1.html2json)(server_1.default.renderToStaticMarkup(parsed));
    let done;
    // console.log(json2html(parsed))
    findAreasWithAudioFile(json, (node, filename) => {
        if (done) {
            (0, error_1.notify)("Only one audio area can be used at a time, for multiple uses you must transclude them.");
        }
        else {
            done = true;
            // console.log(JSON.stringify(node, null, 2))
            // return
            const XML = AudioXML(node);
            // console.log(done)
            //       console.log(XML)
            // return
            const output = server_1.default.renderToStaticMarkup(XML).replace(/(<\/div>)/g, "</div>\n");
            console.log({ output });
            if (!output || !/<(span|div)/.test(output)) {
                return (0, error_1.notify)("Could not create audio XML, no spans found. Check Long_audio/actions.js");
            }
            if (XML) {
                store_1.default.dispatch({
                    type: "AUDIO_AREA",
                    filename,
                    content: output,
                });
            }
        }
    });
};
const findAreasWithAudioFile = (i, callback) => {
    if (!i)
        return;
    if (Array.isArray(i)) {
        return i.map((x) => findAreasWithAudioFile(x, callback));
    }
    else {
        let { attr, child } = i;
        if (child) {
            if (attr && attr["data-audio-file"]) {
                // console.warn('------')
                // console.warn(child)
                callback(child, attr["data-audio-file"]);
            }
            else {
                child.forEach((x) => findAreasWithAudioFile(x, callback));
            }
        }
    }
};
/*
  Prepare an XML file for audio synchronization.
  Only leaves id tags on sentences and words.
*/
const AudioXML = (input, index = 0) => {
    //   console.log((input))
    // return
    if (!input)
        return null;
    if (Array.isArray(input)) {
        return input.map((x) => AudioXML(x));
    }
    else {
        const { node, tag, attr, child, text } = input;
        // console.log(input)
        // console.log(JSON.stringify(input))
        if (node === "element" || node === "root") {
            if (attr &&
                ("data-no-audio" in attr ||
                    "data-type" in attr ||
                    "data-children" in attr ||
                    "data-not-text" in attr))
                return null;
            if ((0, exports.includesAny)(skipTags, tag))
                return null;
            if (tag === "sup")
                return null;
            // if (attr && includesAny(skipClasses, attr.class)) return null;
            // console.log(attr)
            let attrs = {};
            let Tag = tag || "span";
            if (attr && "data-will-have-audio" in attr) {
                // console.log(input)
                Tag = "span";
                attrs = {
                    id: attr === null || attr === void 0 ? void 0 : attr.id,
                };
                if (attrs.id.startsWith("s")) {
                    Tag = "div";
                }
                // TEMPORARY; TURNING OFF WORDS!
                else {
                    attrs.id = null;
                }
            }
            if (tag === "root") {
                return child.map((e, i) => AudioXML(e, i));
            }
            if (!child || child.length === 0)
                return null;
            // console.log(attrs)
            if (attrs.id) {
                return ((0, react_1.createElement)(Tag, Object.assign({}, attrs, { key: index }), child === null || child === void 0 ? void 0 : child.map((e, i) => AudioXML(e, i))));
            }
            else {
                return child === null || child === void 0 ? void 0 : child.map((e, i) => AudioXML(e, i));
            }
        }
        else if (node === "text") {
            return text;
        }
    }
};
// const skipClasses = [
//   'data-sou',
// ]
const skipTags = ["data-no-audio", "data-ignore"];
const includesAny = (haystack, arr) => {
    if (!arr)
        return false;
    if (typeof arr === "string") {
        arr = [arr];
    }
    return arr.some((v) => {
        return haystack.indexOf(v) >= 0;
    });
};
exports.includesAny = includesAny;
