/*
  ____                        _                   _
 |  _ \ __ _ _ __ ___  ___   (_)_ __  _ __  _   _| |_
 | |_) / _` | '__/ __|/ _ \  | | '_ \| '_ \| | | | __|
 |  __/ (_| | |  \__ \  __/  | | | | | |_) | |_| | |_
 |_|   \__,_|_|  |___/\___|  |_|_| |_| .__/ \__,_|\__|
                                     |_|

  Input:  HTML
  Output: JSON representation of HTML

  Sends this output to the next function,
  which will look for paragraphs in the text.

*/

import { html2json, json2html } from 'text-plugin/App/functions/html2json'
import markdown from 'marked'
import { AllHtmlEntities as Entities } from 'html-entities'
import ExtractData from './ExtractData'
import ExtractText from './ExtractText/ExtractText'
import Tokenizer from './Tokenize'
import WrapInTags from './WrapInTags'
import Compiler from './Compiler'
const entities = new Entities()
// import store from 'App/store'
import isEmpty from 'is-empty-object'



console.log(html2json(`<mw:editsection page="Ylhýra" section="1">Beginners course</mw:editsection></h2> <div class="grid"> <ul><li><a href="/Introduction" title="Introduction"><div class="frontpage-box"><div class="frontpage-box-title">Introduction </div><span class="frontpage-box-description">How to use this book • New letters </span></div></a></li> <li><a href="/Chapter_1" title="Chapter 1"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 1 </div><span class="frontpage-box-description">Is • The • Cases • Yes </span></div></a></li> <li><a href="/Chapter_2" title="Chapter 2"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 2 </div><span class="frontpage-box-description">Thanks • Good day • What? </span></div></a></li> <li><a href="/Chapter_3" title="Chapter 3"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 3 </div><span class="frontpage-box-description">Ha? • Að • ll • sæll • ég • ordering food • sko </span></div></a></li> <li><a href="/Chapter_4" title="Chapter 4"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 4 </div><span class="frontpage-box-description">Want • time • go • know • hérna </span></div></a></li></ul> </div> <ul><li><a href="/Vocabulary" title="Vocabulary">List of 2000 basic vocabulary words</a></li> <li><a href="/Category:Content" title="Category:Content">List of all pages</a></li></ul> <h2><span class="mw-headline" id="Read">Read</span><mw:editsection page="Ylhýra" section="2">Read</mw:editsection></h2> <p><code data-document-start="Magnús Jochum Pálsson/Pípulækningar" style="display:none"></code><span style="float:right" class="hidden user-show"><a rel="nofollow" class="external text" href="https://ylhyra.is/index.php?title=Magn%C3%BAs_Jochum_P%C3%A1lsson/P%C3%ADpul%C3%A6kningar&action=edit">Edit</a></span> </p> <div class="book" data-translate="true"> <p><b>Pípulækningar</b> </p><p>Ég hef misst allra trú á því að leita til lækna þegar eitthvað kemur fyrir mig. Ég fæ aldrei neinar útskýringar eða lækningu við þeim kvillum sem hrjá mig. Læknarnir yppa bara öxlum og segja mér að fara heim, sjá hvort ég lagist ekki. Síðan borga ég þeim svívirðilegar upphæðir fyrir ekkert. </p><p>Nýlega hef ég tekið upp á því að hringja í iðnaðarmenn í staðinn. Þannig get ég bæði látið gera við húsið og fengið læknisfræðilegt álit. Ég fékk til mín pípara í síðustu viku sem lagaði vaskinn og gaf mér helvíti góð ráð við bakverk sem var að plaga mig. </p> </div> <div style="float:right;max-width:400px;border:1px solid #BBB;background:#EEE;padding:10px;"> <p>This short story was published in the 2018 book "Óbreytt ástand" by Magnús Jóchum Pálsson. </p> </div> <div data-document-end="yes"></div> <p><code data-document-start="Magnús Jochum Pálsson/Ánamaðkar" style="display:none"></code><span style="float:right" class="hidden user-show"><a rel="nofollow" class="external text" href="https://ylhyra.is/index.php?title=Magn%C3%BAs_Jochum_P%C3%A1lsson/%C3%81nama%C3%B0kar&action=edit">Edit</a></span> </p> <div class="book" data-translate="true"> <p><b>Ánamaðkar</b> </p><p>Í dag hefur rignt klukkustundum saman. Stórir pollar þekja göturnar og moldin gegnsósa af vatni. Hamfaranna vegna neyðast ánamaðkarnir til að flýja heimili sín. Við tekur langt og strangt ferðalag. Felstir drukkna á leiðinni en einhverjir komast alla leið upp á yfirborðið. Þar bíða þeirra mun hræðilegri örlög en drukknun. </p><p>Á yfirborðinu taka á móti þeim litlir barnaputtar. Börnin hafa enga samúð með slepjulegum félögum sínum og hrifsa þá til sín. Síðan slíta þau maðkana í sundu eða kremja þá undir sólum kuldaskónna. </p> </div> <div data-document-end="yes"></div> <p><br /> </p> <div data-document-end="yes"></div>`))

/*
  Parser
*/
export default function({html, title, returns}) {
  if (!html) return null
  // console.log(html)
  try {
    html = entities.decode(html)
    html = html
      .replace(/[\s\n\r]+/g, ' ') // Ef þetta er fjarlægt virkar WrapInTags/SplitAndWrap ekki
      // .replace(/\u00AD/g,' ') //Soft-hyphens
      // .replace(/\u00A0/g,' ') //Non-breaking spaces
    let json = html2json(html)
    // json = json2html(html)
    // json = html2json(html)
    // console.log(json)
    // return json
    /* Debug: */
    // console.log(json2html(json))
    // console.log(json)
    // console.log(JSON.stringify(json,null,2))
    // console.log(html)
    // console.log(json2html(json))


    /*
      Is data already saved?
    */
    let data = ExtractData(json)
    // console.log(data)

    /*
      Extract text, group by documents
    */
    const text = ExtractText(json)
    if (isEmpty(text)) {
      // console.warn('No text to tokenize.')
      // json = html2json(entities.decode(json2html(json)))
      if(returns ==='html') {
        return html
      } else {
        return {parsed:json}
      }
      // return html2json(Compiler({ json: wrapped, data: data, }))
    }
    const tokenized = Tokenizer(text, data)
    const flattenedData = flattenData(data)
    // console.log(text)
    // console.log({
    //   text,
    //   tokenized,
    //   data,
    //   flattenedData,
    // })




    /*
      Merge tokenization and HTML (does not include data).
      Returns wrapped HTML without data
    */
    // console.log(json2html(json))
    const wrapped = WrapInTags({ json, tokenized })
    // console.log(json2html(wrapped))
    let compiled = Compiler({ json: wrapped, data: flattenedData })
    // compiled = entities.decode(compiled)
    // console.log(compiled)
    // console.log(compiled)
    if(returns ==='html') {
      return compiled
    } else {
      return {parsed: html2json(compiled), tokenized, data, flattenedData}
    }
    // return compiled
  } catch (e) {
    console.error('Error in parse step')
    console.error(e)
  }
}





const flattenData = (input) => {
  let translation = {
    definitions: {},
    sentences: {},
    words: {},
  }
  let list = {
    arrayOfAllItemIDs: [],
    arrayOfAllWordIDs: [],
    items: {},
    sentences: {},
    words: {},
  }

  for (const documentTitle of Object.keys(input)) {
    const currentTranslation = input[documentTitle].translation
    const currentList = input[documentTitle].list
    // console.log(input[documentTitle])
    translation = {
      definitions: { ...translation.definitions, ...currentTranslation.definitions },
      sentences: { ...translation.sentences, ...currentTranslation.sentences },
      words: { ...translation.words, ...currentTranslation.words },
    }
    list = {
      arrayOfAllItemIDs: [...list.arrayOfAllItemIDs, ...currentList.arrayOfAllItemIDs],
      arrayOfAllWordIDs: [...list.arrayOfAllWordIDs, ...currentList.arrayOfAllWordIDs],
      items: { ...list.items, ...currentList.items },
      sentences: { ...list.sentences, ...currentList.sentences },
      words: { ...list.words, ...currentList.words },
    }
  }
  return {
    translation,
    list,
  }
}


/*
  Prevent clashes if the same document is transcluded twice
*/
export class newTitle {
  index = 0;
  array = [];
  get(title) {
    if(this.array.includes(title)) {
      title = this.get(title + '1')
    }
    this.array.push(title)
    return title
  }
}
