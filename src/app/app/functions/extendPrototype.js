/**
 * Helper function to spread classes across multiple files
 */
export const extendPrototype = (classToExtend, ...arrayOfObjects) => {
  arrayOfObjects.forEach((_functions) => {
    for (let [key, value] of Object.entries(_functions)) {
      classToExtend.prototype[key] = value;
    }
  });
};
