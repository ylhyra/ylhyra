export const removeHtmlLinks = (string: string) => {
  return string?.replace(/<\/a>/g, "").replace(/<a .+?>/g, "");
};
