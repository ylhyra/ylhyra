import c from "ylhyra/app/app/functions/no-undefined-in-template-literal";

export default (input: string) => {
  return input?.replace(/{\| class="wikitable"([\s\S]+?)\|}/g, (x, content) => {
    return `<table class="wikitable">
      <tbody>
        ${content
          .split(/(?:^\|\+|^\|-)/gm)
          .map((v: string) => {
            return `<tr>
              ${(() => {
                const k = v.split(/^([|!])/gm);
                return k
                  .map((d: string, index: number) => {
                    if (index === 0) return "";
                    if (index % 2 !== 0) return "";
                    const el = k[index - 1] === "!" ? "th" : "td";
                    const m = d.match(/^(?:([^|[\]]+)\|)?([\S\s]+)$/);
                    if (m) {
                      const [, attributes, data] = m;
                      return c`<${el} ${attributes}>
                        ${data}
                      </${el}>`;
                    }
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
