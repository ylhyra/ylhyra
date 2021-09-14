import c from "app/app/functions/no-undefined-in-template-literal";
import { getValuesForURL } from "server/content/links";

export const breadcrumbs = (header) => {
  if (!header.title) return;

  const parts = header.title.split(/\//g);

  return c`<div id="breadcrumbs-title">
    <span>
      ${parts.map((part, index) => {
        const last = index === parts.length - 1;
        let name = part;
        if (/^\d+$/.test(name)) {
          name = `Part ${name}`;
        }
        if (!last) {
          const partLink = parts.slice(0, index + 1);
          getValuesForURL(partLink);
        }
        return c`<span class="title-part ${last && "last"}">
            ${name}
            ${!last && `<span class="title-separator">/</span>`}
          </span>`;
      })}
    </span>
  </div>`;
};
