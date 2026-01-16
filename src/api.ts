import axios, { AxiosError } from 'axios';
import { Methods, TBannerBody, TQueryParams } from './components/lib/types/common';
import { RentalBody, ServiceBody, TApprovalPayload, TCategoryBody, TLoginBody, TUserFormData } from './components/lib/types/payloads';
import { store } from './redux/store';
import { logOut } from './redux/features/authSlice';
import { clearAdminCredentials } from './components/utils/utils';
import {
	TBrand,
	TBrandImageBody,
	TDeleteBrandImageBody,
	TDeleteSubCatImageBody,
	TRentalapproval,
	TRentalBanBody,
	TServiceapproval,
	TSubCatImageBody,
} from './components/lib/types/response';

if (process.env.NODE_ENV === 'development') {
	// axios.defaults.baseURL = 'http://192.168.1.6:8100/api/v1/admin';
	axios.defaults.baseURL = 'https://tomthin.in/api/v1/admin';

	// axios.defaults.baseURL = 'http://185.199.52.20:8101/api/v1/admin';
	// axios.defaults.baseURL = 'http://127.0.0.1:8080/v1/admin';
} else {
	axios.defaults.baseURL = 'https://tomthin.in/api/v1/admin';
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

export const setAuthHeader = (token: string) => {
	axios.defaults.headers['Authorization'] = token;
	return true;
};

export const clearAuthHeader = () => {
	axios.defaults.headers['Authorization'] = null;
	return true;
};
// Authentication
export const loginUser = (body: TLoginBody) => _callApi('/login', 'post', body);
export const logoutUser = () => _callApi('/logout', 'post', '');

// Profile
export const getProfile = () => _callApi(`/profile`, 'get');

export const getUserAddresses = () => _callApi(`/addresses`, 'get');
export const getUserAddress = ({ id }: TQueryParams) => _callApi(`/addresses/${id}`, 'get');

// Inquiries
export const getTomthinInquiry = ({ offset, limit }: TQueryParams) => _callApi(`/ck-inquiries?offset=${offset}&limit=${limit}`, 'get');
export const getCKInquiry = ({ offset, limit }: TQueryParams) => _callApi(`/inquiries?offset=${offset}&limit=${limit}`, 'get');
export const getCKInteriorInquiry = ({ offset, limit }: TQueryParams) => _callApi(`/ck-interiors-inquiries?offset=${offset}&limit=${limit}`, 'get');

// Approvals
export const getAllApprovals = () => _callApi(`/approvals`, 'get');
export const updateApproval = ({ body, id }: { body: TApprovalPayload; id: number }) => _callApi(`/approvals/${id}`, 'put', body);

// Admin Users
export const getAllAdmins = ({ username, mobile, email, offset, limit }: TQueryParams) =>
	_callApi(`/support?offset=${offset}&limit=${limit}&mobile=${mobile}&email=${email}&username=${username}`, 'get');
export const getAllAdminById = ({ id }: TQueryParams) => _callApi(`/support/${id}`, 'get');
export const addAdmin = (body: TUserFormData) => _callApi('/support', 'post', body);
export const updateAdmin = ({ body, id }: { body: TUserFormData; id: number }) => _callApi(`/support/${id}`, 'put', body);
export const banAdminByID = ({ id }: TQueryParams) => _callApi(`/support/ban/${id}`, 'put');
export const unbanAdminByID = ({ id }: TQueryParams) => _callApi(`/support/unban/${id}`, 'put');

// Listings
export const getListingById = ({ id }: TQueryParams) => _callApi(`/listings/${id}`, 'get');
export const banListing = ({ id }: TQueryParams) => _callApi(`/listings/ban/${id}`, 'put');
export const unBanListing = ({ id }: TQueryParams) => _callApi(`/listings/unban/${id}`, 'put');
export const getListings = ({ id, category, seller, active, offset, limit }: TQueryParams) =>
	_callApi(`/listings?id=${id || ''}&category=${category || ''}&seller=${seller || ''}&active=${active || ''}&offset=${offset}&limit=${limit}`, 'get');

// Users
export const getUsers = ({ username, mobile, email, offset, limit }: TQueryParams) =>
	_callApi(`/users?offset=${offset}&limit=${limit}&mobile=${mobile || ''}&email=${email || ''}&username=${username || ''}`, 'get');
export const getUserByID = ({ id }: TQueryParams) => _callApi(`/users/${id}`, 'get');
export const banUserByID = ({ id }: TQueryParams) => _callApi(`/users/ban/${id}`, 'put');
export const unbanUserByID = ({ id }: TQueryParams) => _callApi(`/users/unban/${id}`, 'put');

// Vendors
export const getVendors = ({ username, mobile, email, offset, limit }: TQueryParams) =>
	_callApi(`/vendors?offset=${offset}&limit=${limit}&mobile=${mobile || ''}&email=${email || ''}&username=${username || ''}`, 'get');
export const getVendorByID = ({ id }: TQueryParams) => _callApi(`/vendors/${id}`, 'get');
export const banVendorByID = ({ id }: TQueryParams) => _callApi(`/vendors/ban/${id}`, 'put');
export const unbanVendorByID = ({ id }: TQueryParams) => _callApi(`/vendors/unban/${id}`, 'put');

// Rentals
export const getAllRentals = ({ offset, limit }: TQueryParams) => _callApi(`/rentals?offset=${offset}&limit=${limit}`, 'get');
export const getRentalByID = ({ id }: TQueryParams) => _callApi(`/rentals/${id}`, 'get');
export const getAllRentalBans = ({ id, seller, offset, limit }: TQueryParams) =>
	_callApi(`/rentals/bans?offset=${offset}&limit=${limit}&id=${id}&seller=${seller}`, 'get');
export const getRentalBanByID = ({ id, rental_id, ban_reason }: { id: number; rental_id: number; ban_reason: string }) =>
	_callApi(`/rentals/ban/${id}`, 'put', { rental_id, ban_reason });
export const getRentalUnBanByID = ({ id, rental_id, lift_reason }: { id: number; rental_id: number; lift_reason: string }) =>
	_callApi(`/rentals/unban/${id}`, 'put', { rental_id, lift_reason });

export const AddRental = (body: RentalBody) => _callApi(`/rentals`, 'post', body);
export const UpdateRental = ({ id, body }: { id: number; body: RentalBody }) => _callApi(`/rentals/${id}`, 'put', body);

// Rental Approvals
export const updateRentalApprovals = ({ body, id }: { body: TRentalapproval; id: number }) => _callApi(`/rental-approval/${id}`, 'put', body);
export const getActiveRentalApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/rental-approval?offset=${offset}&limit=${limit}`, 'get');
export const getConfirmedRentalApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/rental-approval/confirmed?offset=${offset}&limit=${limit}`, 'get');
export const getRejectedRentalApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/rental-approval/rejected?offset=${offset}&limit=${limit}`, 'get');

// Services
export const getAllService = ({ offset, limit }: TQueryParams) => _callApi(`/services?offset=${offset}&limit=${limit}`, 'get');
export const getServiceDetails = ({ id }: TQueryParams) => _callApi(`/services/${id}`, 'get');
export const AddService = (body: ServiceBody) => _callApi(`/services`, 'post', body);
export const UpdateService = ({ id, body }: { id: number; body: ServiceBody }) => _callApi(`/services/${id}`, 'put', body);
// Service Approvals
export const updateServiceApprovals = ({ body, id }: { body: TServiceapproval; id: number }) => _callApi(`/service-approval/${id}`, 'put', body);
export const getActiveServiceApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/service-approval?offset=${offset}&limit=${limit}`, 'get');
export const getConfirmedServiceApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/service-approval/confirmed?offset=${offset}&limit=${limit}`, 'get');
export const getRejectedServiceApprovals = ({ offset, limit }: TQueryParams) => _callApi(`/service-approval/rejected?offset=${offset}&limit=${limit}`, 'get');

// Rental Categories
export const getActiveRentalCategories = ({ offset, limit }: TQueryParams) => _callApi(`/rental-categories?offset=${offset}&limit=${limit}`, 'get');
export const AddRentalCategory = (body: TCategoryBody) => _callApi(`/rental-categories`, 'post', body);
export const UpdateActivityRentalCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/rental-categories/${id}`, 'put', body);
export const UpdateRentalCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/rental-categories/${id}`, 'put', body);

// Service Categories
export const AddServiceCategory = (body: TCategoryBody) => _callApi(`/service-categories`, 'post', body);
export const UpdateActivityServiceCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/service-categories/${id}`, 'put', body);
export const UpdateServiceCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/service-categories/${id}`, 'put', body);
export const getActiveServiceCategories = ({ offset, limit, name, id }: TQueryParams) => _callApi(`/service-categories?offset=${offset}&limit=${limit}`, 'get');

// Listing Categories
export const getAllCategories = ({ offset, limit }: TQueryParams) => _callApi(`/categories?offset=${offset}&limit=${limit}`, 'get');
export const addListingCategory = (body: TCategoryBody) => _callApi(`/categories`, 'post', body);
export const UpdateListingCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/categories/${id}`, 'put', body);

// Subcategories
export const addSubCategory = (body: TCategoryBody) => _callApi(`/subcategories`, 'post', body);
export const updateSubCategory = ({ body, id }: { body: TCategoryBody; id: number }) => _callApi(`/subcategories/${id}`, 'put', body);
export const getAllSubCategories = ({ offset, limit, name, id }: TQueryParams) =>
	_callApi(`/subcategories?offset=${offset}&limit=${limit}&id=${id}&name=${name}`, 'get');
export const getSubCategoryById = ({ id }: TQueryParams) => _callApi(`/subcategories?id=${id}`, 'get');
export const deleteSubCategory = (id: number) => _callApi(`/subcategories/${id}`, 'delete');

// Subcategory Images
export const getSubCatImage = ({ id }: TQueryParams) => _callApi(`/subcategories/images?id=${id}`, 'get');
export const addSubCatImage = (body: TSubCatImageBody) => _callApi(`/subcategories/images`, 'post', body);
export const deleteSubCatImage = ({ id, body }: { id: number; body: TDeleteSubCatImageBody }) => _callApi(`/subcategories/images/${id}`, 'put', body);

// Brands
export const getAllBrands = ({ offset, limit, name, id }: TQueryParams) => _callApi(`/brands?offset=${offset}&limit=${limit}&id=${id}&name=${name}`, 'get');
export const getBrandById = ({ id }: TQueryParams) => _callApi(`/brands?id=${id}`, 'get');
export const deleteBrand = ({ body, id }: { body: TBrand; id: number }) => _callApi(`/brands/delete/${id}`, 'put', body);
export const addBrand = (body: TBrand) => _callApi(`/brands`, 'post', body);
export const updateBrand = ({ body, id }: { body: TBrand; id: number }) => _callApi(`/brands/${id}`, 'put', body);

// Brand Images
export const getBrandImages = ({ id }: TQueryParams) => _callApi(`/brands/images?id=${id}`, 'get');
export const addBrandImages = (body: TBrandImageBody) => _callApi(`/brands/images`, 'post', body);
export const deleteBrandImages = ({ id, body }: { id: number; body: TDeleteBrandImageBody }) => _callApi(`/brands/images/${id}`, 'put', body);

// Listing Orders
export const getAllOrders = ({ offset, limit, name, id }: TQueryParams) =>
	_callApi(`/orders/listings?offset=${offset}&limit=${limit}&id=${id}&name=${name}`, 'get');
export const getOrderByID = ({ id }: TQueryParams) => _callApi(`/orders/listings/${id}`, 'get');
export const cancelListingOrder = ({ id }: { id: number }) => _callApi(`/orders/listings/cancel-order/${id}`, 'put', '');
export const redirectListingOrder = (body: { listing_order_id: number }) => _callApi(`/orders/listings/generate-listing-order`, 'post', body);

// Service Orders
export const getAllServiceOrders = ({ offset, limit, name, id }: TQueryParams) => _callApi(`/orders/services?offset=${offset}&limit=${limit}`, 'get');
export const getServiceOrder = ({ id }: TQueryParams) => _callApi(`/orders/services/${id}`, 'get');
export const cancelserviceOrder = ({ id }: { id: number }) => _callApi(`/orders/services/cancel-order/${id}`, 'put', '');
export const redirectServiceOrder = (body: { service_order_id: number }) => _callApi('/orders/services/generate-seller-order', 'post', body);

// Rental Orders
export const getAllRentalOrder = ({ offset, limit, name, id }: TQueryParams) => _callApi(`/orders/rentals?offset=${offset}&limit=${limit}`, 'get');
export const getRentalOrder = ({ id }: TQueryParams) => _callApi(`/orders/rentals/${id}`, 'get');
export const cancelRentalOrder = ({ id }: { id: number }) => _callApi(`/orders/rentals/cancel-order/${id}`, 'put', '');
export const updateRentalOrder = ({ id }: { id: number }) => _callApi(`/orders/rentals/update-order/${id}`, 'put', '');
export const redirectRentalOrder = (body: { rental_order_id: number }) => _callApi('/orders/rentals/generate-seller-order', 'post', body);

// Banners
export const getAllBanners = ({ offset, limit }: TQueryParams) => _callApi(`/banners?offset=${offset}&limit=${limit}`, 'get');
export const addBanner = (body: TBannerBody) => _callApi(`/banners`, 'post', body);
export const disableBanner = ({ id }: { id: number }) => _callApi(`/banners/disable/${id}`, 'put', '');
export const enableBanner = ({ id }: { id: number }) => _callApi(`/banners/enable/${id}`, 'put', '');

// Add this with your other rental order APIs

export const updateRentalOrderStatus = ({ id, new_status, reason }: { id: number; new_status: string; reason?: string }) =>
	_callApi(
		`/orders/rentals/update-order/${id}`, // ← This is the CORRECT path!
		'put',
		{ id, new_status, reason: reason || '' }
	);
export const getAllAddress = ({ offset, limit }: TQueryParams) => _callApi(`/user-address?offset=${offset}&limit=${limit}`, 'get');
export const baseMediaUril = `http://127.0.0.1:3060/api/media`;

const _callApi = async (url: string, method: Methods = 'get', body = {}) => {
	try {
		const response = await axios[method](url, body);
		const { status, data } = response;
		if (status === 401) {
			if (data?.message === 'Access Denied') {
				store.dispatch(logOut());
				clearAdminCredentials();
				return { success: false, message: 'Access Denied' };
			}
			return { success: false };
		}
		if (status === 200 || status === 201) {
			return data;
		}
		return { success: false };
	} catch (error) {
		const err = error as AxiosError;
		return err.response?.data || { success: false, message: 'Network Error' };
	}
};
// =====================
// Media Upload (S3 Presigned URL)
// =====================

export const uploadFileToS3 = async (file: File): Promise<string> => {
	if (!file) {
		throw new Error('No file provided');
	}

	try {
		// 1️⃣ Get presigned URL from backend
		const res = await axios.get('/uploads/presign', {
			params: {
				filename: file.name, // ❌ DO NOT encode
				type: file.type || 'application/octet-stream',
			},
		});

		const { uploadUrl, publicUrl } = res.data;

		if (!uploadUrl || !publicUrl) {
			throw new Error('Invalid presigned URL response');
		}

		// 2️⃣ Upload directly to S3
		const uploadRes = await fetch(uploadUrl, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type || 'application/octet-stream',
			},
		});

		if (!uploadRes.ok) {
			throw new Error('S3 upload failed');
		}

		// 3️⃣ Return public URL
		return publicUrl;
	} catch (error: any) {
		console.error('S3 upload error:', error);
		throw new Error(error?.response?.data?.error || error?.message || 'File upload failed');
	}
};
