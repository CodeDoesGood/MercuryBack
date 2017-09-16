import * as apiCall from './apiCall';
import utils from './utils';

import contactEndpoint from './endpoints/contactEndpoint';
import volunteerEndpoint from './endpoints/volunteerEndpoint';

export default function endpointApi(token = null) {
  const setUtil = (key, value) => {
    utils[key] = value;
  };

  const getUtil = key => utils[key];

  if (token !== null) {
    setUtil('TOKEN', token);
  }

  return {
    apiCall,
    contact: contactEndpoint,
    volunteer: volunteerEndpoint,
    setUtil,
    getUtil,
    utils,
  };
}

