import axios from 'User/App/axios'

/*
  Hér er hægt að sjá leiðbeiningar um hvað hægt er að biðja GoogleTranslate um:
  https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params
*/
export default async function({ input, sentenceSuggestions, sourceLang, targetLang }) {

  /*
    Single word
  */
  const suggestions = await GoogleTranslate(input, sourceLang, targetLang)
  //   console.log(suggestions)
  // return;
  /*
    Find translation in context
    (done by surrounding word by brackets)
  */
  // const inContext = (await GoogleTranslate(TextInContext, sourceLang, targetLang, true))
  // .map(text => {
  //   return text.split(/<i>(.*?)<\/i>/g).filter((e, i) => i % 2).join(' ').trim()
  // })

  let goodFitInContext = []
  if (sentenceSuggestions) {
    // console.log(sentenceSuggestions)
    sentenceSuggestions.forEach(sentence => {
      suggestions.forEach(word => {
        if (sentence.indexOf(word) >= 0) {
          goodFitInContext.push(word)
        }
      })
    })
  }

  return [
    ...goodFitInContext,
    ...suggestions,
  ].filter(i => i)
}


const GoogleTranslate = async (sourceText, sourceLang, targetLang, isInContext = false) => {
  sourceText = (sourceText || '').trim()
  // console.log(sourceText)
  if (!sourceText) return []
  console.log(sourceText)

  // return new Promise(async resolve => {
  //   try {
  //     const key = sourceLang + targetLang + '-' + sourceText + '-google' + (isInContext ? '1' : '')
  //
  //     if (localStorage.getItem(key)) {
  //       resolve(JSON.parse(localStorage.getItem(key)))
  //       return
  //     }
  //
  //     let translation
  //
  //     if (!isInContext) {
  //
  //       const content = (await axios.get(
  //         `https://translate.googleapis.com/translate_a/single?client=gtx` +
  //         `&sl=${sourceLang}` +
  //         `&tl=${targetLang}` +
  //         `&dt=t` +
  //         `&dt=at` +
  //         `&q=${encodeURIComponent(sourceText)}`)).data
  //
  //       // console.warn(content)
  //       translation = [content[0][0][0]] || []
  //
  //       const alternateTranslations = content[5][0][2].map(i => i[0])
  //       if (!isInContext && alternateTranslations && alternateTranslations.length > 0) {
  //         translation = alternateTranslations
  //       }
  //
  //     } else {
  //       translation = (await axios.post('/api/translate/GoogleTranslate', {
  //         sourceText,
  //         sourceLang,
  //         targetLang
  //       })).data
  //       console.log(translation)
  //     }
  //
  //     localStorage.setItem(key, JSON.stringify(translation))
  //
  //     /*
  //       We do not want to flood the Google Translate API, it will block us.
  //     */
  //     setTimeout(()=>{
  //       resolve(translation)
  //     }, 1000)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // })
}
