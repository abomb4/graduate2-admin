import { userConstants } from '../_constants';
import { ItrsLoginApi } from '../api/ItrsApi';

export const userActions = {
  login,
  logout,
  cancel,
  checkTimeout,
};
function timeout() { return { type: userConstants.LOGIN_TIMEOUT }; }
function request() { return { type: userConstants.LOGIN_REQUEST }; }
function success(user) { return { type: userConstants.LOGIN_SUCCESS, user }; }
function failure(error) { return { type: userConstants.LOGIN_FAILURE, error }; }
function logoutAction() { return { type: userConstants.LOGOUT }; }
function canceled() { return { type: userConstants.LOGIN_CANCELED }; }

function login(username, password, remember, successCall, failCall) {
  return dispatch => {
    dispatch(request({ username }));
    return ItrsLoginApi.login(
      {
        username: username,
        password: password,
        'remember-me': remember
      },
      (successData) => {
        localStorage.setItem('user', JSON.stringify(successData));
        dispatch(success(successData));
        if (successCall) successCall();
      },
      (fail) => {
        dispatch(failure(fail));
        if (failCall) failCall();
      }
    );
  };
}

function logout(successCall, failCall) {
  return dispatch => {
    localStorage.removeItem('user');
    return ItrsLoginApi.logout(
      (successData) => { dispatch(logoutAction()); if (successCall) successCall(); },
      (failData) => { dispatch(logoutAction()); if (failCall) failCall(); }
    );
  };
}

function cancel() {
  return (dispatch) => {
    return dispatch(canceled());
  };
}

/**
 * 判断登录状态是否已经超时
 */
function checkTimeout() {

  return (dispatch) => {
    ItrsLoginApi.checkStatus(
      (successData) => {
        localStorage.setItem('user', JSON.stringify(successData));
        dispatch(success(successData));
      },
      (fail) => {
        localStorage.removeItem('user');
        return dispatch(timeout());
      }
    );
  };
}
