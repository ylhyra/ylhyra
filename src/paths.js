import path from 'path'
global.__basedir = path.resolve(__dirname + '/../')

/* Folders */
export const content_folder = path.resolve(__basedir, './../ylhyra_content')
export const output_folder = path.resolve(__basedir, './src/output')
export const image_output_folder = path.resolve(output_folder, './images')

/* File URLs */
export const contentUrl = '/api/content'
export const processed_image_url = `/api/images`
export const unprocessed_image_url = `/api/images2`
export const getDynamicFileUrl = (file) => `/api/content?title=file/${encodeURIComponent(file)}`
export const get_processed_image_url = (file) => `${processed_image_url}/${encodeURIComponent(file)}`
export const ylhyra_content_files = path.resolve(content_folder, './not_data/files')
export const get_unprocessed_image_url = (file) => `${unprocessed_image_url}/${encodeURIComponent(file)}`

/* URL slugs */
export const URL_title = (title) => {
  if (!title) return title;
  return title
    .toLowerCase()
    .trim()
    .replace(/([_ ])/g, '-')
    // .replace(/( )/g, '_')
    // .replace(/(#)/g, '_')
    .replace(/(\?)/g, '')
    .replace(/:/g, '/')
  return title
}

export const section_id = (title) => {
  if (!title) return title;
  return 's-' + URL_title(title)
    .replace(/([^a-z0-9])/g, '-')
}
