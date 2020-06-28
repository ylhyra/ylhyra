export default (input) => {
  return input
    .toLowerCase()
    .replace(/[.,'-/"\\!]/g, '')
    .replace(/\s+/, ' ')
    .trim()
}
