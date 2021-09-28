import render from "inflection/tables";
import Get_by_id from "inflection/server/server-standalone/get_by_id";

export const inflectionElement = (id) => {
  return new Promise((resolve) => {
    Get_by_id(id, (rows) => {
      resolve(render(rows, { single: true }));
    });
  });
};
