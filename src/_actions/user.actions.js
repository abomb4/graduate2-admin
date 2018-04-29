import { userConstants } from '../_constants';
import { ItrsLoginApi } from '../api/ItrsApi';

export const userActions = {
  login,
  logout
};

function login(username, password) {
  return dispatch => {
    dispatch(request({ username }));
    ItrsLoginApi.login(
      { 
        username: username,
        password: password
      },
      (successData) => {
        localStorage.setItem('user', JSON.stringify(successData));
        dispatch(success(successData));
      },
      (fail) => {
        dispatch(failure(fail));
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
    ItrsLoginApi.logout(
      (successData) => { dispatch(logoutAction()); },
      (failData) => { dispatch(logoutAction()); }
    );
  };
  function logoutAction() { return { type: userConstants.LOGOUT }; }
}
