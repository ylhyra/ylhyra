import fs from "fs";

export const createDirectoryIfMissing = (directory: string): void => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
};
