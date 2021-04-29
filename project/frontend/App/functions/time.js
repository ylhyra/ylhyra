// const roundMsToHours = (input) => {
//   return round(
//     input,
//     (1000 /* ms */ * 60 /* s */ * 60 /* m */ * 60 /* hours */ ).toFixed(0).length
//   )
// }
//
const msInHour = 1000 * 60 * 60
const msInDay = msInHour * 24

export const round = (input, zeroes) => {
  const i = 10 ** zeroes
  return Math.round(input / i) * i
}

export const daysToMs = (input) => input * msInDay
export const msToS = (input) => Math.round(input / 1000)
export const roundMsToHour = (input) => Math.round(input / msInHour) * msInHour
