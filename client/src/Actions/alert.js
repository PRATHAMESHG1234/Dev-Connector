import { REMOVE_ALERT, SET_ALERT } from "../Actions/types";

import { v4 as uuidv4 } from "uuid";

const id = uuidv4();
export const setAlert =
  (msg, alertType, timeOut = 5000) =>
  (dispatch) => {
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeOut);
  };
