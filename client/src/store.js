import {createStore, applyMiddleware,compose, combineReducers} from 'redux'
import thunk from 'redux-thunk';
import { authReducer} from './reducers/authReducer';

const initialState = {};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers({
        auth: authReducer,
    }),
    initialState,
    composeEnhancer(applyMiddleware(thunk))
);

export default store;