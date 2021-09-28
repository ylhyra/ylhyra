import { replaceAsync } from "app/app/functions/replaceAsync";
import { inflectionElement } from "inflection/element";

export default async (input) => {
  return await replaceAsync(
    input,
    /<Inflection word="(.+)?"><\/Inflection>/gi,
    async (x, id) => {
      return await inflectionElement(id);
    }
  );
};
