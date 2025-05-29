import axios, { AxiosError } from "axios";
import { Methods, TQueryParams } from "./components/lib/types/common";
import { TApprovalPayload, TCategoryBody, TLoginBody, TUserFormData } from "./components/lib/types/payloads";
import { store } from "./redux/store";
import { logOut } from "./redux/features/authSlice";
import { clearAdminCredentials } from "./components/utils/utils";
import { TRentalapproval, TServiceapproval } from "./components/lib/types/response";

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://127.0.0.1:8080/api/v1/admin";
} else {
  axios.defaults.baseURL = "https://tomthin.in/api/v1/admin";
}

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
export const loginUser = (body: TLoginBody) => _callApi("/login", "post", body);
export const logoutUser = () => _callApi("/logout", "post", "");

export const getProfile = () => _callApi(`/profile`, "get");
export const getTomthinInquiry = ({ offset, limit }: TQueryParams) => _callApi(`/ck-inquiries?offset=${offset}&limit=${limit}`, "get");
export const getCKInquiry = ({ offset, limit }: TQueryParams) => _callApi(`/inquiries?offset=${offset}&limit=${limit}`, "get");
export const getAllApprovals = () => _callApi(`/approvals`, "get");
export const updateApproval = ({ body, id }: { body: TApprovalPayload; id: number }) => _callApi(`/approvals/${id}`, "put", body);
//ADMIN USERS
export const getAllAdmins = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/support?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");
export const getAllAdminById = ({ id }: TQueryParams) => _callApi(`/support/${id}`, "get");
export const addAdmin = (body: TUserFormData) => _callApi("/support", "post", body);
export const updateAdmin = ({ body, id }: { body: TUserFormData; id: number }) => _callApi(`/support/${id}`, "put", body);
export const banAdminByID = ({ id }: TQueryParams) => _callApi(`/support/ban/${id}`, "put");
export const unbanAdminByID = ({ id }: TQueryParams) => _callApi(`/support/unban/${id}`, "put");
export const getListingById = ({ id }: TQueryParams) => _callApi(`/listings/${id}`, "get");
export const banListing = ({ id }: TQueryParams) => _callApi(`/listings/ban/${id}`, "put");
export const unBanListing = ({ id }: TQueryParams) => _callApi(`/listings/unban/${id}`, "put");
export const getListings = ({ id, category, seller, active, offset, limit }: TQueryParams) =>
  _callApi(`/listings?id=${id}&category=${category}&seller=${seller}&active=${active}&offset=${offset}&limit=${limit}`, "get");
export const getUsers = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/users?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");
export const getUserByID = ({ id }: TQueryParams) => _callApi(`/users/${id}`, "get");
export const banUserByID = ({ id }: TQueryParams) => _callApi(`/users/ban/${id}`, "put");
export const unbanUserByID = ({ id }: TQueryParams) => _callApi(`/users/unban/${id}`, "put");
export const getVendors = ({ username, mobile, email, offset, limit }: TQueryParams) =>
  _callApi(`/vendors?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, "get");
export const getVendorByID = ({ id }: TQueryParams) => _callApi(`/vendors/${id}`, "get");
export const banVendorByID = ({ id }: TQueryParams) => _callApi(`/vendors/ban/${id}`, "put");
export const unbanVendorByID = ({ id }: TQueryParams) => _callApi(`/vendors/unban/${id}`, "put");
//RENTALS
export const getAllRentals = ({ offset, limit }: TQueryParams) => _callApi(`/rentals?offset=${offset}&limit=${limit}`, "get");
export const getRentalByID = ({ id }: TQueryParams) => _callApi(`/rentals/${id}`, "get");

export const getAllRentalBans = ({ id, seller, offset, limit }: TQueryParams) => _callApi(`/rentals/bans?offset=${offset}&limit=${limit}&id=${id}&seller=${seller}`, "get");
export const getRentalBanByID = ({ id }: TQueryParams) => _callApi(`/rentals/${id}`, "get");

//RENTAL APPROVALS
export const updateRentalApprovals = ({ body, id }: { body: TRentalapproval; id: number }) => _callApi(`/rental-approval/${id}`, "put", body);
export const getActiveRentalApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/rental-approval?offset=${offset}&limit=${limit}`, "get");
export const getConfirmedRentalApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/rental-approval/confirmed?offset=${offset}&limit=${limit}`, "get");
export const getRejectedRentalApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/rental-approval/rejected?offset=${offset}&limit=${limit}`, "get");

//Service
export const getAllService = ({ offset, limit }: TQueryParams) => _callApi(`/services?offset=${offset}&limit=${limit}`, "get");
export const getServiceDetails = ({ id }: TQueryParams) => _callApi(`/services/${id}`, "get");
//Service APPROVALS
export const updateServiceApprovals = ({ body, id }: { body: TServiceapproval; id: number }) => _callApi(`/service-approval/${id}`, "put", body);
export const getActiveServiceApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/service-approval?offset=${offset}&limit=${limit}`, "get");
export const getConfirmedServiceApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/service-approval/confirmed?offset=${offset}&limit=${limit}`, "get");
export const getRejectedServiceApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/service-approval/rejected?offset=${offset}&limit=${limit}`, "get");

//Rental Categories
export const getActiveRentalCategories = ({ offset, limit, name, id }: TQueryParams) => _callApi(`/rental-categories?offset=${offset}&limit=${limit}&id=${id}&name=${name}`, "get");
export const AddRentalCategory = (body: TCategoryBody) => _callApi(`/rental-categories`, "post", body);
export const UpdateActivityRentalCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/rental-categories/activity/${id}`, "put", body);
export const UpdateRentalCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/rental-categories/${id}`, "put", body);
//Service Categories
export const AddServiceCategory = (body: TCategoryBody) => _callApi(`/service-categories`, "post", body);
export const UpdateActivityServiceCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/service-categories/activity/${id}`, "put", body);
export const UpdateServiceCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/service-categories/${id}`, "put", body);
export const getActiveServiceCategories = ({ offset, limit, name, id }: TQueryParams) =>
  _callApi(`/service-categories?offset=${offset}&limit=${limit}&id=${id}&name=${name}`, "get");

//Listing Categories
export const getAllCategories = () => _callApi(`/categories`, "get");
export const addListingCategory = (body: TCategoryBody) => _callApi(`/categories`, "post", body);
export const UpdateListingCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/categories/${id}`, "put", body);

export const baseMediaUril = `http://127.0.0.1:3060/api/media`;
const _callApi = async (url: string, method: Methods = "get", body = {}) => {
  try {
    const response = await axios[method](url, body);
    const { status, data } = response;
    if (status === 401) {
      if (data?.message === "Access Denied") {
        store.dispatch(logOut());
        clearAdminCredentials();
        return { success: false, message: "Access Denied" };
      }
      return { success: false };
    }
    if (status === 200 || status === 201) {
      return data;
    }
    return { success: false };
  } catch (error) {
    const err = error as AxiosError;
    return err.response?.data || { success: false, message: "Network Error" };
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
