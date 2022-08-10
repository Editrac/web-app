import {
  PlayerActionTypes,
  IComment,
  SET_PLAYER,
  ADD_COMMENT,
  SET_TIMESTAMP
} from './type';

export function setPlayerAction(payload: { comments: IComment[], timestamp: number }): PlayerActionTypes {
  return {
    type: SET_PLAYER,
    payload
  }
}
export function addCommentAction(payload: { comment: IComment }): PlayerActionTypes {
  return {
    type: ADD_COMMENT,
    payload
  }
}

export function setTimestampAction(payload: { timestamp: number }): PlayerActionTypes {
  return {
    type: SET_TIMESTAMP,
    payload
  }
}