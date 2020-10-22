import {createStore, applyMiddleware,compose, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import errorReducer from './reducers/errorReducer';
import cardReducer from './reducers/cardReducer';
import listReducer from './reducers/listReducer';
import boardReducer from './reducers/boardReducer';
import setAuthToken from './utils/validation/setAuthToken';
import jwt_decode from 'jwt-decode';
import { logoutUser, setCurrentUser } from './actions/authActions';

const initialState = {};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        auth: authReducer,
        errors: errorReducer,
        cards: cardReducer,
        list: listReducer,
        boards: boardReducer,
    }),
    initialState,
    composeEnhancer(applyMiddleware(thunk))
);

if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded));
    if (decoded.exp < Date.now() / 1000) {
      store.dispatch(logoutUser());
    }
  }

export default store;