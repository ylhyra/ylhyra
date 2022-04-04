// /** Typescript overload signatures */
export function uppercaseFirstLetter(input: "" | null | undefined): undefined;
export function uppercaseFirstLetter(input: string): string;

export function uppercaseFirstLetter(input: string | null | undefined) {
  if (!input) return;
  return input.charAt(0).toUpperCase() + input.slice(1);
}
