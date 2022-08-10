import axios, { AxiosError, AxiosResponse } from 'axios';
import { authSignOutAction } from 'src/store/auth/action';
import config from 'src/store/config';

const { store } = config;

export const setAuthorizationHeader = (token?: string) => {
  if (token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else
    delete axios.defaults.headers.common['Authorization'];
}

export function sleep(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      await sleep();
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error && error.response) {
      if (error.response.status === 401) {
        store.dispatch(authSignOutAction());
      }
    };
    return Promise.reject(error);
  });

export default axios;

