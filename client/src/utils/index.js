import { combineReducers } from 'redux';
import alert from '../Reducers/Alert';
import Auth from '../Reducers/Auth';
const rootReducer = combineReducers({
  alert,
  Auth,
});

export default rootReducer;
