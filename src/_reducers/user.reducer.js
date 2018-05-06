import { userConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { user } : {};

export function userReducer(state = initialState, action) {
  switch (action.type) {
  case userConstants.LOGIN_REQUEST:
    return {
      logging: true
    };
  case userConstants.LOGIN_SUCCESS:
    return {
      logging: false,
      user: action.user
    };
  case userConstants.LOGIN_FAILURE:
    return {
      error: action.error
    };
  case userConstants.LOGOUT:
    return {
      logout: true
    };
  case userConstants.LOGIN_TIMEOUT:
    return {};
  case userConstants.LOGIN_CANCELED:
    return {
      canceled: true
    };
  default:
    return state;
  }
}
