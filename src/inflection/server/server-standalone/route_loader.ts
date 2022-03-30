import routes from "inflection/server/routes";
import Get_by_id from "inflection/server/server-standalone/get_by_id";
import Search from "inflection/server/server-standalone/search";

export default routes(Search, Get_by_id);
