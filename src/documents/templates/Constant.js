import * as constants from "app/app/constants";

export default (props) => {
  return constants[props.name] || null;
};
