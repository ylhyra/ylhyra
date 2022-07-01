export function getTitle(...parts: string[]): string {
  return ["Flashcards", ...parts].reverse().join(" - ");
}
