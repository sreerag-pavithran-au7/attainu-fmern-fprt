import {SET_CURRENT_USER} from "../types";
import {isEmpty} from "../utils/validation/isEmpty";

const initialState={
    isAuthenticated:false,
    user:{}
};

const authReducer= (state=initialState, action)=>{
  switch (action.type) {
      case SET_CURRENT_USER: {
          return {
              ...state,
              isAuthenticated: !isEmpty(action.payload),
              user:action.payload
          }
      }
      default: return state;
  }
};

export default authReducer;