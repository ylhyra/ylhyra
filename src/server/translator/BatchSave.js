// export TESTING=true && node server/translator/BatchSave.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require("axios");
const run = (apcontinue = "") => __awaiter(this, void 0, void 0, function* () {
    var _a;
    const page_list = (yield axios.get(`https://ylhyra.is/api.php?action=query&format=json&list=allpages&apnamespace=3000&aplimit=20&apcontinue=${apcontinue}`)).data;
    yield page_list.query.allpages.forEachAsync((data_info) => __awaiter(this, void 0, void 0, function* () {
        const datatitle = data_info.title;
        yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const title = datatitle.replace(/^Data:/, "");
            const info = (yield axios.get(`https://ylhyra.is/api.php?action=query&format=json&titles=${title}&prop=info`)).data;
            let pageid, ns;
            Object.keys(info.query.pages).forEach((id) => {
                pageid = info.query.pages[id].pageid;
                ns = info.query.pages[id].ns;
            });
            /* Only mainspace and textspace */
            if (![0, 3004].includes(ns))
                return resolve();
            const data = (yield axios.get(`https://ylhyra.is/index.php?title=${datatitle}&action=raw&ctype=text/json&random=${Math.random()}`)).data;
            yield axios.put(`/api/save`, {
                data: Object.assign({ document_id: pageid }, data),
            });
            console.log(title);
            // done++
            // console.log(`Done: ${done}`)
            // console.log(url)
            // process.exit()
            resolve();
        }));
    }));
    if ((_a = page_list.continue) === null || _a === void 0 ? void 0 : _a.apcontinue) {
        run(page_list.continue.apcontinue);
    }
});
run();
