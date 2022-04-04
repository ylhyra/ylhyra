import { OutputWithLicense } from "inflection/server/types";
import { Rows, Tree } from "inflection/tables/types";

export default (input: Tree | Rows | null): OutputWithLicense => {
  return {
    results: input,
    license:
      "CC BY-SA 4.0; https://ylhyra.is/Project:Inflections; © Árni Magnússon Institute for Icelandic Studies",
  };
};
