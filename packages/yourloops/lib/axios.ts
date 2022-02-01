import axios, { AxiosRequestConfig } from "axios";
import appConfig from "./config";

axios.defaults.baseURL = appConfig.API_HOST;

/**
 * We use axios request interceptor to set the access token into headers each request the app send
 */
axios.interceptors.request.use((config): AxiosRequestConfig => {
  // console.log("coucou petite perruche", config);
  // get tokens in cookies
  return config;
});

// axios.interceptors.response.use(
//   response => response,
//   error => error
// )
// ;
