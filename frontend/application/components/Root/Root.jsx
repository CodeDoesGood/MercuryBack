import React from 'react';
import { Provider } from 'react-redux';

import store from '../../containers/store';

import Application from '../../connectors/ApplicationApp';

export default function Root() {
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  );
}
