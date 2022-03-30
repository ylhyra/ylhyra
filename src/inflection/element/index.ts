import Get_by_id from "inflection/server/server-standalone/get_by_id";
import render from "inflection/tables";

export const inflectionElement = (id, parameters) => {
  return new Promise((resolve) => {
    let params = {};
    parameters.replace(/([^&=]+)=([^&=]+)/g, (x, parameter, value) => {
      params[parameter] = value;
    });
    Get_by_id(id, (rows) => {
      resolve(
        `<div class="inflection_wrapper"><div>${render(rows, {
          single: true,
          simplifyTerms: true,
          ...params,
        })}</div></div>`
      );
    });
  });
};
