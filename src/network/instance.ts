import axios from 'axios';
import config from '../config';

const instance = axios.create({
  baseURL: config.baseAPIURL,
  // TODO: use an interceptor to update the token after adding any dynamic login mechanism
  headers: {
    Authorization: `Bearer ${config.GORestAccessToken}`,
  },
});

export default instance;
