import isEmpty from "is-empty-object";

export default (input: any) => {
  return input !== null && input && !isEmpty(input);
};
