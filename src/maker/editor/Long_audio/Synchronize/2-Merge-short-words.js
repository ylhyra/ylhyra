/*
  Words under 0.3 seconds are
  merged into their sibling
*/
const minimum_time = 0.300
const MergeShortWords = (input) => {

  const Merge = (input_words) => {
    let words = JSON.parse(JSON.stringify(input_words)) // TEMP
    for (let index = 0; index < words.length; index++) {

      let begin = (words[index].begin)
      let end = (words[index].end)
      let timespan = end - begin
      let merge_count

      for (let m = 0; timespan < minimum_time && index + m < words.length; m++) {
        merge_count = m
        end = (words[index + merge_count].end)
        timespan = end - begin
      }

      for (let i = index; i <= index + merge_count; i++) {
        words[i] = {
          ...words[i],
          begin,
          end,
        }
      }
    }
    return words
  }

  try {
    return input.map(paragraph => ({
      ...paragraph,
      children: paragraph.children.map(sentence => ({
        ...sentence,
        children: Merge(sentence.children)
      }))
    }))
  } catch (e) {
    console.error(e)
    return input
  }
}
export default MergeShortWords
