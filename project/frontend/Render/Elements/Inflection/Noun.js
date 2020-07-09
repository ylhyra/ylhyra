export const Noun = (word) => {
  if (word.is('masculine')) {
    'Masculine'
  }
  let table = [
    word.getCases('singular', 'without-article'),
    word.getCases('singular', 'with-article'),
    word.getCases('plural', 'without-article'),
    word.getCases('plural', 'with-article'),
  ]
}


getCases = () => {
  return [
    word.get('nominative'),
    word.get('accusative'),
    word.get('dative'),
    word.get('genitive'),
  ]
}

{
  this.state.rows.map(row => (
    <tr>
    <td>{row.inflectional_form}</td>
  </tr>
  ))
}
