import { action } from "mobx";

export const addRowsIfMissing = action((text: string) => {
  text.split(/\n/g).forEach((line) => {
    if (!line.trim()) return;
    const splitOn =
      ["\t", " = ", " - ", ": "].find((j) => line.indexOf(j) > 0) || "\t";
    const split = line.split(splitOn);
    const front = split[0];
    /** Join remaining to prevent data loss (since only two columns are currently supported */
    const back = split.slice(1).join("");
  });
});
