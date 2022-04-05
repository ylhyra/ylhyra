import Get_by_id from "inflection/getViaApi/getById";
import { BIN_id, TableOptionsFromUser } from "inflection/server/types";
import { renderEntry } from "inflection/tables/renderEntry";

/**
 * Element displayed in Ylhýra's frontend.
 * @param id - BÍN id
 * @param parameters - Parameters passed as a URL query string
 */
export const inflectionElement = (id: BIN_id, parameters: string) => {
  return new Promise((resolve) => {
    let params: TableOptionsFromUser = {};
    parameters.replace(
      /([^&=]+)=([^&=]+)/g,
      (x: string, parameter: string, value: string) => {
        // @ts-ignore
        params[parameter] = value;
        return "";
      }
    );
    Get_by_id(id, (rows) => {
      if (!rows) {
        throw new Error(`No BÍN id ${id}`);
      }
      resolve(
        `<div class="inflection_wrapper"><div>${renderEntry(rows, {
          single: true,
          // simplifyTerms: true,
          ...params,
        })}</div></div>`
      );
    });
  });
};
