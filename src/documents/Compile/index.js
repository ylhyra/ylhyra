import markdown_to_html from './markdown_to_html'
import transclude from './transclude'
import images from './images'

export default async(title) => {
  // console.log(title)
  let { output, header } = await transclude(title)
  // console.log(output)
  if (!output) {
    throw new Error('No output from transclude, possibly files have been changed since last link compilation ')
  }
  output = await images(output)
  output = markdown_to_html(output)
  // console.log(output)
  return { content: output, header }
}

// new Promise((resolve, reject) => {
