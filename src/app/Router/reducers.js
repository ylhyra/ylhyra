export const route = (
  state = {
    pathname: "/",
  },
  action
) => {
  switch (action.type) {
    case "ROUTE":
      return action.content;
    case "LOAD_ROUTE_CONTENT":
      return {
        data: action.data,
      };
    default:
      return state;
  }
};
