import query from 'common/database/tagger'

export default (input) => {
  input = input.toLowerCase().trim()
  return new Promise(resolve => {
    if (input.length < 50) {
      query('SELECT file FROM sounds WHERE text = ?', [input], (error, results) => {
        if (error) throw error
        const files = results.map(i => i.file).map(i => {
          if (i.startsWith('islex/')) {
            return 'https://media.egill.xyz/audio/' + i
          }
          // TODO We must find appropiate URLs for the others.
          return i
        })
        resolve(files)
      })
    } else {
      resolve()
    }
  })
}
