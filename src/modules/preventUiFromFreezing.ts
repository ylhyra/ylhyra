/**
 * Prevents user interface from freezing while doing heavy calculations.
 */
export const preventUiFromFreezing = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};
