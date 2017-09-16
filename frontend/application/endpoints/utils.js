const utils = {
  API_URL: 'http://api.codedoesgood.org:3000/api',
  TOKEN: '',
  buildOptions: (apiUrl, path, method, body) => ({
    apiUrl,
    path,
    method,
    body,
  }),
};

export default utils;
