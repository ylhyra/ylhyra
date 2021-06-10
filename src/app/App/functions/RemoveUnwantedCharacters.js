export default (input) => {
  if (!input) return input;
  return input
    .replace(/\u160/g, ' ') // NBSP
    .replace(/\u8206/g, '') // LTR mark
    .replace(/\u00AD/g, '') // Soft hhyphen
}
