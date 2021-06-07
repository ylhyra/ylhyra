/**
 * @memberof Word
 * @return {?string}
 */
export function getWordNotes() {
  let notes = []
  switch (this.original.rows[0].correctness_grade_of_word) {
    case '0':
      notes.push(`This word is not used in modern Icelandic`)
      break;
    case '2':
      notes.push(`This word is not considered to be proper standard Icelandic`)
      break;
    case '3':
      notes.push(`Don't use this word, it considered to be incorrect`)
      break;
    case '4':
      notes.push(`Never use this word, it considered to be incorrect`)
      break;
  }
  if(notes.length > 0) {
    return '<div class="note"><b>Note:</b> '+ notes.join('<br/>') + '</div>'
  }
  return ''
}
