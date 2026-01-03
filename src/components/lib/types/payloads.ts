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

export interface RentalBody {
	id?: number;
	category?: number;
	name?: string;
	description?: string;
	delivery_fee?: number;
	longitude?: number;
	latitude?: number;
	contact_phone?: string;
	delivery_time?: string;
	created_on?: string;
	insurance_required?: number;
	is_active?: number;
	is_deleted?: number;
	is_banned?: number;
	is_confirmed?: number;
	specifications?: RentalSpec[];
	rates?: RentalRate[];
	images?: RentalImage[];
}
export interface RentalSpec {
	id?: number;
	rental_id?: number;
	label: string;
	value: string;
}

export interface RentalRate {
	id?: number;
	rental_id?: number;
	period: string;
	rate: number;
}

export interface RentalImage {
	id?: number;
	rental_id?: number;
	image: string;
	is_primary: number;
}

//service

export interface ServiceBody {
	id?: number;
	category?: number;
	seller?: number;
	title?: string;
	category_name?: string;
	seller_name?: string;
	description?: string;
	delivery_fee?: number;
	longitude?: number;
	latitude?: number;
	contact_phone?: string;
	delivery_time?: string;
	created_on?: string;
	is_active?: number;
	is_deleted?: number;
	is_banned?: number;
	is_confirmed?: number;
	specifications?: ServiceSpec[];
	rates?: ServiceRate[];
	image?: string;
	images?: ServiceImage[];
}

export interface ServiceSpec {
	id?: number;
	service_id?: number;
	label: string;
	value: string;
}

export interface ServiceRate {
	id?: number;
	service_id?: number;
	period: string;
	rate: number;
}

export interface ServiceImage {
	id?: number;
	service_id?: number;
	image: string;
	is_primary: number;
}
