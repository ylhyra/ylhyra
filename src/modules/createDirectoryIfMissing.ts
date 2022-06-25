import fs from "fs";

export function createDirectoryIfMissing(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}
