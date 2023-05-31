/* eslint-disable dot-notation */
import axios from "axios";
import { errorToast } from "components/common/toasts/toast";

export function apiInstance2(
  endpoint,
  { method = "GET", data, params, body, ...customConfig } = {}
) {
  let url = "";

  const headers = { "content-type": "application/json" };

  const config = {
    method,
    data: data || body,
    ...customConfig,
    params,
    headers: {
      ...headers,
      ...customConfig.headers,
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  if (!process.env.REACT_APP_API_URL) {
    url = endpoint;
  } else {
    url = `${process.env.REACT_APP_API_URL}${endpoint}`;
  }
  return axios(url, config)
    .then(async (response) => {
      const data = response.data;

      if (!response.statusText) {
        return {
          ok: response.statusText,
          ...data,
        };
      }
    })
    .catch(async (_err) => {
      let message;
      switch (_err?.response?.status) {
        case 400:
          message = "Bad Request";
          break;
        case 401:
          message = "You're not Authenticated. Kindly Login";
          break;
        case 403:
          message = "UnAuthorised User";
          break;
        case 404:
          message = "Resource not found";
          break;
        case 500:
          message = "Internal server error";
          break;
        default:
          message = "";
      }

      if (_err?.response?.data)
        errorToast(
          "Error",
          _err.response.data.message
            ? _err.response.data.message
            : "An error occured"
        );

      const errorRes = {
        response: {
          ok: _err?.response?.statusText,
          custom_message: message,
          data: _err?.response?.data,
        },
      };
      await Promise.reject(errorRes);
    });
}

export const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export const setToken = (token) => {
  apiInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  apiInstance.defaults.withCredentials = false;
};
