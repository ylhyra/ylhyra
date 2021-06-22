import c from "app/App/functions/no-undefined-in-template-literal.js";
const r = /<(ref.?|note)(?: name="?(.+?)"?")?(?:>([\s\S]+?)<\/\1>|\/>)/g;
const l_alpha = "abcdefghijklmnopqrstuv";
/*
 * Nested refs must use <ref1><ref2>bla bla </ref2></ref1>
 */
export const Ref = (input, header) => {
  let i = 0;
  let refs = {};
  let order = [];
  let type_order = {
    ref: [],
    note: [],
  };
  let sources = "";
  const run = (j) => {
    return j.replace(r, (x, type, name, content) => {
      let id = "" + (name || order.length);
      type = type.startsWith("ref") ? "ref" : "note";
      if (!(id in order)) {
        order.push(id);
        type_order[type].push(id);
      }
      if (content) {
        refs[id] = {
          type,
          content: run(content),
        };
      }
      return `REF_${id}_REF`;
    });
  };
  const getKey = (id) => {
    const l = refs["" + id];
    let order_ = type_order[l.type].indexOf("" + id);
    if (l.type === "note") {
      order_ = l_alpha[order_];
    } else {
      order_++;
    }
    return order_;
  };

  // console.log(input.slice(0, 200));
  // console.log(refs);
  const replace = (j) =>
    j.replace(/REF_(.+?)_REF/, (x, id) => {
      return `<sup class="reference">[<a href="#ref${getKey(id)}">${getKey(
        id
      )}</a>]</sup>`;
    });
  const getVals = (j) => {
    return j
      .map(
        (id) =>
          `- <span id="ref${getKey(id)}">${getKey(id)}</span>. ${
            refs[id].content
          }`
      )
      .join("\n");
  };
  input = run(input);
  input = replace(input);
  input = input.replace(/<sources>([\s\S]+)?<\/sources>/, (j, o) => {
    sources = o;
    return "";
  });
  for (const key in refs) {
    refs[key].content = replace(refs[key].content);
  }
  let reflist = "";
  if (type_order["note"].length > 0) {
    reflist += `'''Notes'''\n`;
    reflist += getVals(type_order["note"]) + "\n\n";
  }
  if (type_order["ref"].length > 0) {
    reflist += `'''References'''\n`;
    reflist += getVals(type_order["ref"]) + "\n\n";
  }
  if (sources) {
    reflist += `'''Sources'''\n`;
    reflist += sources + "\n\n";
  }
  if (reflist) {
    reflist = `<div class="references">${reflist}</div>`;
  }
  header.reflist = reflist;

  return {
    output: input,
    header,
  };
};
