import axios from '../axios-users';
import jwt_decode from 'jwt-decode';

import {
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
} from '../types';
import setAuthToken from '../utils/validation/setAuthToken';

export const registerUser = (userData, history) => {
  return dispatch => {
    axios
      .post('/users/register', userData)
      .then(res => {
        history.push('/');
      })
      .catch(err => {
        console.log(err.response.data);
        return dispatch({ type: GET_ERRORS, payload: err.response.data });
      });
  };
};

export const loginUser = userData => {
  return dispatch => {
    axios
      .post('/users/login', userData)
      .then(res => {
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  };
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

export const logoutUser = () => {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
  };
};
