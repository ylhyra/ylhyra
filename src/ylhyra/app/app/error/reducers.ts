export default (state = null, action: AnyAction) => {
  switch (action.type) {
    case "ERROR":
      return action.content;
    default:
      return state;
  }
};
