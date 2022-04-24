import fs from "fs";
import path from "path";

/**
 * https://stackoverflow.com/a/66187152 CC BY-SA 4.0
 */
export const getFilesRecursivelySync = (directory: string): string[] => {
  let files: string[] = [];
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    if (file.startsWith(".")) continue;
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      files = files.concat(getFilesRecursivelySync(absolute));
    } else {
      if (!file.endsWith(".md")) continue;
      files.push(absolute);
    }
  }
  return files;
};
