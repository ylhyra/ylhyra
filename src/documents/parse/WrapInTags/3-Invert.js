/*
  STEP 3:

  Turns this:
      <word><b>blabla</b></word>
  into:
      <b><word>blabla</word></b>
*/
const InvertElementsThatOnlyContainOneThing = (i) => {
  if (!i) return;
  if (Array.isArray(i)) {
    return i.map((x) => InvertElementsThatOnlyContainOneThing(x));
  } else {
    const { node, tag, attr, child } = i;
    if (child?.length > 0) {
      /*
        If element only wraps around one child,
        switch them around
      */
      if (
        (tag === "word" || tag === "sentence") &&
        child.length === 1 &&
        child[0].node === "element" &&
        child[0].tag !== "word"
      ) {
        return {
          node: child[0].node,
          tag: child[0].tag,
          attr: child[0].attr,
          child: [
            {
              node,
              tag,
              attr,
              child: child[0].child.map((x) =>
                InvertElementsThatOnlyContainOneThing(x)
              ),
            },
          ],
        };
      } else {
        return {
          ...i,
          child: child?.map((x) => InvertElementsThatOnlyContainOneThing(x)),
        };
      }
    }
    return i;
  }
};
export default InvertElementsThatOnlyContainOneThing;
