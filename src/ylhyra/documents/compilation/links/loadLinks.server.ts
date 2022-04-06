import fs from "fs";
import { getBaseDir } from "ylhyra/server/paths";
import { LinkDataWithUrl } from "ylhyra/documents/types";

export let _links: { [key: string]: LinkDataWithUrl } = {};
try {
  _links = JSON.parse(
    fs.readFileSync(getBaseDir() + `/build/links.json`, "utf8")
  );
} catch {}
export const links = _links;
