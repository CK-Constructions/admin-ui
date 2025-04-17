import {
  addAdmin,
  banAdminByID,
  banListing,
  banUserByID,
  banVendorByID,
  getAllAdminById,
  getAllAdmins,
  getAllApprovals,
  getAllCategories,
  getListingById,
  getListings,
  getUserByID,
  getUsers,
  getVendorByID,
  getVendors,
  unbanAdminByID,
  unBanListing,
  unbanUserByID,
  unbanVendorByID,
  updateAdmin,
  updateApproval,
} from "../api";
import { queryKeys } from "./keys";

export const queryConfigs = {
  //USERS
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
  //APPROVALS
  useGetAllApprovals: { queryFn: getAllApprovals, queryKey: [queryKeys.approvals] },
  useUpdateApproval: { mutationFn: updateApproval, queryKey: [queryKeys.approvals] },
};
