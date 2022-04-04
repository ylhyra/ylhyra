import Get_by_id from "inflection/getViaApi/getById";
import render from "inflection/tables/renderEntry";
import { TableOptionsFromUser } from "inflection/server/types";

/**
 * Element displayed in Ylhýra's frontend.
 * @param id - BÍN id
 * @param parameters - Parameters passed as a URL query string
 */
export const inflectionElement = (id: number, parameters: string) => {
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
        `<div class="inflection_wrapper"><div>${render(rows, {
          single: true,
          // simplifyTerms: true,
          ...params,
        })}</div></div>`
      );
    });
  });
};
