import endpoint from '../endpoint';
import utils from '../utils';

const volunteerEndpoint = endpoint({
  apiUrl: utils.API_URL,
  path: 'volunteer',
  authenticate(username, password) {
    const options = utils.buildOptions(this.apiUrl, `${this.path}/authenticate`, 'post', { username, password });
    return this.apiCall(options);
  },
  resetRequest(username, email) {
    const options = utils.buildOptions(this.apiUrl, `${this.path}/password/request_reset`, 'post', { username, email });
    return this.apiCall(options);
  },
  resetPassword(username, code, password) {
    const options = utils.buildOptions(this.apiUrl, `${this.path}/password/reset`, 'post', { username, reset_code: code, password });
    return this.apiCall(options);
  },
  verifyAccount(username, code) {
    const options = utils.buildOptions(this.apiUrl, `${this.path}/verify`, 'post', { username, code });
    return this.apiCall(options);
  },
});

export default volunteerEndpoint;