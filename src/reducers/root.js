import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import count from './count.js';
import user from './user.js';

const root = combineReducers({ count, user, routing: routerReducer });

export default root;
