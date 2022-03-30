"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*

  This file contains the routes for both the inflection site and the API.
  It both supports sending requests to the database or the database-less backends.
  For that reason, the "Search" and "Get_by_id" functions are passed as parameters.

*/
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const license_1 = __importDefault(require("inflection/server/server-with-database/license"));
const layout_1 = __importDefault(require("inflection/server/views/layout"));
const tables_1 = __importDefault(require("inflection/tables"));
const tree_1 = __importDefault(require("inflection/tables/tree"));
const caching_1 = require("server/caching");
const router = express_1.default.Router();
exports.default = (Search, Get_by_id) => {
    /*
      API
    */
    router.get("/api/inflections?", (0, cors_1.default)(), (req, res) => {
        (0, caching_1.cacheControl)(res, "cached_html");
        res.setHeader("X-Robots-Tag", "noindex");
        let { id, type, search, fuzzy, return_rows_if_only_one_match } = req.query;
        if (search) {
            return Search({ word: search, fuzzy, return_rows_if_only_one_match }, (results) => {
                res.json({ results });
            });
        }
        else if (id) {
            Get_by_id(id, (rows) => {
                try {
                    /* Flat */
                    if (type === "flat") {
                        return res.json((0, license_1.default)(rows, id));
                    }
                    else if (type === "html") {
                        /* HTML */
                        return res.send((0, tables_1.default)(rows, req.query));
                    }
                    else {
                        /* Nested */
                        return res.send((0, license_1.default)((0, tree_1.default)(rows), id));
                    }
                }
                catch (e) {
                    if (type === "html") {
                        res
                            .status(400)
                            .send(`There was an error. <br><small>The message was ${e.message}</small>`);
                    }
                    else {
                        res.status(400).send({
                            error: `There was an error. The message was ${e.message}`,
                        });
                    }
                }
            });
        }
        else {
            return res.status(400).send({ error: "Parameters needed" });
            // return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
        }
    });
    /*
      Website
    */
    router.get(["/robots.txt", "/favicon.ico", "/sitemap.xml"], (req, res) => {
        (0, caching_1.cacheControl)(res, "immutable");
        res.send("");
    });
    router.get(["/", "/:id(\\d+)/", "/:word?/:id(\\d+)?"], (0, cors_1.default)(), (req, res) => {
        (0, caching_1.cacheControl)(res, "cached_html");
        const id = req.query.id || req.params.id;
        const word = req.query.q || req.params.word;
        const embed = "embed" in req.query;
        const sendError = (e) => {
            console.error(e);
            return res.send((0, layout_1.default)({
                title: word,
                string: word,
                results: 'There was an error. Please <a href="mailto:ylhyra@ylhyra.is">click here</a> to report this error.' +
                    `<br><br><small class=gray>Error message: ${e.message}</small>`,
            }));
        };
        try {
            if (id) {
                Get_by_id(id, (rows) => {
                    if (!rows || rows.length === 0) {
                        return res.send((0, layout_1.default)({
                            title: word,
                            string: word,
                            results: rows === null
                                ? "Internal network error. Try reloading."
                                : "No matches",
                        }));
                    }
                    try {
                        // console.log(rows)
                        res.send((0, layout_1.default)({
                            title: rows[0].base_word || "",
                            string: word,
                            results: (0, tables_1.default)(rows, req.query, {
                                input_string: word,
                            }),
                            id,
                            embed,
                        }));
                    }
                    catch (e) {
                        sendError(e);
                    }
                });
            }
            else if (word) {
                Search({
                    word: word,
                    fuzzy: true,
                    return_rows_if_only_one_match: true,
                }, (results) => {
                    try {
                        /*
                          No results
                        */
                        if (!results || results === "Error") {
                            return res.send((0, layout_1.default)({
                                title: word,
                                string: word,
                                embed,
                                results: results === "Error"
                                    ? "Error, try reloading"
                                    : "No matches",
                            }));
                        }
                        // console.log(results)
                        const { perfect_matches, did_you_mean } = results;
                        let output = "";
                        let did_you_mean_string = "";
                        if (perfect_matches.length > 0) {
                            output += `<ul class="results">
                  ${perfect_matches.map(renderItemOnSearchPage).join("")}
                </ul>`;
                        }
                        if (did_you_mean.length > 0) {
                            did_you_mean_string += `
                <h4 class="did-you-mean">
                  ${perfect_matches.length > 0
                                ? perfect_matches.length === 1
                                    ? "You may also be looking for:"
                                    : "Or did you mean:"
                                : "Did you mean:"}</h4>
                <ul class="results">
                  ${did_you_mean.map(renderItemOnSearchPage).join("")}
                </ul>`;
                        }
                        /*
                          One result
                        */
                        if (perfect_matches.length === 1) {
                            const { rows } = perfect_matches[0];
                            res.send((0, layout_1.default)({
                                title: rows[0].base_word || "",
                                string: word,
                                results: (0, tables_1.default)(rows, req.query, {
                                    input_string: word,
                                }),
                                did_you_mean_in_footer: did_you_mean_string,
                                id: rows[0].BIN_id,
                                embed,
                            }));
                        }
                        else {
                            /*
                            Many results
                          */
                            res.send((0, layout_1.default)({
                                title: word,
                                string: word,
                                results: output + did_you_mean_string,
                                embed,
                            }));
                        }
                    }
                    catch (e) {
                        sendError(e);
                    }
                });
            }
            else {
                res.send((0, layout_1.default)({}));
            }
        }
        catch (e) {
            res
                .status(400)
                .send(`There was an error. <br><small>The message was ${e.message}</small>`);
        }
    });
    return router;
};
const renderItemOnSearchPage = (i) => `
  <li>
    <a href="/${i.matched_term ? encodeURIComponent(i.matched_term) + "/" : ""}${i.BIN_id}">
      ${i.snippet
    ? `<div class="snippet">${i.snippet}</div>`
    : `<div><strong>${i.base_word}</strong></div>`}
      <div class="description">${i.description}</div>
    </a>
  </li>`;
