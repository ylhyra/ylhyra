"use strict";
/*
  Step 1:
  Merge phrases into a single word
*/
Object.defineProperty(exports, "__esModule", { value: true });
let translation;
let removedIDs;
const init = (tree, _translation) => {
    translation = _translation;
    removedIDs = [];
    return Traverse(tree);
};
const Traverse = (input, siblings = []) => {
    if (!input)
        return input;
    const { node, tag, attr, child } = input;
    const id = (attr === null || attr === void 0 ? void 0 : attr.id) || null;
    if (node === "element" || node === "root") {
        if (tag === "word") {
            if (removedIDs.includes(id))
                return null;
            const definition = translation.definitions[translation.words[id]];
            return Object.assign(Object.assign({}, input), { attr: Object.assign(Object.assign({}, input.attr), { definition, appendText: findTextSiblings(siblings, id) }) });
        }
        else {
            return Object.assign(Object.assign({}, input), { child: child === null || child === void 0 ? void 0 : child.map((e) => Traverse(e, child)) });
        }
    }
    else if (node === "text") {
        if (removedIDs.includes(id))
            return null;
        return input;
    }
    return input;
};
const findTextSiblings = (siblings, startId) => {
    let listening = false;
    let returnString = "";
    siblings.forEach((element) => {
        if (!element)
            return;
        if (removedIDs.includes(element.attr.id))
            return;
        if (element.attr.id === startId) {
            listening = true;
        }
        else if (listening) {
            if (element.node === "text" && !element.text.startsWith(" ")) {
                returnString += element.text;
                removedIDs.push(element.attr.id);
            }
            else {
                listening = false;
            }
        }
    });
    return returnString;
};
exports.default = init;
