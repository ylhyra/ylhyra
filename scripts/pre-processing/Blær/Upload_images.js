(function() {
  let articleURL = 'https://blaer.is/grein/vinkonur';
  let title = 'Blær – Vinkonur vors og blóma';
  var txt = document.editform.wpTextbox1
  var value = txt.value
  let split = value.split(/(https?:\/\/blaer.is\/[^" ]+)/g)

  let targetLength = split.map((x, i) => (i % 2 !== 0)).filter(Boolean).length
  let currentLength = 0
  let oldToNewTitles = {}

  function checkIfDone() {
    if (currentLength === targetLength) {
      const output = split.map((fileURL, index) => {
        if (index % 2 === 0) return fileURL;
        return oldToNewTitles[fileURL] || fileURL;
      }).join('')
      // console.log(output)
      txt.value = output
    }
  }

  split.forEach((fileURL, index) => {
    if (index % 2 === 0) return fileURL;
    // console.log(fileURL)
    // return 'haha'

    var api = new mw.Api()
    api.postWithToken('csrf', {
      filename: title + ' ' + Math.round(Math.random() * 100000),
      text: `{{c}} Blær – ${articleURL}`,
      url: fileURL,
      action: 'upload',
      ignorewarnings: '1',
      format: 'json'
    }).done(function(data) {
      const newFileURL = `https://ylhyra.is/Special:Filepath/${data.upload.filename}`
      oldToNewTitles[fileURL] = newFileURL
      currentLength++
      console.log(`Uploaded ${newFileURL}. Done ${currentLength} of ${targetLength}`)
      checkIfDone()
    }).fail(function(error) {
      if (error === 'fileexists-no-change') return;
      console.error(`Could not upload ${fileURL}`)
      console.error(error)
      oldToNewTitles[fileURL] = fileURL
      currentLength++
      checkIfDone()
    })
  })
})()
