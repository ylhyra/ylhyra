"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenArray = void 0;
/*
  STEP 4:

  The previous function was too aggressive in splitting things up.

  Turns this:
      <b></b><b><word>blabla</word></b>
  into:
      <b><word>blabla</word></b>
*/
const MergeElementsThatHaveBeenSplitUnnecessarily = (i, temp_attribute_name) => {
    if (!i)
        return;
    if (Array.isArray(i)) {
        return i.map((x) => MergeElementsThatHaveBeenSplitUnnecessarily(x));
    }
    else {
        const { child } = i;
        if ((child === null || child === void 0 ? void 0 : child.length) > 0) {
            let newChildren = [];
            let tempElement = {};
            let lastId = null;
            for (let x = 0; x < child.length; x++) {
                const _id = child[x].attr && child[x].attr[temp_attribute_name];
                if (_id) {
                    if (_id === lastId) {
                        tempElement.child = [
                            ...(tempElement.child || []),
                            ...(child[x].child || []),
                        ];
                    }
                    else {
                        newChildren = newChildren.concat(tempElement);
                        tempElement = child[x];
                        lastId = _id;
                    }
                }
                else {
                    newChildren = newChildren.concat(tempElement);
                    newChildren.push(child[x]);
                    tempElement = {};
                    lastId = null;
                }
            }
            newChildren = newChildren.concat(tempElement);
            return Object.assign(Object.assign({}, i), { child: (0, exports.flattenArray)(newChildren).map((x) => MergeElementsThatHaveBeenSplitUnnecessarily(x, temp_attribute_name)) });
        }
        return i;
    }
};
exports.default = MergeElementsThatHaveBeenSplitUnnecessarily;
// todo: import from App/functions instead
const flattenArray = (data) => {
    var r = [];
    data.forEach((e) => Array.isArray(e) ? (r = r.concat((0, exports.flattenArray)(e))) : r.push(e));
    return r;
};
exports.flattenArray = flattenArray;
