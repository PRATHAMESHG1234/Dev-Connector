import { combineReducers } from "redux";
import alert from "./Alert";
import auth from "./auth";
const rootReducer = combineReducers({
  alert,
  auth,
});

export default rootReducer;
