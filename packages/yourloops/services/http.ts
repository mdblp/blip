import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import httpStatus from "../lib/http-status-codes";
import { t } from "../lib/language";

export default class HttpService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return axios.get<T>(url, { ...config });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async post<T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axios.post<T>(url, payload, { ...config });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async put<T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await axios.put<T>(url, payload, { ...config });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await axios.delete(url, { ...config });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: AxiosError): Error {
    if (error.response) {
      if (error.response.status >= 400 && error.response.status <= 550) {
        switch (error.response.status) {
        case httpStatus.StatusInternalServerError:
          throw Error(t("error-http-500"));
        default:
          throw Error(t("error-http-40x"));
        }
      }
    }
    return error;
  }
}
