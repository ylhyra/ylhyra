import c from "app/app/functions/no-undefined-in-template-literal";
import { getValuesForURL } from "server/content/links";
import { section_id, URL_title } from "app/app/paths";
import { getOrder } from "documents/compile/templates/getOrderOfChapters";

export const breadcrumbs = async (header) => {
  if (!header.title) return;

  const parts = header.title.split(/\//g);

  let namespaces = [];
  const v = getValuesForURL(header.title);

  if (v.filepath.includes("/poems/")) {
    namespaces.push("Poems");
  } else if (v.filepath.includes("/video/")) {
    namespaces.push("Video");
  } else if (
    v.filepath.includes("/reading/") &&
    !v.filepath.includes("/tweets/") &&
    header.title !== "Texts"
  ) {
    namespaces.push('<a href="/texts">Texts</a>');
  } else if (
    v.filepath.includes("/explanations/" && header.title !== "Explanations")
  ) {
    namespaces.push('<a href="/explanations">Explanations</a>');
  }

  if (header.title.startsWith("Course/")) {
    const url_to_unit = await getOrder(false, true);
    if (v.url in url_to_unit) {
      const n = `Unit ${url_to_unit[v.url]}`;
      parts.splice(1, 0, `<a href="/course#${section_id(n)}">${n}</a>`);
    }
  } else if (namespaces.length === 0) {
    return null;
  }

  return c`<div id="breadcrumbs-title">
    <div>
      ${namespaces.map((namespace, index) => {
        return c`
          <div class="title-part namespace">${namespace}</div>
          <div class="title-separator"></div>
        `;
      })}
      ${parts.map((part, index) => {
        if (!part) return;
        const last = index === parts.length - 1;
        let name = part;
        let isParts = false;
        if (/^\d+$/.test(name)) {
          name = `Part ${name}`;
          isParts = true;
        }
        /* Bold the name of the story if it is next to the "Part 1" thing */
        const secondLastToParts =
          index === parts.length - 2 && /^\d+$/.test(parts[index + 1]);
        if (!last) {
          const urlForThisPart = getValuesForURL(
            parts.slice(0, index + 1).join("/")
          ).url;
          // console.log(urlForThisPart);
          if (urlForThisPart && urlForThisPart !== URL_title(header.title)) {
            name = `<a href="${urlForThisPart}">${name}</a>`;
          }
        }
        return c`
          <div class="title-part ${
            (last || secondLastToParts) && !isParts && "bold"
          } ${["Course"].includes(part) && !last && "namespace"}">${name}</div>
          ${!last && `<div class="title-separator"></div>`}
        `;
      })}
    </div>
  </div>`;
};
