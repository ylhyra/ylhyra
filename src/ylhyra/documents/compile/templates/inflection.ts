import { replaceAsync } from "modules/replaceAsync";
import { inflectionElement } from "inflection/element";

export default async (input: string) => {
  return await replaceAsync(
    input,
    /<Inflection id="(.+)?" parameters="(.+)?"><\/Inflection>/gi,
    async (x: string, id: string, parameters: string) => {
      return await inflectionElement(id, parameters);
    }
  );
};
