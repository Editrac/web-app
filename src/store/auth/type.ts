import Evaporate from 'evaporate';
import { IOrganisation } from '../organisation/type';

export interface IUser {
  _id: string,
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  picture: string;
  providor: string;
  userType: string;
  role: UserRole;
  organisation: IOrganisation
}

export interface IAuthState {
  authenticated: boolean;
  password: boolean;
  user?: IUser;
  token?: string;
  _e_?: Evaporate;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  EDITOR = 'EDITOR'
}

export const UserRoleConsts = {
  [UserRole.ADMIN]: {
    label: "Admin",
    color: "#ed7439",
  },
  [UserRole.PROJECT_MANAGER]: {
    label: "Project Manager",
    color: "#25c0ab",
  },
  [UserRole.EDITOR]: {
    label: "Editor",
    color: "#fff",
  }
}

export const AUTH_OTP_GENERATE = 'OTP_GENERATE';
export const AUTH_OTP_VALIDATE = 'OTP_VALIDATE';
export const AUTH_SET_PASSWORD = 'AUTH_SET_PASSWORD';
export const AUTH_SIGNIN = 'AUTH_SIGNIN';
export const AUTH_SIGNOUT = 'AUTH_SIGNOUT';
export const UPDATE_USER = 'UPDATE_USER';

export const SET_AUTH_EVAPORATE_CLIENT = "SET_AUTH_EVAPORATE_CLIENT";
interface AuthOtpValidateAction {
  type: typeof AUTH_OTP_VALIDATE
  payload: Partial<IAuthState>
}

interface AuthSetPasswordAction {
  type: typeof AUTH_SET_PASSWORD
}

interface AuthSignInAction {
  type: typeof AUTH_SIGNIN,
  payload: IAuthState
}
interface AuthSignOutAction {
  type: typeof AUTH_SIGNOUT
}

interface UpdateUserAction {
  type: typeof UPDATE_USER,
  payload: { user: IUser }
}

export interface SetAuthEvaporateClientAction {
  type: typeof SET_AUTH_EVAPORATE_CLIENT,
  payload: { _e_: Evaporate }
}

export type AuthActionTypes = AuthOtpValidateAction | AuthSetPasswordAction | AuthSignInAction | AuthSignOutAction | UpdateUserAction | SetAuthEvaporateClientAction