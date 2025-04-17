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
  is_active: number;
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

export interface TAdmin {
  id: number;
  username: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
  password?: string;
  created_on?: string;
  is_active?: number;
  image?: string; // if you need this field
}

export interface AdminResponse {
  count: number;
  list: TAdmin[];
}

export interface TAttribute {
  id: number;
  attribute_name: string;
  attribute_value: string;
}

export interface TImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface TListing {
  id: number;
  seller_id: number;
  category_id: number;
  seller_name: string;
  category_name: string;
  title: string;
  description: string;
  price: number;
  is_active?: number;
  delivery_time: number;
  created_on: string;
  image?: string;
  attributes?: TAttribute[];
  images?: TImage[];
}

export interface ListingResponse {
  result: TListing;
  success: boolean;
}

export interface TCategory {
  id: number;
  name: string;
  created_on: string;
  is_active: number;
}
