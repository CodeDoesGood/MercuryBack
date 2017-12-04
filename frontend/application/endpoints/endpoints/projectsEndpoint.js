import endpoint from '../endpoint';
import utils from '../utils';

const volunteerEndpoint = endpoint({
  apiUrl: utils.API_URL,
  path: 'projects',
  getActive() {
    const options = utils.buildOptions(this.apiUrl, `${this.path}/all/active`, 'get', {});
    return this.apiCall(options);
  },
});

export default volunteerEndpoint;
