import { inflectionElement } from "inflection/element";
import { replaceAsync } from "modules/replaceAsync";
import { BIN_id } from "inflection/server/types";

export default async (input: BIN_id) => {
  return await replaceAsync(
    input,
    /<Inflection id="(.+)?" parameters="(.+)?"><\/Inflection>/gi,
    async (x: string, id: string, parameters: string) => {
      return await inflectionElement(id, parameters);
    }
  );
};
