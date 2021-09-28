import routes from "inflection/server/routes";
import Search from "inflection/server/server-standalone/search";
import Get_by_id from "inflection/server/server-standalone/get_by_id";

export default routes(Search, Get_by_id);
