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
  image?: string;
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

export interface TBrand {
  id: number;
  name: string;
  created_on: string;
  category_name: string;
  category_id: number;
  is_active: number;
}
export interface TSubCategory {
  id: number;
  name: string;
  created_on: string;
  category_name: string;
  category_id: number;
  is_active: number;
}
export interface TInquiry {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  message: string;
  created_on: string;
}
export type TRentalItem = {
  id: number;
  seller_id: number;
  seller_name: string;
  seller_fullname: string;
  category: number;
  category_name: string;
  name: string;
  description: string;
  delivery_fee: number;
  contact_phone: string;
  delivery_time: string;
  created_on: string;
  rates?: string;
  images: string;
  insurance_required: number;
  is_active: number;
};
export type TRentalBanBody = {
  id?: number;
  rental_id?: number;
  banned_by?: number;
  lifted_by?: number;
  ban_reason?: string;
  lift_reason?: string;
  banned_on?: string;
  lifted_on?: string;
  is_active?: number;
  banned_by_name?: string;
  lifted_by_name?: string;
  created_on?: string;
  seller_name?: string;
};
export type TRentalSpecification = {
  id: number | null;
  rental_id: number | null;
  label: string;
  value: string;
};
export type TRentalRate = {
  id: number;
  period: string;
  rate: number;
};
export type TRentalImage = {
  id: number;
  image: string;
  is_primary: number;
};
export type TRentalDetails = {
  id: number;
  seller_id: number;
  seller_name: string;
  seller_fullname: string | null;
  category: number;
  category_name: string;
  name: string;
  description: string;
  delivery_fee: number | null;
  contact_phone: string;
  delivery_time: string;
  created_on: string | null;
  images: string;
  is_active: number;
  specifications: TRentalSpecification[];
  rates_list: TRentalRate[];
  images_list: TRentalImage[];
};
export type TRentalapproval = {
  id: number;
  approval_status: number | null;
  rental_id: number;
  category: number;
  seller_id: number;
  approved_on: string;
  created_on: string;
  seller_username: string;
  seller_fullname: string;
  category_name: string;
};
export type TServiceapproval = {
  id: number;
  approval_status: number | null;
  service_id: number;
  category: number;
  seller_id: number;
  approved_on: string;
  created_on: string;
  seller_username: string;
  seller_fullname: string;
  category_name: string;
};

export interface TBrandImage {
  id?: number;
  image?: string;
  brand_id?: number;
  brand_name?: number;
}

export interface TBrandImageBody {
  id?: number;
  images?: TBrandImage[];
}
export interface TSubCatImage {
  id?: number;
  image?: string;
  brand_id?: number;
  brand_name?: number;
}

export interface TSubCatImageBody {
  id?: number;
  images?: TSubCatImage[];
}
export interface TDeleteSubCatImageBody {
  id?: number[];
}
export interface TDeleteBrandImageBody {
  id?: number[];
}
