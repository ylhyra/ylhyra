import routes from "server/inflection/server/routes";
import Search from "server/inflection/server/server-with-database/search";
import Get_by_id from "server/inflection/server/server-with-database/get_by_id";

export default routes(Search, Get_by_id);
