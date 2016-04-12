import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import sync from './sync.js';
import count from './count.js';
import user from './user.js';

const root = combineReducers({ sync, count, user, routing: routerReducer });

export default root;
