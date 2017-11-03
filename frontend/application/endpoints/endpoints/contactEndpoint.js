import endpoint from '../endpoint';
import utils from '../utils';

const contactEndpoint = endpoint({
  apiUrl: utils.API_URL,
  path: 'contact-us/send',
  send(name, email, text, subject) {
    const options = utils.buildOptions(this.apiUrl, this.path, 'post', {
      name, email, text, subject,
    });
    return this.apiCall(options);
  },
});

export default contactEndpoint;
