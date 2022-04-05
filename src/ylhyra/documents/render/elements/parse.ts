/*
  TODO: Ég held að þetta sé ekki lengur í notkun

  A poor man's parser that uses HTML data attr tags
  to convert HTML into an object.

  The attribute data-name becomes a key in the object.
*/
export const parseHtmlToObject = (children) => {
  let output = {};
  const Traverse = (input) => {
    if (input === null) {
      return;
    } else if (Array.isArray(input)) {
      input.forEach(Traverse);
    } else if (typeof input === "object" || typeof input === "function") {
      const name = input.props["data-name"];
      const childrenType = input.props["data-children"];
      if (childrenType === "array") {
        output[name] = parseHtmlToArray(input.props.children);
      } else if (childrenType === "object") {
        output[name] = parseHtmlToObject(input.props.children);
      } else if (childrenType === "string") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (childrenType === "boolean") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (name) {
        output[name] = input.props.children;
      } else {
        Traverse(input.props.children);
      }
    }
  };
  Traverse(children);
  return output;
};

export const parseHtmlToArray = (children) => {
  let output = [];
  const Traverse = (input) => {
    if (input === null) {
      return;
    } else if (Array.isArray(input)) {
      input.forEach(Traverse);
    } else if (typeof input === "object" || typeof input === "function") {
      const name = input.props["data-name"];
      const childrenType = input.props["data-children"];
      if (childrenType === "array") {
        output.push({
          name,
          children: parseHtmlToArray(input.props.children),
        });
      } else if (childrenType === "object") {
        output.push(parseHtmlToObject(input.props.children));
      } else if (childrenType === "string") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (childrenType === "boolean") {
        output[name] = getTextFromReactElement(input.props.children);
      } else if (name) {
        // output.push(input.props.children)
        output.push({
          name,
          children: input.props.children,
        });
      } else {
        Traverse(input.props.children);
      }
    }
  };
  Traverse(children);
  return output;
};

export const getTextFromReactElement = (input) => {
  let output = "";
  const Traverse = (input) => {
    if (Array.isArray(input)) {
      input.forEach(Traverse);
    } else if (
      input !== null &&
      (typeof input === "object" || typeof input === "function")
    ) {
      input.props && Traverse(input.props.children);
    } else if (input) {
      output += input;
    }
  };
  Traverse(input);
  return output.trim();
};
