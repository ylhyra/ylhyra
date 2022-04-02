/**
 * Renders title for the <title> element.
 * Turns "Foo: Bar" into "Bar • Foo"
 */
export const renderTitle = (input: string | undefined) => {
  const defaultTitle = "Ylhýra – Learn Icelandic";
  if (!input) return defaultTitle;
  return (
    [defaultTitle, ...input.replace(/\/(\d+)$/, " – Part $1").split(/[/:]/g)]
      .reverse()
      // // Ignore parts that are just numbers (such as "/article/1/")
      // .filter((i) => !/^\d+$/.test(i))
      .join("\u2006•\u2006")
  );
};
