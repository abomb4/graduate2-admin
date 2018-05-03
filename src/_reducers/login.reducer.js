import { loginConstants } from '../_constants';

export function loginReducer(state = { show: false }, action) {
  switch (action.type) {
  case loginConstants.SHOW:
    return {
      show: true
    };
  case loginConstants.HIDE:
    return {
      show: false
    };
  default:
    return state;
  }
}
