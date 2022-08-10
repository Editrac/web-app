import produce, { Draft } from "immer";
import {
  AuthActionTypes,
  IAuthState,
  AUTH_OTP_VALIDATE,
  AUTH_SIGNOUT,
  AUTH_SIGNIN,
  AUTH_SET_PASSWORD,
  SET_AUTH_EVAPORATE_CLIENT,
  UPDATE_USER
} from './type'

const initialState: IAuthState = {
  authenticated: false,
  password: false
}

export const authReducer = produce((
  draft: Draft<IAuthState>,
  action: AuthActionTypes
) => {
  switch (action.type) {
    case AUTH_OTP_VALIDATE:
      return { ...draft, ...action.payload };
    case AUTH_SIGNIN:
      return {
        ...draft,
        ...action.payload,
        password: true,
        authenticated: true
      }
    case AUTH_SET_PASSWORD:
      return {
        ...draft,
        password: true,
        authenticated: true
      }
    case SET_AUTH_EVAPORATE_CLIENT:
      draft._e_ = action.payload._e_;
      break;

    case UPDATE_USER:
      draft.user = action.payload.user
      break;

    case AUTH_SIGNOUT:
      return initialState;
  }
}, initialState)

export default authReducer;