import { getUserByID, getUsers, getVendorByID, getVendors } from "../api";
import { queryKeys } from "./keys";

export const queryConfigs = {
  //METADATA
  useGetUsers: {
    queryFn: getUsers,
    queryKey: [queryKeys.users],
  },
  useGetUserById: {
    queryFn: getUserByID,
    queryKey: [queryKeys.user],
  },
  useGetVendors: {
    queryFn: getVendors,
    queryKey: [queryKeys.vendors],
  },
  useGetVendorById: {
    queryFn: getVendorByID,
    queryKey: [queryKeys.vendor],
  },
  // addClinic: { mutationFn: addClinic, queryKey: [queryKeys.clinics] },
};
