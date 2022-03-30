import request from "server/grammatical-analysis/icelandic/Greynir-request";
import parse from "server/grammatical-analysis/icelandic/Greynir-parse";

export default function (text, callback) {
  request(text, (analysis) => {
    parse(text, analysis, callback);
  });
}
