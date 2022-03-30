"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const caching_1 = require("server/caching");
const app = (0, express_1.default)();
const port = 4545;
app.use("/inflection_styles", (0, caching_1.staticCached)(path_1.default.join(__dirname, "/../../styles")));
app.use("/", require(path_1.default.join(__dirname, "./route_loader")).default);
app.listen(port, null, (err) => {
    if (err) {
        console.log(err.message);
    }
});
