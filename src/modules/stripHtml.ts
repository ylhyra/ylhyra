export function stripHtml(string: string) {
  return (
    string &&
    string
      .replace(/<\/[a-z]+>/g, "")
      .replace(/<[a-z]+ ?([^>]+)?>/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}
