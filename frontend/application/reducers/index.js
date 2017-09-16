import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authentication from './authentication';
import contact from './contact';
import client from './client';

// setup the master reducer
const rootReducer = combineReducers({
  authentication,
  contact,
  client,
  routing: routerReducer,
});

export default rootReducer;
