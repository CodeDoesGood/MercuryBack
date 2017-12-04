import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authentication from './authentication';
import announcements from './announcements';
import notifications from './notifications';
import contact from './contact';
import client from './client';
import profile from './profile';
import projects from './projects';

// setup the master reducer
const rootReducer = combineReducers({
  announcements,
  authentication,
  contact,
  client,
  notifications,
  profile,
  projects,
  routing: routerReducer,
});

export default rootReducer;
