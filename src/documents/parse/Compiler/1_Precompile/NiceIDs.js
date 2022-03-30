"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateID_1 = require("documents/parse/Compiler/1_Precompile/UpdateID");
/*

  The IDs were long random strings, but are here converted into:
  "[documentID]_[serial]"

*/
let serial;
let document_id;
function init(input, id) {
    document_id = id;
    serial = 0;
    input = NiceIDs(input);
    input = UpdateReferencedIDs(input);
    return input;
}
exports.default = init;
const NiceIDs = (input) => {
    if (!input)
        return input;
    const { tag, attr, child } = input;
    const id = (attr === null || attr === void 0 ? void 0 : attr.id) || null;
    if (tag === "sentence" || tag === "word") {
        return Object.assign(Object.assign({}, input), { child: child === null || child === void 0 ? void 0 : child.map((e) => NiceIDs(e)), attr: Object.assign(Object.assign({}, attr), { id: id &&
                    (0, UpdateID_1.updateID)(id, `i${serial++}`
                    // `${document_id}_${serial++}`
                    ) }) });
    }
    return Object.assign(Object.assign({}, input), { child: child === null || child === void 0 ? void 0 : child.map((e) => NiceIDs(e)) });
};
/*
  Here we update the IDs in "definition.contains"
*/
const UpdateReferencedIDs = (input, idsToOutput) => {
    var _a;
    if (!input)
        return input;
    const { tag, attr, child } = input;
    const id = (attr === null || attr === void 0 ? void 0 : attr.id) || null;
    const definition = (attr === null || attr === void 0 ? void 0 : attr.definition) || null;
    if (tag === "sentence" || tag === "word") {
        return Object.assign(Object.assign({}, input), { child: child === null || child === void 0 ? void 0 : child.map((e) => UpdateReferencedIDs(e, idsToOutput)), attr: Object.assign(Object.assign({}, attr), { definition: definition && Object.assign(Object.assign({}, definition), { contains: (_a = definition.contains) === null || _a === void 0 ? void 0 : _a.map(UpdateID_1.getUpdatedID) }) }) });
    }
    return Object.assign(Object.assign({}, input), { child: child === null || child === void 0 ? void 0 : child.map((e) => UpdateReferencedIDs(e, idsToOutput)) });
};
