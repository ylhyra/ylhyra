import markdown_to_html from './markdown_to_html'
import transclude from './transclude'
import images from './images'

export default async(title) => {
  // console.log(title)
  let output = await transclude(title)
  // console.log(output)
  if (!output) return null;
  output = await images(output)
  output = markdown_to_html(output)
  // console.log(output)
  return output
}

// new Promise((resolve, reject) => {
