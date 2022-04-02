import { HeaderData } from "ylhyra/documents/compile/functions/readContentFile";

const refRegex = /<(ref.?|note)(?: name="?(.+?)"?")?(?:>([\s\S]+?)<\/\1>|\/>)/g;
const tempRegexMarker = /REF_(.+?)_REF/g;
const lowerAlpha = "abcdefghijklmnopqrstuv";

/*
 * Nested refs must use <ref1><ref2>bla bla </ref2></ref1>
 */
export const References = (content: string, header: HeaderData) => {
  let references: { [id: string]: { type: "ref" | "note"; content: string } } =
    {};
  let orderOfReferenceIds: string[] = [];
  let orderOfReferenceIdsByType: {
    ref: string[];
    note: string[];
  } = {
    ref: [],
    note: [],
  };
  const run = (j: string) => {
    return j.replace(refRegex, (x, _type, name, content) => {
      let id = (name || orderOfReferenceIds.length).toString();
      const type = _type.startsWith("ref") ? "ref" : "note";
      if (!(id in orderOfReferenceIds)) {
        orderOfReferenceIds.push(id);
        orderOfReferenceIdsByType[type].push(id);
      }
      if (content) {
        references[id] = {
          type,
          content: run(content),
        };
      }
      return `REF_${id}_REF`;
    });
  };

  /**
   * Returns the names for displaying "[1]" ang "[a]"
   */
  const printReferenceName = (id: string) => {
    id = id.toString();
    const l = references[id];
    let _order = orderOfReferenceIdsByType[l.type].indexOf(id);
    if (l.type === "note") {
      return lowerAlpha[_order];
    } else {
      return (_order++).toString();
    }
  };

  const printReferenceList = (j: typeof orderOfReferenceIds) => {
    return (
      "<ul class='plain'>" +
      j
        .map(
          (id) =>
            `<li id="ref-${printReferenceName(
              id
            )}"><span class="list-number">${printReferenceName(
              id
            )}&period;</span> ${references[id].content}</li>`
        )
        .join("") +
      "</ul>"
    );
  };

  const formatSupElements = (j: string) => {
    return j.replace(tempRegexMarker, (x, id: string) => {
      return `<sup class="reference" data-no-translate>[<a href="#ref-${printReferenceName(
        id
      )}">${printReferenceName(id)}</a>]</sup>`;
    });
  };

  content = run(content);
  content = formatSupElements(content);
  let notes = "";
  let sources = "";
  content = content.replace(/<sources>([\s\S]+)?<\/sources>/i, (j, o) => {
    sources = o;
    return "";
  });
  content = content.replace(/<notes>([\s\S]+)?<\/notes>/i, (j, o) => {
    notes = o;
    return "";
  });
  for (const key of Object.keys(references)) {
    references[key].content = formatSupElements(references[key].content);
  }
  let reflist = "";
  if (notes) {
    reflist += `'''Notes'''\n\n`;
    reflist += notes + "\n\n";
  }
  if (orderOfReferenceIdsByType.note.length > 0) {
    reflist += `'''Footnotes'''\n\n`;
    reflist += printReferenceList(orderOfReferenceIdsByType["note"]) + "\n\n";
  }
  if (orderOfReferenceIdsByType.ref.length > 0) {
    reflist += `'''References'''\n\n`;
    reflist += printReferenceList(orderOfReferenceIdsByType["ref"]) + "\n\n";
  }
  if (sources) {
    reflist += `'''Sources'''\n\n`;
    reflist += sources + "\n\n";
  }
  if (reflist) {
    reflist = `<div class="references">${reflist}</div>`;
  }

  /**
   * Stored here in order to print the references in HeaderAndFooter.ts
   */
  header.reflist = reflist;

  return {
    content,
    header,
  };
};
