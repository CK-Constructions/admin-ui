import {
  addAdmin,
  addBanner,
  addBrand,
  addBrandImages,
  addListingCategory,
  AddRentalCategory,
  AddServiceCategory,
  addSubCategory,
  addSubCatImage,
  banAdminByID,
  banListing,
  banUserByID,
  banVendorByID,
  cancelRentalOrder,
  deleteBrand,
  deleteBrandImages,
  deleteSubCategory,
  deleteSubCatImage,
  disableBanner,
  enableBanner,
  getActiveRentalApprovals,
  getActiveRentalCategories,
  getActiveServiceApprovals,
  getActiveServiceCategories,
  getAllAdminById,
  getAllAdmins,
  getAllApprovals,
  getAllBanners,
  getAllBrands,
  getAllCategories,
  getAllOrders,
  getAllRentalBans,
  getAllRentalOrder,
  getAllRentals,
  getAllService,
  getAllServiceOrders,
  getAllSubCategories,
  getBrandById,
  getBrandImages,
  getCKInquiry,
  getConfirmedRentalApprovals,
  getConfirmedServiceApprovals,
  getListingById,
  getListings,
  getOrderByID,
  getProfile,
  getRejectedRentalApprovals,
  getRejectedServiceApprovals,
  getRentalBanByID,
  getRentalByID,
  getRentalOrder,
  getServiceDetails,
  getServiceOrder,
  getSubCategoryById,
  getSubCatImage,
  getTomthinInquiry,
  getUserByID,
  getUsers,
  getVendorByID,
  getVendors,
  logoutUser,
  unbanAdminByID,
  unBanListing,
  unbanUserByID,
  unbanVendorByID,
  UpdateActivityRentalCategory,
  UpdateActivityServiceCategory,
  updateAdmin,
  updateApproval,
  updateBrand,
  UpdateListingCategory,
  updateRentalApprovals,
  UpdateRentalCategory,
  updateServiceApprovals,
  UpdateServiceCategory,
  updateSubCategory,
} from "../api";
import { queryKeys } from "./keys";

export const queryConfigs = {
  //USERS
  useGetProfile: { queryFn: getProfile, queryKey: [queryKeys.profile] },
  useLogoutUser: { queryFn: logoutUser, queryKey: [queryKeys.auth] },
  useGetUsers: { queryFn: getUsers, queryKey: [queryKeys.users] },
  useGetUserById: { queryFn: getUserByID, queryKey: [queryKeys.user] },
  useBanUser: { mutationFn: banUserByID, invalidateKey: [queryKeys.ban, queryKeys.vendors] },
  useUnBanUser: { mutationFn: unbanUserByID, invalidateKey: [queryKeys.unban, queryKeys.vendors] },

  // VENDORS
  useGetVendors: { queryFn: getVendors, queryKey: [queryKeys.vendors] },
  useGetVendorById: { queryFn: getVendorByID, queryKey: [queryKeys.vendor] },
  useBanVendor: { mutationFn: banVendorByID, invalidateKey: [queryKeys.ban, queryKeys.vendors] },
  useUnBanVendor: { mutationFn: unbanVendorByID, invalidateKey: [queryKeys.unban, queryKeys.vendors] },
  // addClinic: { mutationFn: addClinic, queryKey: [queryKeys.clinics] },

  //ADMIN SUPPORT
  useGetAdmins: { queryFn: getAllAdmins, queryKey: [queryKeys.admins] },
  useGetAdminById: { queryFn: getAllAdminById, queryKey: [queryKeys.admin] },
  useAddAdmin: { mutationFn: addAdmin, queryKey: [queryKeys.admins] },
  useUpdateAdmin: { mutationFn: updateAdmin, invalidateKey: [queryKeys.admins, queryKeys.admin] },
  useBanAdmin: { mutationFn: banAdminByID, queryKey: [queryKeys.admins] },
  useUnBanAdmin: { mutationFn: unbanAdminByID, queryKey: [queryKeys.admins] },

  // LISTINGS
  useGetListings: { queryFn: getListings, queryKey: [queryKeys.listings] },
  useGetListingByID: { queryFn: getListingById, queryKey: [queryKeys.listing] },
  useBanListing: { mutationFn: banListing, queryKey: [queryKeys.listings] },
  useUnBanListing: { mutationFn: unBanListing, queryKey: [queryKeys.listings] },

  //CATEGORIES
  useGetAllCategories: { queryFn: getAllCategories, queryKey: [queryKeys.categories] },
  useAddCategories: { queryFn: addListingCategory, queryKey: [queryKeys.categories] },
  useUpdateCategories: { queryFn: UpdateListingCategory, queryKey: [queryKeys.categories] },
  //APPROVALS
  useGetAllApprovals: { queryFn: getAllApprovals, queryKey: [queryKeys.approvals] },
  useUpdateApproval: { mutationFn: updateApproval, queryKey: [queryKeys.approvals] },
  //INQUIRY
  useGetTomthinInquiry: { queryFn: getTomthinInquiry, queryKey: [queryKeys.ckinquiry] },
  useGetCKInquiry: { queryFn: getCKInquiry, queryKey: [queryKeys.tomthininquiry] },

  //RENTALS AND BANS
  useGetAllRentals: { queryFn: getAllRentals, queryKeys: [queryKeys.rentals] },
  useGetRentalById: { queryFn: getRentalByID, queryKeys: [queryKeys.rental] },
  useGetAllRentalBans: { queryFn: getAllRentalBans, queryKeys: [queryKeys.rentalbans] },
  useGetRentalBanByID: { queryFn: getRentalBanByID, queryKeys: [queryKeys.rentalban] },

  //RENTAL APPROVALs

  useUpdateRentalApproval: { queryFn: updateRentalApprovals, queryKeys: [queryKeys.rentalapprovals] },
  useActiveGetRental: { queryFn: getActiveRentalApprovals, queryKeys: [queryKeys.rentalapprovals] },
  useConfirmedGetRental: { queryFn: getConfirmedRentalApprovals, queryKeys: [queryKeys.confirmed_rentalapprovals] },
  useRejectedGetRental: { queryFn: getRejectedRentalApprovals, queryKeys: [queryKeys.rejected_rentalapprovals] },

  //Service approval
  useUpdateService: { queryFn: updateServiceApprovals, queryKeys: [queryKeys.serviceapprovals] },
  useActiveGetService: { queryFn: getActiveServiceApprovals, queryKeys: [queryKeys.serviceapprovals] },
  useConfirmedGetService: { queryFn: getConfirmedServiceApprovals, queryKeys: [queryKeys.confirmed_serviceapprovals] },
  useRejectedGetService: { queryFn: getRejectedServiceApprovals, queryKeys: [queryKeys.rejected_serviceapprovals] },

  useGetAllService: { queryFn: getAllService, queryKeys: [queryKeys.services] },
  useGetServiceDetails: { queryFn: getServiceDetails, queryKeys: [queryKeys.service] },

  //Service Categories
  useGetServiceCategories: { queryFn: getActiveServiceCategories, queryKeys: [queryKeys.service_categories] },
  useAddServiceCategory: { queryFn: AddServiceCategory, queryKeys: [queryKeys.service_categories] },
  useUpdateServiceCategory: { queryFn: UpdateServiceCategory, queryKeys: [queryKeys.service_categories] },
  useUpdateServiceActivity: { queryFn: UpdateActivityServiceCategory, queryKeys: [queryKeys.service_categories] },

  //Rental Categories
  useGetRentalCategories: { queryFn: getActiveRentalCategories, queryKeys: [queryKeys.rental_categories] },
  useAddRentalCategory: { queryFn: AddRentalCategory, queryKeys: [queryKeys.rental_categories] },
  useUpdateRentalCategory: { queryFn: UpdateRentalCategory, queryKeys: [queryKeys.rental_categories] },
  useUpdateRentalActivity: { queryFn: UpdateActivityRentalCategory, queryKeys: [queryKeys.rental_categories] },

  //subCategory
  useGetAllSubCategories: { queryFn: getAllSubCategories, queryKeys: [queryKeys.sub_categories] },
  useSubCategoryById: { queryFn: getSubCategoryById, queryKeys: [queryKeys.sub_category] },
  useAddSubCategory: { queryFn: addSubCategory, queryKeys: [queryKeys.sub_categories] },
  useUpdateSubCategory: { queryFn: updateSubCategory, queryKeys: [queryKeys.sub_categories] },
  useDeleteSubCategory: { queryFn: deleteSubCategory, queryKeys: [queryKeys.sub_categories] },

  //Brands

  useAllBrands: { queryFn: getAllBrands, queryKeys: [queryKeys.brands] },
  useBrandById: { queryFn: getBrandById, queryKeys: [queryKeys.brand] },
  useAddBrand: { queryFn: addBrand, queryKeys: [queryKeys.brands] },
  useUpdateBrand: { queryFn: updateBrand, queryKeys: [queryKeys.brands] },
  useDeleteBrand: { queryFn: deleteBrand, queryKeys: [queryKeys.brands] },

  //Brands Images

  useGetAllBrandImages: { queryFn: getBrandImages, queryKeys: [queryKeys.brand_images] },
  useAddBrandImages: { queryFn: addBrandImages, queryKeys: [queryKeys.brand_images] },
  // useUpdateBrandImages: { queryFn: updateBrandImages, queryKeys: [queryKeys.brand_images] },
  useDeleteBrandImages: { queryFn: deleteBrandImages, queryKeys: [queryKeys.brand_images] },

  //Sub Category Image
  useGetAllSubCategoryImages: { queryFn: getSubCatImage, queryKeys: [queryKeys.subcategory_images] },
  useAddSubCategoryImage: { queryFn: addSubCatImage, queryKeys: [queryKeys.subcategory_images] },
  useDeleteSubCategoryImages: { queryFn: deleteSubCatImage, queryKeys: [queryKeys.subcategory_images] },

  //BANNER
  useGetAllBanners: { queryFn: getAllBanners, queryKeys: [queryKeys.banners] },
  useAddBanner: { queryFn: addBanner, queryKeys: [queryKeys.banners] },
  useEnableBanner: { queryFn: enableBanner, queryKeys: [queryKeys.banners] },
  useDisableBanner: { queryFn: disableBanner, queryKeys: [queryKeys.banners] },
  //ORDER

  useGetAllOrders: { queryFn: getAllOrders, queryKeys: [queryKeys.orders] },
  useGetOrderById: { queryFn: getOrderByID, queryKey: [queryKeys.order] },

  //servcieorder
  useGetAllServiceOrder: { queryFn: getAllServiceOrders, queryKeys: [queryKeys.serviceorders] },
  useGetServiceOrder: { queryFn: getServiceOrder, queryKeys: [queryKeys.serviceorder] },
  useCancelServiceOrder: { queryFn: cancelRentalOrder, queryKeys: [queryKeys.serviceorders] },

  //rentalorder
  useGetAllRentalOrder: { queryFn: getAllRentalOrder, queryKeys: [queryKeys.rentalorders] },
  useGetRentalOrder: { queryFn: getRentalOrder, queryKeys: [queryKeys.rentalorder] },
  useCancelRentalOrder: { queryFn: cancelRentalOrder, queryKeys: [queryKeys.rentalorders] },
};
