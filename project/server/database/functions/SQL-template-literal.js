import { escape } from 'sqlstring'

/*
  Uses tagged template literals to escape strings for SQL.
  > sql`SELECT ${X} FROM ${Y}` becomes `SELECT ${escape(X)} FROM ${escape(Y)}`
  See: https://mxstbr.blog/2016/11/styled-components-magic-explained/
*/
export default (strings, ...values) => strings
  .map((string, index) => {
    let value = values[index] || ''
    if(typeof values[index] === undefined || values[index] === null) {
      value = null
    }
    if(index !== strings.length - 1) {
      value = escape(value)
    }
    return string.replace(/--.+?\n/g, '\n') /*Removing comments*/ + value
  })
  .join('')



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
