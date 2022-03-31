const addDash = (attr) => {
  while (attr.indexOf("-") > 0) {
    // - is in the attribute name, but is not the first character either
    var afterDash = attr.substring(attr.indexOf("-") + 1);
    afterDash =
      afterDash.substring(0, 1).toUpperCase() + afterDash.substring(1);
    attr = attr.substring(0, attr.indexOf("-")) + afterDash;
  }
  return attr;
};

export default (str, opts?) => {
  if (typeof str !== "string") {
    throw new TypeError("Expected a string");
  }
  opts = opts || {};
  var obj = {};

  str.split(";").forEach(function (string) {
    if (string !== "") {
      var attr = string.split(":");
      var attrName;
      if (attr.length > 2) {
        attrName = attr.shift();
        attrName = addDash(attrName).trim();
        obj[attrName] = attr.join(":");
      } else {
        attrName = addDash(attr[0]).trim();
        obj[attrName] = attr[1];
      }
    }
  });
  if (opts.stringify) {
    return JSON.stringify(obj);
  } else {
    return obj;
  }
};
