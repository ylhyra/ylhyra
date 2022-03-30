import Get_by_id from "inflection/server/server-with-database/get_by_id";
import Search from "inflection/server/server-with-database/search";
import routes from "inflection/server/routes";

export default routes(Search, Get_by_id);
