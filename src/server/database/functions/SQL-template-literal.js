"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlstring_1 = require("sqlstring");
/*
  Uses tagged template literals to escape strings for SQL.
  > sql`SELECT ${X} FROM ${Y}` becomes `SELECT ${escape(X)} FROM ${escape(Y)}`
  See: https://mxstbr.blog/2016/11/styled-components-magic-explained/
*/
exports.default = (strings, ...values) => strings
    .map((string, index) => {
    let value = values[index];
    if (value === "") {
    }
    else if (values[index] === null) {
        value = null;
    }
    else if (value === false) {
        value = 0;
    }
    else if (!value && value !== 0) {
        value = ""; // ?
    }
    if (index !== strings.length - 1) {
        value = (0, sqlstring_1.escape)(value);
    }
    return string.replace(/--.+?\n/g, "\n") /*Removing comments*/ + value;
})
    .join("");
// export default (strings, ...values) => {
//   return strings
//     .map((string, index) => {
//       const value = values[index] || ''
//       // const shouldEscape = value.dontEscape || false
//       return string + escape(values[index] || '')
//     })
//     .join('')
// }
//
// // export const dontEscape = (input) => {
// //   return {
// //     dontEscape: true,
// //     input: input,
// //   }
// // }
