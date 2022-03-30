import c from "app/app/functions/no-undefined-in-template-literal";

export default (input) => {
  return input?.replace(/{\| class="wikitable"([\s\S]+?)\|}/g, (x, content) => {
    return `<table class="wikitable">
    <tbody>
      ${content
        .split(/(?:^\|\+|^\|-)/gm)
        .map((v) => {
          return `<tr>
            ${(() => {
              const k = v.split(/^(\||!)/gm);
              return k
                .map((d, index) => {
                  if (index === 0) return "";
                  if (index % 2 !== 0) return "";
                  const el = k[index - 1] === "!" ? "th" : "td";
                  const [, attributes, data] = d.match(
                    /^(?:([^|[\]]+)\|)?([\S\s]+)$/
                  );
                  return c`<${el} ${attributes}>
                    ${data}
                  </${el}>`;
                })
                .join("");
            })()}
          </tr>`;
        })
        .join("")}
    </tbody>

  </table>
  `;
  });
};
