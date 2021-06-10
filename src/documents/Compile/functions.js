export const URL_title = (title) => {
  if (!title) return title;
  return title
    .toLowerCase()
    .trim()
    .replace(/([_ ])/g, '-')
    // .replace(/( )/g, '_')
    // .replace(/(#)/g, '_')
    .replace(/(\?)/g, '')
  return title
}
