import { AnyAction } from "redux";

export const audio = (
  state: {
    currentlyPlaying?: string;
    begin?: Number;
    end?: Number;
  } = {},
  action: AnyAction
) => {
  switch (action.type) {
    case "CURRENTLY_PLAYING":
      return {
        ...state,
        currentlyPlaying: action.content,
      };
    case "PLAY_SENTENCE":
      return {
        ...state,
        currentlyPlaying: action.filename,
        begin: action.begin,
        end: action.end,
      };
    case "CLEAR_SENTENCE":
      return {
        ...state,
        begin: null,
        end: null,
      };
    default:
      return state;
  }
};
