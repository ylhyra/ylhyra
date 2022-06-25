/** Prevents user interface from freezing while doing heavy calculations. */
export async function preventUiFromFreezing() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
