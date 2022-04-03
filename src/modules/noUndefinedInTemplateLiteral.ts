/**
 * Uses tagged template literals to remove undefined
 */
export const c = (strings: any, ...values: any[]) =>
  strings
    .map((string: string, index: number) => {
      let value = values[index];
      if (Array.isArray(value)) {
        value = value.join("");
      }
      if (!value && value !== 0) {
        value = "";
      }
      return string + value;
    })
    .join("");
