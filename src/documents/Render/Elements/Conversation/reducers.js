const conversations = (state = {}, action) => {
  switch (action.type) {
    case "CONVERSATION":
      return {
        ...state,
        [action.section_id]: {
          ...state[action.section_id],
          ...action,
        },
      };
    case "CONVERSATION_NEXT":
      return {
        ...state,
        [action.section_id]: {
          ...state[action.section_id],
          howManyToShow: (state[action.section_id]?.howManyToShow || 0) + 1,
        },
      };
    // case 'CONVERSATION_ADVANCE':
    //   return {
    //     ...state,
    //     [action.id]: {
    //       ...state[action.id],
    //       current: (state[action.id]?.current || 0) + 1
    //     }
    //   }
    default:
      return state;
  }
};

export default conversations;
