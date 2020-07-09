// export TESTING=true && node project/server/translator/BatchSave.js

const axios = require('axios')
require('./../../frontend/App/functions/array-foreach-async')

const url = process.env.TESTING ? 'http://localhost:9123' : 'https://ylhyra.is'

let done = 0
const run = async (apcontinue = '') => {
  const page_list = (await axios.get(`https://ylhyra.is/api.php?action=query&format=json&list=allpages&apnamespace=3000&aplimit=20&apcontinue=${apcontinue}`)).data

  await page_list.query.allpages.forEachAsync(async (data_info) => {
    const datapageid = data_info.pageid
    const datatitle = data_info.title
    await new Promise(async resolve => {
      const title = datatitle.replace(/^Data:/, '')
      const info = (await axios.get(`https://ylhyra.is/api.php?action=query&format=json&titles=${title}&prop=info`)).data
      let pageid, ns

      Object.keys(info.query.pages).forEach(id => {
        pageid = info.query.pages[id].pageid
        ns = info.query.pages[id].ns
      })

      /* Only mainspace and textspace */
      if (![0, 3004].includes(ns)) return resolve();

      const data = (await axios.get(`https://ylhyra.is/index.php?title=${datatitle}&action=raw&ctype=text/json&random=${Math.random()}`)).data

      await axios.put(`${url}/api/save`, {
        data: {
          document_id: pageid,
          ...data
        }
      })
      console.log(title)

      // done++
      // console.log(`Done: ${done}`)

      // console.log(url)
      // process.exit()
      resolve()
    })
  })

  if (page_list.continue?.apcontinue) {
    run(page_list.continue.apcontinue)
  }
}

run()
