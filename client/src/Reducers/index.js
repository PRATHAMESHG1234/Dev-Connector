import { combineReducers } from 'redux';
import alert from './Alert';
import Auth from './Auth';
const rootReducer = combineReducers({
  alert,
  Auth,
});

export default rootReducer;
