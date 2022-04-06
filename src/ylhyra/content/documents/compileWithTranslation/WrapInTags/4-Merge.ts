import flattenArray from "ylhyra/app/app/functions/flattenArray";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";

/**
  STEP 4:

  The previous function was too aggressive in splitting things up.

  Turns this:
      <b></b><b><word>blabla</word></b>
  into:
      <b><word>blabla</word></b>
*/

export default function MergeElementsThatHaveBeenSplitUnnecessarily(
  input: HtmlAsJson,
  tempAttributeName: "data-temp-id" | "data-temp-id2"
): HtmlAsJson {
  const { child } = input;
  if (child && child?.length > 0) {
    let newChildren: HtmlAsJson[] = [];
    let tempElement: HtmlAsJson = {};
    let lastId = null;
    for (let x = 0; x < child.length; x++) {
      const _id = child[x].attr?.[tempAttributeName];
      if (_id) {
        if (_id === lastId) {
          tempElement.child = [
            ...(tempElement.child || []),
            ...(child[x].child || []),
          ];
        } else {
          newChildren = newChildren.concat(tempElement);
          tempElement = child[x];
          lastId = _id;
        }
      } else {
        newChildren = newChildren.concat(tempElement);
        newChildren.push(child[x]);
        tempElement = {};
        lastId = null;
      }
    }
    newChildren = newChildren.concat(tempElement);
    return {
      ...input,
      child: (flattenArray(newChildren) as HtmlAsJson[]).map((item) =>
        MergeElementsThatHaveBeenSplitUnnecessarily(item, tempAttributeName)
      ),
    };
  }
  return input;
}
