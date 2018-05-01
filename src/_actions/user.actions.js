import { userConstants } from '../_constants';
import { ItrsLoginApi } from '../api/ItrsApi';

export const userActions = {
  login,
  logout,
  cancel,
  checkTimeout,
};

function login(username, password, successCall, failCall) {
  return dispatch => {
    dispatch(request({ username }));
    return ItrsLoginApi.login(
      { 
        username: username,
        password: password
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
  function request() { return { type: userConstants.LOGIN_REQUEST }; }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user }; }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error }; }
}

function logout() {
  return dispatch => {
    localStorage.removeItem('user');
    return ItrsLoginApi.logout(
      (successData) => { dispatch(logoutAction()); },
      (failData) => { dispatch(logoutAction()); }
    );
  };
  function logoutAction() { return { type: userConstants.LOGOUT }; }
}

function cancel() {
  return (dispatch) => {
    return dispatch(canceled());
  };
  function canceled() { return { type: userConstants.LOGIN_CANCELED }; }
}

/**
 * 判断登录状态是否已经超时
 */
function checkTimeout() {

  return (dispatch) => {
    ItrsLoginApi.checkStatus(
      (success) => {},
      (fail) => {
        localStorage.removeItem('user');
        return dispatch(timeout());
      }
    );
  };
  function timeout() { return { type: userConstants.LOGIN_TIMEOUT }; }
}
