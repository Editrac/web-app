import produce, { Draft } from "immer";
import {
  PlayerActionTypes,
  IPlayerState,
  IComment,
  SET_PLAYER,
  ADD_COMMENT,
  SET_TIMESTAMP
} from './type'

const initialState: IPlayerState = {
  comments: [],
  timestamp: 0
}

export const playerReducer = produce((
  draft: Draft<IPlayerState>,
  action: PlayerActionTypes
) => {
  switch (action.type) {
    case SET_PLAYER:
      draft.comments = action.payload.comments;
      break;
    case ADD_COMMENT:
      draft.comments.push(action.payload.comment);
      break;

    case SET_TIMESTAMP:
      draft.timestamp = action.payload.timestamp
      break;

  }
}, initialState);

export default playerReducer;
