import React, { lazy } from 'react';

const customTemplates = [
  'Level',
  'Book',
  'Blær',
]

const customTemplatesLoaded = {}
const customTemplatesLowercase = {}
customTemplates.forEach(x => {
  customTemplatesLoaded[x] = lazy(() =>
    import (`documents/Templates/${x}`))
  customTemplatesLowercase[x.toLowerCase()] = x
})
const GetTemplate = (name) => {
  if (name.toLowerCase() in customTemplatesLowercase) {
    return customTemplatesLoaded[customTemplatesLowercase[name.toLowerCase()]]
  }
  return null
}
export default GetTemplate