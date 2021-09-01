const pronunciation = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_EDITOR":
      return action.content.pronunciation || state;
    case "PRONUNCIATION_AND_SOUND":
      return {
        ...state,
        ...action.pronunciation,
      };
    default:
      return state;
  }
};

export default pronunciation;
