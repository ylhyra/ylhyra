"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Hér er hægt að sjá leiðbeiningar um hvað hægt er að biðja GoogleTranslate um:
  https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params
*/
function default_1({ input, sentenceSuggestions, sourceLang, targetLang, }) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
          Single word
        */
        const suggestions = yield GoogleTranslate(input, sourceLang, targetLang);
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
        let goodFitInContext = [];
        if (sentenceSuggestions) {
            // console.log(sentenceSuggestions)
            sentenceSuggestions.forEach((sentence) => {
                suggestions.forEach((word) => {
                    if (sentence.indexOf(word) >= 0) {
                        goodFitInContext.push(word);
                    }
                });
            });
        }
        return [...goodFitInContext, ...suggestions].filter((i) => i);
    });
}
exports.default = default_1;
const GoogleTranslate = (sourceText) => __awaiter(void 0, void 0, void 0, function* () {
    sourceText = (sourceText || "").trim();
    // console.log(sourceText)
    if (!sourceText)
        return [];
    console.log(sourceText);
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
    //       if (!isInContext && alternateTranslations?.length > 0) {
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
});
