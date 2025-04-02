import axios, { AxiosError } from "axios";
import { Methods, TQueryParams } from "./components/lib/types/common";
import { TLoginBody } from "./components/lib/types/payloads";

axios.defaults.baseURL = "http://127.0.0.1:8080/api/v1";
// if (process.env.MODE === "development") {
//   // axios.defaults.baseURL = "http://192.168.1.12:9800/api/v1";
//   // axios.defaults.baseURL = "http://192.168.1.2:9800/api/v1";
// } else {
//   axios.defaults.baseURL =
//     "https://admin.treehealthcare.in/api/v1";
// }

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

export const setAuthHeader = (token: string) => {
  axios.defaults.headers["Authorization"] = token;
  return true;
};

export const clearAuthHeader = () => {
  axios.defaults.headers["Authorization"] = null;
  return true;
};

export const loginUser = (body: TLoginBody) => _callApi("/admin/login", "post", body);

export const getUsers = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/admin/users?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");

export const getUserByID = ({ id }: TQueryParams) => _callApi(`/admin/users/${id}`, "get");

export const getVendors = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/admin/vendors?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");

export const getVendorByID = ({ id }: TQueryParams) => _callApi(`/admin/vendors/${id}`, "get");

const _callApi = async (url: string, method: Methods = "get", body = {}) => {
  try {
    const response = await axios[method](url, body);
    const { status, data } = response;
    if (status === 401) {
      return { success: false };
    } else if (status === 200 || status === 201) {
      return data;
    } else {
      return { success: false };
    }
  } catch (error) {
    const err = error as AxiosError;
    return err.response?.data;
  }
};
