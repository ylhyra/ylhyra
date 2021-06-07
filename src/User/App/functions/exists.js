import isEmpty from 'is-empty-object'

const exists = (input) => {
  return input !== null && input && !isEmpty(input)
}
export default exists
