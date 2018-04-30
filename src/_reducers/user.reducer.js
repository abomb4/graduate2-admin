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
      user: action.user
    };
  case userConstants.LOGIN_FAILURE:
    return {
      error: action.error
    };
  case userConstants.LOGOUT:
    return {};
  case userConstants.LOGIN_TIMEOUT:
    return {};
  default:
    return state;
  }
}
