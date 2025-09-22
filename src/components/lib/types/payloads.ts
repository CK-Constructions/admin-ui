export type TLoginBody = {
  username: string;
  password: string;
};

export type TUserFormData = {
  username: string;
  fullname: string;
  address: string;
  phone: string;
  status?: number;
  email: string;
  password?: string;
  image?: string | File | null;
};
export type TApprovalPayload = {
  listing_id: string;
  approval_status: string;
};

interface TAttribute {
  attribute_name: string;
  attribute_value: string;
}

interface TImage {
  image: string;
  is_primary: boolean;
}

interface TListingBody {
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  delivery_time: number;
  attributes: TAttribute[];
  images: TImage[];
}

export interface TCategoryBody {
  id?: number;
  name: string;
}
