import { loginConstants } from '../_constants';

export const loginActions = {
  show,
  hide,
};

function show() {
  return dispatch => {
    dispatch(show());
  };
  function show() { return { type: loginConstants.SHOW }; }
}

function hide() {
  return (dispatch) => {
    return dispatch(hide());
  };
  function hide() { return { type: loginConstants.HIDE }; }
}
