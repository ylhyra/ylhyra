import parse from "server/grammatical-analysis/icelandic/Greynir-parse";
import request from "server/grammatical-analysis/icelandic/Greynir-request";

export default function (text, callback) {
  request(text, (analysis) => {
    parse(text, analysis, callback);
  });
}
