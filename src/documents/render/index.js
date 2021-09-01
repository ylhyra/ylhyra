import Traverse from "documents/render/Traverse";

export default ({ json, data }) => {
  return Traverse({ json, data, index: 0 }) || null;
};
