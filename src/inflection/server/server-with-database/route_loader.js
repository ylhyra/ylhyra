import routes from "inflection/server/routes";
import Search from "inflection/server/server-with-database/search";
import Get_by_id from "inflection/server/server-with-database/get_by_id";

export default routes(Search, Get_by_id);
