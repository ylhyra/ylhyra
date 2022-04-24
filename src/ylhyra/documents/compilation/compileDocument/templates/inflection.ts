import { inflectionElement } from "inflection/element";
import { Html } from "inflection/tables/types";
import { replaceAsync } from "modules/replaceAsync";

export default async (input: Html) => {
  return await replaceAsync(
    input,
    /<Inflection id="(.+)?" parameters="(.+)?"><\/Inflection>/gi,
    async (x: string, id: string, parameters: string) => {
      return await inflectionElement(parseInt(id), parameters);
    }
  );
};
