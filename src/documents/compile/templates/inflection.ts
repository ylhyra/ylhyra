import { replaceAsync } from "app/app/functions/replaceAsync";
import { inflectionElement } from "inflection/element";

export default async (input) => {
  return await replaceAsync(
    input,
    /<Inflection id="(.+)?" parameters="(.+)?"><\/Inflection>/gi,
    async (x, id, parameters) => {
      return await inflectionElement(id, parameters);
    }
  );
};
