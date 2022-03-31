/*
  Uses tagged template literals to remove undefined
*/
export default (strings, ...values) =>
  strings
    .map((string, index) => {
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
