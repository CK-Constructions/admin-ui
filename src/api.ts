import axios, { AxiosError } from "axios";
import { Methods, TQueryParams } from "./components/lib/types/common";
import { TApprovalPayload, TLoginBody, TUserFormData } from "./components/lib/types/payloads";

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

export const getAllCategories = () => _callApi(`/admin/categories`, "get");

export const getAllApprovals = () => _callApi(`/admin/approvals`, "get");
export const updateApproval = ({ body, id }: { body: TApprovalPayload; id: number }) => _callApi(`/admin/approvals/${id}`, "put", body);

//ADMIN USERS
export const getAllAdmins = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/admin/support?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");
export const getAllAdminById = ({ id }: TQueryParams) => _callApi(`/admin/support/${id}`, "get");
export const addAdmin = (body: TUserFormData) => _callApi("/admin/support", "post", body);
export const updateAdmin = ({ body, id }: { body: TUserFormData; id: number }) => _callApi(`/admin/support/${id}`, "put", body);
export const banAdminByID = ({ id }: TQueryParams) => _callApi(`/admin/support/ban/${id}`, "put");
export const unbanAdminByID = ({ id }: TQueryParams) => _callApi(`/admin/support/unban/${id}`, "put");

// LISTINGS

export const getListingById = ({ id }: TQueryParams) => _callApi(`/admin/listings/${id}`, "get");
export const banListing = ({ id }: TQueryParams) => _callApi(`/admin/listings/ban/${id}`, "put");
export const unBanListing = ({ id }: TQueryParams) => _callApi(`/admin/listings/unban/${id}`, "put");
export const getListings = ({ id, category, seller, active, offset, limit }: TQueryParams) =>
  _callApi(`/admin/listings?id=${id}&category=${category}&seller=${seller}&active=${active}&offset=${offset}&limit=${limit}`, "get");

// USER

export const getUsers = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/admin/users?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");
export const getUserByID = ({ id }: TQueryParams) => _callApi(`/admin/users/${id}`, "get");
export const banUserByID = ({ id }: TQueryParams) => _callApi(`/admin/users/ban/${id}`, "put");
export const unbanUserByID = ({ id }: TQueryParams) => _callApi(`/admin/users/unban/${id}`, "put");

// VENDORS
export const getVendors = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/admin/vendors?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");

export const getVendorByID = ({ id }: TQueryParams) => _callApi(`/admin/vendors/${id}`, "get");
export const banVendorByID = ({ id }: TQueryParams) => _callApi(`/admin/vendors/ban/${id}`, "put");
export const unbanVendorByID = ({ id }: TQueryParams) => _callApi(`/admin/vendors/unban/${id}`, "put");

export const baseMediaUril = `http://127.0.0.1:3060/api/media`;

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

export const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `${process.env.REACT_APP_TOKEN}`,
    },
  };

  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/media/upload`, formData, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
