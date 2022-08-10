import { IUser } from '../auth/type';
export interface IComment {
  _id: string;
  visibility: commentVisibility;
  user: IUser;
  text: string;
  replies: string[];
  video: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}


export enum commentVisibility {
  EVERYONE = 'EVERYONE',
  TEAM = 'TEAM'
}

export interface IVideo {
  _id: string;
  file: string;
  name: string;
  version: number;
  uploadedAt: string;
  user: string;
  comments: string[]
}
export interface IPlayerState {
  timestamp: number
  comments: IComment[]
}

export const SET_PLAYER = 'SET_PLAYER';
export const ADD_COMMENT = 'ADD_COMMENT';
export const SET_TIMESTAMP = 'SET_TIMESTAMP';

interface SetPlayerAction {
  type: typeof SET_PLAYER,
  payload: { comments: IComment[], timestamp: number }
}
interface AddCommentAction {
  type: typeof ADD_COMMENT,
  payload: { comment: IComment }
}
interface setTimestamp {
  type: typeof SET_TIMESTAMP,
  payload: { timestamp: number }
}

export type PlayerActionTypes = SetPlayerAction | AddCommentAction | setTimestamp;