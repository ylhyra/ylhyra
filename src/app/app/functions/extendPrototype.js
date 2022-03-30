"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendPrototype = void 0;
/**
 * Helper function to spread classes across multiple files
 * @param classToExtend
 * @param {...Object} objectsContainingFunctions
 *   Functions loaded from another file as require()
 */
const extendPrototype = (classToExtend, ...objectsContainingFunctions) => {
    objectsContainingFunctions.forEach((_functions) => {
        for (let [key, value] of Object.entries(_functions)) {
            classToExtend.prototype[key] = value;
        }
    });
};
exports.extendPrototype = extendPrototype;
