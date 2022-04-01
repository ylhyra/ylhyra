import fs from "fs";

export let _links = {};
try {
  _links = JSON.parse(
    fs.readFileSync(getBaseDir() + `/build/links.json`, "utf8")
  );
} catch {}
export const links = _links;
