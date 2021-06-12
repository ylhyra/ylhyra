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

export const section_id = (title) => {
  if (!title) return title;
  return 's-' + URL_title(title)
    .replace(/([^a-z0-9])/g, '-')
}
