import axios, { AxiosRequestConfig } from "axios";
import appConfig from "./config";
import { STORAGE_KEY_SESSION_TOKEN } from "./auth/hook";
import { HttpHeaderKeys } from "../models/api";

axios.defaults.baseURL = appConfig.API_HOST;

/**
 * We use axios request interceptor to set the access token into headers each request the app send
 */
axios.interceptors.request.use((config): AxiosRequestConfig => {
  // TODO create util functions to get tokens from local storage
  const token = sessionStorage.getItem(STORAGE_KEY_SESSION_TOKEN);
  config = {
    ...config,
    headers: {
      [HttpHeaderKeys.sessionToken]: token as string,
    },
  };
  return config;
});
