/**
 * Helper function to spread classes across multiple files
 * @param classToExtend
 * @param {...Object} objectsContainingFunctions
 *   Functions loaded from another file as require()
 */
export const extendPrototype = (
  classToExtend,
  ...objectsContainingFunctions
) => {
  objectsContainingFunctions.forEach((_functions) => {
    for (let [key, value] of Object.entries(_functions)) {
      classToExtend.prototype[key] = value;
    }
  });
};
