import axios from 'axios';
import { ENVIRONMENT } from './environment';
import { LOCAL_STORAGE_KEYS } from 'src/lib/utils/constant';

const PROTOCOL = ENVIRONMENT.protocol;
const SERVER = ENVIRONMENT.server_url;
const PORT = ENVIRONMENT.port;
export const baseURL = (ENVIRONMENT.label === "dev") ? `${PROTOCOL}://${SERVER}:${PORT}` : `${PROTOCOL}://${SERVER}`;

const api = axios.create({
  //   withCredentials: true,
  baseURL: baseURL
});

api.interceptors.request.use(config => {
  // add auth header with jwt if account is logged in and request is to the api url
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZATION);
  console.log({ url: config.url, bearer: config.url.startsWith('/api') })
  if (config.url.startsWith('api') && token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    if (ENVIRONMENT.label === 'dev') {
      console.log({ url: response.config.url, params: response.config.params, responseData: response.data });
    }
    return response;
  }
  //   errorInterceptor => console.log({errorInterceptor})
);

class FormatResponse {
  code = 10;
  data = null;
  message = '';
  description = '';
  constructor(response) {
    if (response) {
      this.code = response.data.code;
      this.data = response.data.data;
      this.message = response.data.message;
      this.description = response.data.description;
    }
  }
}

/**
 * check if the response code is zero
 * @param FormatResponse formattedResponse 
 * @returns Boolean
 */
const isSuccess = (resp) => resp.code === 0;

const getHeaderTokenForSignal = () => {
  return {
    headers: { Authorization: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZATION) }
  }
}

export { api, FormatResponse, isSuccess, getHeaderTokenForSignal };
