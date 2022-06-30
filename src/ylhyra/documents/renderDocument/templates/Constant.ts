// @ts-nocheck
import * as constants from "ylhyra/app/app/constants";

export default (props) => {
  return constants[props.name] || null;
};
