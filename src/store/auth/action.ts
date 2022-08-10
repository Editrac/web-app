import Evaporate from 'evaporate';
import {
  AUTH_OTP_VALIDATE,
  AUTH_SIGNOUT,
  AuthActionTypes,
  IAuthState,
  AUTH_SIGNIN,
  AUTH_SET_PASSWORD,
  SET_AUTH_EVAPORATE_CLIENT,
  UPDATE_USER,
  IUser,
} from './type';

export function authOtpValidateAction(payload: Partial<IAuthState>): AuthActionTypes {
  return {
    type: AUTH_OTP_VALIDATE,
    payload
  }
}

export function authSetPasswordAction(): AuthActionTypes {
  return {
    type: AUTH_SET_PASSWORD
  }
}

export function authSignInAction(payload: IAuthState): AuthActionTypes {
  return {
    type: AUTH_SIGNIN,
    payload
  }
}

export function authSignOutAction(): AuthActionTypes {
  return {
    type: AUTH_SIGNOUT
  }
}

export function updateUserAction(payload: { user: IUser }): AuthActionTypes {
  return {
    type: UPDATE_USER,
    payload
  }
}

export function setAuthEvaporateClientAction(payload: { _e_: Evaporate }): AuthActionTypes {
  return {
    type: SET_AUTH_EVAPORATE_CLIENT,
    payload
  }
}
