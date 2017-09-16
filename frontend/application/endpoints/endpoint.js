import apiCall from './apiCall';
import utils from './utils';

export default function endpoint(details) {
  const options = details;
  options.apiCall = apiCall.bind(options);
  options.apiUrl = options.apiUrl || utils.API_URL;

  return options;
}
