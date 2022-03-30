"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_foreach_async_1 = __importDefault(require("app/app/functions/array-foreach-async"));
const removeNullKeys_1 = __importDefault(require("app/app/functions/removeNullKeys"));
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
/*

Migration from `vocabulary_schedule_BACKUP` to `user_data`

npm run build_server && node build/server/ylhyra_server.js --migration_vocabulary_2021_08

*/
(0, database_1.default)((0, SQL_template_literal_1.default) `
  SELECT * ,
    UNIX_TIMESTAMP(due) * 1000 as due,
    UNIX_TIMESTAMP(last_seen) * 1000 as last_seen
  FROM vocabulary_schedule_BACKUP
  ORDER BY id ASC
  `, (err, results) => __awaiter(void 0, void 0, void 0, function* () {
    if (err) {
        console.error(err);
    }
    else {
        yield (0, array_foreach_async_1.default)(results, (_a) => __awaiter(void 0, void 0, void 0, function* () {
            var { id, user_id, card_id, created_at } = _a, row = __rest(_a, ["id", "user_id", "card_id", "created_at"]);
            return new Promise((resolve) => {
                (0, database_1.default)((0, SQL_template_literal_1.default) `
            INSERT INTO user_data SET
              user_id = ${user_id},
              type = "schedule",
              \`key\` = ${card_id},
              value = ${(0, json_stable_stringify_1.default)((0, removeNullKeys_1.default)(row))},
              created_at = ${created_at || null}
            ;`, () => __awaiter(void 0, void 0, void 0, function* () {
                    resolve();
                }));
            });
        }));
        console.log("Done");
        process.exit();
    }
}));
