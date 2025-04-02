export interface TUser {
  id: number;
  username: string;
  fullname: string;
  mobile: string;
  email: string;
  address: string;
  gender: string;
  created_on: string;
  status: string | number | null;
  profile_picture?: string;
}

export interface IVendor {
  id: number;
  username: string;
  fullname: string;
  email: string;
  mobile: string;
  address: string;
  password: string;
  verified: boolean;
  aadhaar: string;
  pan: string;
  gst: string;
  created_on: string;
  profile_picture: string;
  status: string;
  is_deleted: number;
  is_active: number;
}
