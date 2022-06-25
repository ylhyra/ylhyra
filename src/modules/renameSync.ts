import fs from "fs";

/** Renames and creates any missing directories */
export function renameSync(from: string, to: string) {
  const dir = to.replace(/^(.+)\/(.+)/, "$1");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.renameSync(from, to);
}
