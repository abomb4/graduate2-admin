import { combineReducers } from 'redux';

import { userReducer } from './user.reducer';
import { loginReducer } from './login.reducer';

const rootReducer = combineReducers({
  userReducer,
  loginReducer
});

export default rootReducer;