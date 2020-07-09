const Noun = (word) => {
  if (word.is('masculine')) {
    'Masculine'
  }
  let table = [
    word.get('singular', 'without-article').getCases(),
    word.get('singular', 'with-article').getCases(),
    word.get('plural', 'without-article').getCases(),
    word.get('plural', 'with-article').getCases(),
  ]
  console.log(table)
}

export default Noun

// {
//   this.state.rows.map(row => (
//     <tr>
//     <td>{row.inflectional_form}</td>
//   </tr>
//   ))
// }
