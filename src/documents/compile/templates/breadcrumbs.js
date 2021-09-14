import c from "app/app/functions/no-undefined-in-template-literal";
import { getValuesForURL } from "server/content/links";
import { URL_title } from "app/app/paths";

export const breadcrumbs = (header) => {
  if (!header.title) return;

  const parts = header.title.split(/\//g);

  return c`<div id="breadcrumbs-title">
    <div>
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
          }">${name}</div>
          ${!last && `<div class="title-separator"><div>/</div></div>`}
        `;
      })}
    </div>
  </div>`;
};
