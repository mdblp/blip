import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import httpStatus from "../lib/http-status-codes";
import { t } from "../lib/language";
import { HttpHeaderKeys } from "../models/api";
import { v4 as uuidv4 } from "uuid";
import { useAuth0 } from "@auth0/auth0-react";

interface Args {
  url: string;
  config?: AxiosRequestConfig;
}

interface ArgsWithPayload<P> extends Args {
  payload?: P;
}

export const useHttp = () => {
  const { getAccessTokenSilently } = useAuth0();

  const setConfig = async (config?: AxiosRequestConfig): Promise<AxiosRequestConfig> => ({
    ...config,
    headers: {
      Authorization: `Bearer ${await getAccessTokenSilently()}`,
      [HttpHeaderKeys.traceToken]: uuidv4(),
    },
  });

  const handleError = (error: AxiosError): Error => {
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
  };

  const getRequest = async <R>({ url, config }: Args): Promise<AxiosResponse<R>> => {
    try {
      console.log("access token : ", await getAccessTokenSilently());
      return await axios.get<R>(url, { ...await setConfig(config) });
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  };

  const postRequest = async <R, P = undefined>({ url, payload, config }: ArgsWithPayload<P>): Promise<AxiosResponse<R>> => {
    try {
      return await axios.post<R, AxiosResponse<R>, P>(url, payload, { ...config });
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  };

  const putRequest = async <R, P = undefined>({ url, payload, config }: ArgsWithPayload<P>): Promise<AxiosResponse<R>> => {
    try {
      return await axios.put<R, AxiosResponse<R>, P>(url, payload, { ...config });
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  };

  const deleteRequest = async ({ url, config }: Args): Promise<AxiosResponse> => {
    try {
      return await axios.delete(url, { ...config });
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  };

  return { getRequest, postRequest, putRequest, deleteRequest };
};
