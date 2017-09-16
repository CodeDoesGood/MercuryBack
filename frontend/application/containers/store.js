import { createStore } from 'redux';

import endpoints from '../endpoints/index';
import rootReducer from '../reducers/index';

const authentication = { username: null, result: false };
const client = endpoints();

const defaultState = {
  authentication,
  client,
};

const store = createStore(rootReducer, defaultState);

export default store;
